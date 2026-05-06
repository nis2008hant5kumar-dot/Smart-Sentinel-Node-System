/**
 * seed-nodes.mjs
 * Run once: node seed-nodes.mjs
 * Seeds Firebase Realtime DB with dummy Sentinel Node data.
 */

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBmB6Jj0XbpTFm0u44X1iRvGU64U62VCOU",
  authDomain: "ai-smart-sentinel-node-system.firebaseapp.com",
  projectId: "ai-smart-sentinel-node-system",
  storageBucket: "ai-smart-sentinel-node-system.appspot.com",
  messagingSenderId: "152209661326",
  appId: "1:152209661326:web:09566bb5db4ad799d318df",
  databaseURL: "https://ai-smart-sentinel-node-system-default-rtdb.firebaseio.com",
};

const app = initializeApp(firebaseConfig);
const db  = getDatabase(app);

const now = Math.floor(Date.now() / 1000); // Unix seconds

const NODES = [
  {
    key: '12345678901',
    data: {
      device_id:    'SN-001',
      device_type:  'Power Monitor',
      esp_status:   'Live',
      relay_status: 'ON',
      current_flow: 1.24,
      voltage_level: 231,
      active_session: 'sess_abc123',
      last_seen: now,
    },
  },
  {
    key: '12345678902',
    data: {
      device_id:    'SN-002',
      device_type:  'Power Monitor',
      esp_status:   'Live',
      relay_status: 'OFF',
      current_flow: 0.0,
      voltage_level: 229,
      active_session: '',
      last_seen: now - 60,   // seen 1 min ago → offline
    },
  },
  {
    key: '12345678903',
    data: {
      device_id:    'SN-003',
      device_type:  'Security Node',
      esp_status:   'Live',
      relay_status: 'ON',
      current_flow: 2.85,    // overload!
      voltage_level: 235,
      active_session: 'sess_xyz789',
      last_seen: now,
    },
  },
  {
    key: '12345678904',
    data: {
      device_id:    'SN-004',
      device_type:  'Energy Meter',
      esp_status:   'Offline',
      relay_status: 'OFF',
      current_flow: 0.0,
      voltage_level: 0,
      active_session: '',
      last_seen: now - 300,  // 5 min ago → offline
    },
  },
];

async function seed() {
  console.log('🌱 Seeding', NODES.length, 'dummy nodes into Firebase...\n');

  for (const node of NODES) {
    const path = `nodes/${node.key}`;
    await set(ref(db, path), node.data);
    console.log(`  ✅  ${path}  →  ${node.data.device_id} (${node.data.device_type})`);
  }

  console.log('\n✨ Done! Node IDs you can use at signup:');
  NODES.forEach(n => console.log(`  • ${n.key}  →  ${n.data.device_id}`));
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
