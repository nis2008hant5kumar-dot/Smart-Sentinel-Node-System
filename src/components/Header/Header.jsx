import styles from './Header.module.css';
import { Zap } from 'lucide-react';
import { DEVICE_ID } from '../../firebase';

export default function Header({ online, overload }) {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <div className={styles.logo}>
          <Zap size={18} />
        </div>
        <div>
          <div className={styles.title}>Sentinel Node</div>
          <div className={styles.deviceId}>SN-{DEVICE_ID}</div>
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
