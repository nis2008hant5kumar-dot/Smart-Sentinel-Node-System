import styles from './Components.module.css';
import { Cpu, Wifi, Database, Zap, Activity, Radio, Monitor, ToggleLeft } from 'lucide-react';

const COMPONENTS = [
  {
    name: 'ESP32 Dev Board',
    role: 'Main Microcontroller',
    icon: Cpu,
    color: '#4facfe',
    specs: ['Dual-core 240MHz', '520KB SRAM', 'Wi-Fi + Bluetooth'],
    pin: 'Core'
  },
  {
    name: 'ACS712 (30A)',
    role: 'Current Sensor',
    icon: Activity,
    color: '#00f2fe',
    specs: ['Range: 0–30A', 'Sensitivity: 66mV/A', 'Pin: GPIO 34'],
    pin: 'GPIO 34'
  },
  {
    name: 'ZMPT101B',
    role: 'Voltage Sensor',
    icon: Zap,
    color: '#a855f7',
    specs: ['AC Voltage: 0–250V', 'Scaled to 3.3V ADC', 'Pin: GPIO 35'],
    pin: 'GPIO 35'
  },
  {
    name: '5V Relay Module',
    role: 'Power Switch',
    icon: ToggleLeft,
    color: '#f59e0b',
    specs: ['Load: up to 10A/250VAC', 'Control: 5V TTL', 'Pin: GPIO 26'],
    pin: 'GPIO 26'
  },
  {
    name: 'LCD 16×2 I2C',
    role: 'Local Display',
    icon: Monitor,
    color: '#10b981',
    specs: ['16 cols × 2 rows', 'I2C address: 0x27', 'SDA/SCL pins'],
    pin: 'I2C'
  },
  {
    name: 'Firebase RTDB',
    role: 'Cloud Database',
    icon: Database,
    color: '#f97316',
    specs: ['Real-time sync', 'Heartbeat: 5s', 'Host: firebaseio.com'],
    pin: 'Cloud'
  },
  {
    name: 'Pushbullet API',
    role: 'Alert System',
    icon: Radio,
    color: '#ec4899',
    specs: ['Push notifications', 'Overload alerts', '3-strike warnings'],
    pin: 'HTTP'
  },
  {
    name: 'Wi-Fi (2.4GHz)',
    role: 'Network Interface',
    icon: Wifi,
    color: '#38bdf8',
    specs: ['SSID: HelloJi', '802.11 b/g/n', 'Auto-reconnect ON'],
    pin: 'Built-in'
  },
];

function ComponentCard({ comp }) {
  const Icon = comp.icon;
  return (
    <div className={styles.card} style={{ '--c': comp.color }}>
      <div className={styles.iconBox} style={{ background: `${comp.color}18`, border: `1px solid ${comp.color}40` }}>
        <Icon size={22} color={comp.color} />
      </div>
      <div className={styles.info}>
        <div className={styles.name}>{comp.name}</div>
        <div className={styles.role}>{comp.role}</div>
        <ul className={styles.specs}>
          {comp.specs.map(s => <li key={s}>{s}</li>)}
        </ul>
      </div>
      <div className={styles.pinBadge} style={{ color: comp.color, borderColor: `${comp.color}50`, background: `${comp.color}12` }}>
        {comp.pin}
      </div>
    </div>
  );
}

export default function Components() {
  return (
    <div className={`${styles.page} animate-in`}>
      <div className={styles.topRow}>
        <h2 className={styles.heading}>Hardware Components</h2>
        <span className={styles.count}>{COMPONENTS.length} Total</span>
      </div>
      <div className={styles.grid}>
        {COMPONENTS.map(c => <ComponentCard key={c.name} comp={c} />)}
      </div>
    </div>
  );
}
