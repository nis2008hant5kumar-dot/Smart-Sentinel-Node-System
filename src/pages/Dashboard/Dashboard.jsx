import styles from './Dashboard.module.css';
import { Zap, Activity, Thermometer, Power } from 'lucide-react';

function MetricCard({ label, value, unit, icon: Icon, color, glow }) {
  return (
    <div className={styles.card} style={{ '--glow': glow }}>
      <div className={styles.cardIcon} style={{ color }}>
        <Icon size={20} />
      </div>
      <p className={styles.cardLabel}>{label}</p>
      <div className={styles.cardValue}>
        <span className={styles.valNum}>{value}</span>
        <span className={styles.valUnit} style={{ color }}>{unit}</span>
      </div>
    </div>
  );
}

export default function Dashboard({ data, online }) {
  const current    = parseFloat(data?.current_flow ?? 0).toFixed(2);
  const voltage    = Math.round(data?.voltage_level ?? 0);
  const relay      = data?.relay_status ?? 'OFF';
  const overload   = parseFloat(current) > 2.0;
  const deviceLabel = data?.device_id ?? null;
  const deviceType  = data?.device_type && data.device_type !== 'None' ? data.device_type : null;

  return (
    <div className={`${styles.page} animate-in`}>
      {/* Hero Status */}
      <div className={`${styles.hero} ${online ? styles.heroLive : styles.heroOff}`}>
        <div className={styles.heroOrb} />
        <div className={styles.heroContent}>
          <div className={`${styles.statusRing} ${online ? styles.ringLive : styles.ringOff}`}>
            <div className={styles.statusDot} />
          </div>
          <div>
            <h1 className={styles.heroTitle}>
              {online ? 'Node Online' : 'Node Offline'}
            </h1>
            {(deviceLabel || deviceType) && (
              <p className={styles.heroDevice}>
                {deviceLabel && <span>{deviceLabel}</span>}
                {deviceLabel && deviceType && <span className={styles.heroDot}>·</span>}
                {deviceType && <span>{deviceType}</span>}
              </p>
            )}
            <p className={styles.heroSub}>
              Power: <strong style={{ color: relay === 'ON' ? 'var(--primary)' : 'var(--muted)' }}>
                {relay}
              </strong>
              {overload && <span className={styles.overloadTag}>⚡ OVERLOAD</span>}
            </p>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className={styles.grid}>
        <MetricCard
          label="Current Flow"
          value={current}
          unit="A"
          icon={Activity}
          color="var(--primary)"
          glow="rgba(0,242,254,0.2)"
        />
        <MetricCard
          label="Voltage Level"
          value={voltage}
          unit="V"
          icon={Zap}
          color="var(--accent)"
          glow="rgba(168,85,247,0.2)"
        />
      </div>

      {/* Relay Quick View */}
      <div className={styles.relayCard}>
        <Power size={16} color={relay === 'ON' ? 'var(--primary)' : 'var(--muted)'} />
        <span>Relay Status</span>
        <span className={`${styles.relayBadge} ${relay === 'ON' ? styles.relayOn : styles.relayOff}`}>
          {relay}
        </span>
      </div>

      {/* Strike / Overload info */}
      {overload && (
        <div className={styles.alertBanner}>
          <Thermometer size={18} />
          <span>Current exceeds 2A safety limit — 3-Strike protection active</span>
        </div>
      )}
    </div>
  );
}
