import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBmB6Jj0XbpTFm0u44X1iRvGU64U62VCOU",
  authDomain: "ai-smart-sentinel-node-system.firebaseapp.com",
  projectId: "ai-smart-sentinel-node-system",
  storageBucket: "ai-smart-sentinel-node-system.appspot.com",
  messagingSenderId: "152209661326",
  appId: "1:152209661326:web:09566bb5db4ad799d318df",
  databaseURL: "https://ai-smart-sentinel-node-system-default-rtdb.firebaseio.com",
};

export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const DEVICE_ID = "12345678901";
