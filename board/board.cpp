#include <FirebaseESP32.h>
#include <HTTPClient.h>
#include <LiquidCrystal_I2C.h>
#include <WiFi.h>


// 1. WiFi & Firebase Setup
#define WIFI_SSID "HelloJi"
#define WIFI_PASSWORD "nahipata"
#define FIREBASE_HOST                                                          \
  "ai-smart-sentinel-node-system-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "2s6SGgjASbxQbvnEsgBKWMcAr4OZK6WLSje1SYwH"

// 2. Alert System Token (Pushbullet)
const char *pushbullet_token = "o.qUBqlyHcFf7xJIEHySfzYDR4FNlfTHUq";

// 3. Hardware Pin Definitions
#define CURRENT_PIN 34
#define VOLTAGE_PIN 35
#define RELAY_PIN 26

// 4. Device Identifier (Serial Key)
#define DEVICE_ID "12345678901"

// Global Objects
FirebaseConfig config;
FirebaseAuth auth;
FirebaseData fbdo;
LiquidCrystal_I2C lcd(0x27, 16, 2);

// --- Sentinel Intelligence Variables ---
float sensorOffset = 0; // To fix ghost readings
int overloadCount = 0;
unsigned long strikeStartTime = 0;
bool isCountingDown = false;
float timeLimits[] = {120.0, 90.0, 60.0};
float safetyLimit = 2.0;
String lastStatus = "OFF"; // To detect manual web toggle

// --- ESP Status / Heartbeat ---
unsigned long lastHeartbeat = 0;
const unsigned long HEARTBEAT_INTERVAL = 5000; // Send heartbeat every 5 seconds

// --- Helper Function: Send Phone Notification ---
void sendAlert(String message) {
  HTTPClient http;
  http.begin("https://api.pushbullet.com/v2/pushes");
  http.addHeader("Access-Token", pushbullet_token);
  http.addHeader("Content-Type", "application/json");
  String json =
      "{\"type\": \"note\", \"title\": \"SENTINEL ALERT\", \"body\": \"" +
      message + "\"}";
  http.POST(json);
  http.end();
}

void setup() {
  Serial.begin(115200);
  lcd.init();
  lcd.backlight();
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  lcd.print("Connecting WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  config.host = FIREBASE_HOST;
  config.signer.tokens.legacy_token = FIREBASE_AUTH;
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  // --- Mark ESP as Live on Firebase ---
  Firebase.setString(fbdo, String("/nodes/") + DEVICE_ID + "/esp_status", "Live");
  Firebase.setInt(fbdo, String("/nodes/") + DEVICE_ID + "/last_seen", (int)(millis() / 1000));

  // --- AUTO-CALIBRATION (Fixes 4.26A Ghosting) ---
  lcd.clear();
  lcd.print("Calibrating...");
  float total = 0;
  for (int i = 0; i < 100; i++) {
    total += analogRead(CURRENT_PIN);
    delay(10);
  }
  sensorOffset = (total / 100.0) * (3.3 / 4095.0);

  lcd.clear();
  lcd.print("Sentinel Online");
}

void loop() {
  // --- A. SESSION & COMMAND LISTENER ---
  if (Firebase.getString(fbdo, String("/nodes/") + DEVICE_ID + "/active_session")) {
    String activeSession = fbdo.stringData();

    if (activeSession == "" || activeSession == "null") {
      digitalWrite(RELAY_PIN, LOW);
      lcd.setCursor(0, 1);
      lcd.print("SESSION LOCKED  ");
    } else {
      if (Firebase.getString(fbdo, String("/nodes/") + DEVICE_ID + "/relay_status")) {
        String currentStatus = fbdo.stringData();

        // ✨ FIX: RESET ROUNDS IF WEB TOGGLE DETECTED
        if (currentStatus != lastStatus) {
          overloadCount = 0;
          isCountingDown = false;
          lcd.clear();
          lastStatus = currentStatus;
        }

        digitalWrite(RELAY_PIN, (currentStatus == "ON") ? HIGH : LOW);
      }
    }
  }

  // --- B. CALIBRATED SENSOR DATA ---
  int rawC = 0;
  for (int i = 0; i < 20; i++)
    rawC += analogRead(CURRENT_PIN);
  rawC /= 20;

  float voltageAtPin = (rawC / 4095.0) * 3.3;
  float currentAmps = (voltageAtPin - sensorOffset) / 0.185;

  // Filter out tiny fluctuations
  if (abs(currentAmps) < 0.22)
    currentAmps = 0.0;

  // Real-time Voltage scaling
  int rawV = analogRead(VOLTAGE_PIN);
  float voltageVal = (rawV > 100) ? (rawV * (240.0 / 4095.0)) : 0;

  Firebase.setFloat(fbdo, String("/nodes/") + DEVICE_ID + "/current_flow", abs(currentAmps));
  Firebase.setFloat(fbdo, String("/nodes/") + DEVICE_ID + "/voltage_level", voltageVal);

  // --- ESP Heartbeat (every 5 seconds) ---
  if (millis() - lastHeartbeat >= HEARTBEAT_INTERVAL) {
    lastHeartbeat = millis();
    Firebase.setString(fbdo, String("/nodes/") + DEVICE_ID + "/esp_status", "Live");
    Firebase.setInt(fbdo, String("/nodes/") + DEVICE_ID + "/last_seen", (int)(millis() / 1000));
  }

  // --- C. 3-ROUND INTELLIGENCE ---
  if (currentAmps > safetyLimit && digitalRead(RELAY_PIN) == HIGH) {

    if (!isCountingDown && overloadCount < 3) {
      strikeStartTime = millis();
      isCountingDown = true;
      sendAlert("⚠️ ROUND " + String(overloadCount + 1) +
                " ALERT: Overload detected.");
    }

    if (isCountingDown) {
      int elapsed = (millis() - strikeStartTime) / 1000;
      int remaining = (int)timeLimits[overloadCount] - elapsed;

      lcd.setCursor(0, 0);
      lcd.print("STRIKE " + String(overloadCount + 1) + " ACTIVE ");
      lcd.setCursor(0, 1);
      lcd.print("CUT IN: " + String(remaining) + "s      ");

      if (remaining <= 0) {
        overloadCount++;
        isCountingDown = false;

        if (overloadCount >= 3) {
          sendAlert("🚫 HARD SHUTDOWN: Safety triggered.");
          Firebase.setString(fbdo, String("/nodes/") + DEVICE_ID + "/relay_status", "OFF");
          digitalWrite(RELAY_PIN, LOW);
        } else {
          sendAlert("Strike " + String(overloadCount) +
                    " hit. Next round active.");
        }
      }
    }
  } else {
    if (isCountingDown) {
      isCountingDown = false;
      lcd.clear();
    }

    lcd.setCursor(0, 0);
    lcd.print("SENTINEL ACTIVE ");
    lcd.setCursor(0, 1);
    String pStat = (digitalRead(RELAY_PIN) == HIGH) ? "ON " : "OFF";
    lcd.print("PWR:" + pStat + " " + String(abs(currentAmps)) + "A    ");
  }

  delay(500);
}