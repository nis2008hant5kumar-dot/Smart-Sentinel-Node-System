import { useState } from 'react';
import styles from './Controls.module.css';
import { Power, ShieldOff, Zap } from 'lucide-react';

export default function Controls({ data, toggleRelay }) {
  const relay = data?.relay_status ?? 'OFF';
  const isOn = relay === 'ON';
  const [loading, setLoading] = useState(false);

  const handleToggle = () => {
    setLoading(true);
    toggleRelay(relay);
    setTimeout(() => setLoading(false), 1200);
  };

  return (
    <div className={`${styles.page} animate-in`}>
      <h2 className={styles.heading}>Power Control</h2>

      {/* Big Power Button */}
      <div className={styles.btnWrap}>
        <div className={`${styles.ring} ${isOn ? styles.ringOn : ''}`} />
        <button
          id="power-toggle-btn"
          className={`${styles.powerBtn} ${isOn ? styles.btnOn : styles.btnOff} ${loading ? styles.btnLoading : ''}`}
          onClick={handleToggle}
          disabled={loading}
        >
          <Power size={52} strokeWidth={1.8} />
        </button>
      </div>

      <p className={styles.statusLabel}>
        {loading ? 'Updating…' : isOn ? 'System is ON — Relay Active' : 'System is OFF — Relay Inactive'}
      </p>

      {/* Toggle Strip */}
      <div className={styles.toggleStrip} onClick={handleToggle}>
        <span className={styles.stripLabel}>
          <Zap size={16} /> Quick Toggle
        </span>
        <div className={`${styles.pill} ${isOn ? styles.pillOn : styles.pillOff}`}>
          <div className={styles.pillThumb} />
        </div>
      </div>

      {/* Info card */}
      <div className={styles.infoCard}>
        <ShieldOff size={16} color="var(--warning)" />
        <p>After <strong>3 overload strikes</strong> the relay auto-shuts for safety. Toggling from this panel resets the round counter.</p>
      </div>
    </div>
  );
}
