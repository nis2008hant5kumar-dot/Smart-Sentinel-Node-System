import { useEffect, useState } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { db, DEVICE_ID } from '../firebase';

export function useNodeData() {
  const [data, setData] = useState(null);
  const [online, setOnline] = useState(false);

  useEffect(() => {
    const nodeRef = ref(db, `nodes/${DEVICE_ID}`);
    let lastSeen = null;
    let lastSeenAt = Date.now();

    const unsub = onValue(nodeRef, (snap) => {
      const val = snap.val();
      if (val) {
        setData(val);
        if (val.last_seen !== lastSeen) {
          lastSeen = val.last_seen;
          lastSeenAt = Date.now();
        }
        setOnline(Date.now() - lastSeenAt < 8000);
      }
    });

    const interval = setInterval(() => {
      setOnline(lastSeen != null && Date.now() - lastSeenAt < 8000);
    }, 1000);

    return () => { unsub(); clearInterval(interval); };
  }, []);

  const toggleRelay = (current) => {
    set(ref(db, `nodes/${DEVICE_ID}/relay_status`), current === 'ON' ? 'OFF' : 'ON');
  };

  return { data, online, toggleRelay };
}
