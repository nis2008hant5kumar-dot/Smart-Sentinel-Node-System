import { useEffect, useState } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { db } from '../firebase';

export function useNodeData(deviceId) {
  const [data, setData] = useState(undefined); // undefined=not yet received, null=node not found
  const [online, setOnline] = useState(false);

  useEffect(() => {
    if (!deviceId) return;

    console.log('[useNodeData] Subscribing to nodes/', deviceId);
    const nodeRef = ref(db, `nodes/${deviceId}`);
    let lastSeen = null;
    let lastSeenAt = Date.now();

    const unsub = onValue(
      nodeRef,
      (snap) => {
        const val = snap.val();
        console.log('[useNodeData] onValue fired. val =', val);

        // Always update data (null means node not found at this path)
        setData(val ?? null);

        if (val) {
          if (val.last_seen !== lastSeen) {
            lastSeen = val.last_seen;
            lastSeenAt = Date.now();
          }
          setOnline(Date.now() - lastSeenAt < 8000);
        } else {
          setOnline(false);
        }
      },
      (error) => {
        console.error('[useNodeData] onValue error:', error);
      }
    );

    const interval = setInterval(() => {
      setOnline(lastSeen != null && Date.now() - lastSeenAt < 8000);
    }, 1000);

    return () => { unsub(); clearInterval(interval); };
  }, [deviceId]);

  const toggleRelay = (current) => {
    if (!deviceId) return;
    set(ref(db, `nodes/${deviceId}/relay_status`), current === 'ON' ? 'OFF' : 'ON');
  };

  return { data, online, toggleRelay };
}
