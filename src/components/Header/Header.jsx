import styles from './Header.module.css';
import { Zap } from 'lucide-react';

export default function Header({ online, overload, nodeData }) {
  // Use the human-readable device_id from DB (e.g. "SN-001"),
  // falling back to the raw key if not yet loaded
  const deviceLabel = nodeData?.device_id ?? '—';
  const deviceType  = nodeData?.device_type && nodeData.device_type !== 'None'
    ? nodeData.device_type
    : null;

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <div className={styles.logo}>
          <Zap size={18} />
        </div>
        <div>
          <div className={styles.title}>Sentinel Node</div>
          <div className={styles.deviceId}>
            {deviceLabel}
            {deviceType && <span className={styles.deviceType}> · {deviceType}</span>}
          </div>
        </div>
      </div>

      <div className={styles.badges}>
        <div className={`${styles.badge} ${overload ? styles.danger : styles.safe}`}>
          {overload ? '⚡ OVERLOAD' : '✓ System Safe'}
        </div>
        <div className={`${styles.status} ${online ? styles.live : styles.offline}`}>
          <span className={styles.dot} />
          {online ? 'ESP Live' : 'Offline'}
        </div>
      </div>
    </header>
  );
}
