import { useState } from 'react';
import styles from './Account.module.css';
import { LogOut, User, Shield, Cpu, AtSign, Hash, Lock, CheckCircle, AlertCircle } from 'lucide-react';

export default function Account({ user, deviceId, logout, changePassword, changeDeviceId }) {
  const avatar   = user?.photoURL;
  const username = user?.displayName ?? 'sentinel_user';
  const uid      = user?.uid ?? '—';

  return (
    <div className={`${styles.page} animate-in`}>

      {/* Profile hero */}
      <div className={styles.hero}>
        <div className={styles.avatarWrap}>
          {avatar
            ? <img src={avatar} alt={username} className={styles.avatarImg} referrerPolicy="no-referrer" />
            : <div className={styles.avatarFallback}><User size={32} /></div>
          }
          <div className={styles.avatarRing} />
        </div>
        <h1 className={styles.name}>{username}</h1>
        <p className={styles.providerBadge}>Username / Password</p>
      </div>

      {/* Account info */}
      <div className={styles.section}>
        <p className={styles.sectionLabel}>Account Info</p>
        <div className={styles.infoCard}>
          <InfoRow icon={AtSign} label="Username"  value={username} mono />
          <InfoRow icon={Hash}   label="User ID"   value={uid.slice(0, 16) + '…'} mono />
          <InfoRow icon={Cpu}    label="Linked Node" value={deviceId ? `SN-${deviceId}` : 'None linked'} mono accent={!!deviceId} />
          <InfoRow icon={Shield} label="Role"      value="Administrator" />
        </div>
      </div>

      {/* Settings */}
      <div className={styles.section}>
        <p className={styles.sectionLabel}>Settings</p>
        <div className={styles.settingsCard}>
          <ChangeDeviceId current={deviceId} onSave={changeDeviceId} />
          <div className={styles.settingsDivider} />
          <ChangePassword onSave={changePassword} />
        </div>
      </div>

      {/* Logout */}
      <div className={styles.section}>
        <button id="btn-logout" className={styles.logoutBtn} onClick={logout}>
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );
}

/* ── Reusable info row ── */
function InfoRow({ icon: Icon, label, value, mono, accent }) {
  return (
    <div className={styles.infoRow}>
      <div className={`${styles.infoIcon} ${accent ? styles.infoIconAccent : ''}`}>
        <Icon size={15} />
      </div>
      <div className={styles.infoContent}>
        <span className={styles.infoLabel}>{label}</span>
        <span className={`${styles.infoValue} ${mono ? styles.mono : ''}`}>{value}</span>
      </div>
    </div>
  );
}

/* ── Change Device ID ── */
function ChangeDeviceId({ current, onSave }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue]     = useState(current ?? '');
  const [status, setStatus]   = useState(null); // null | 'ok' | 'err'
  const [msg, setMsg]         = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!value.trim()) return;
    setLoading(true);
    const res = await onSave(value);
    setLoading(false);
    if (res.ok) {
      setStatus('ok'); setMsg('Device ID updated!');
      setEditing(false);
    } else {
      setStatus('err'); setMsg(res.error);
    }
    setTimeout(() => setStatus(null), 3000);
  };

  return (
    <div className={styles.settingRow}>
      <div className={styles.settingMeta}>
        <Cpu size={16} className={styles.settingIcon} />
        <div>
          <p className={styles.settingTitle}>Linked Device ID</p>
          <p className={styles.settingDesc}>
            {current ? `Currently: SN-${current}` : 'No device linked'}
          </p>
        </div>
      </div>

      {editing ? (
        <div className={styles.settingForm}>
          <input
            id="input-change-device"
            className={`${styles.settingInput} ${styles.mono}`}
            placeholder="Enter Node / Device ID"
            value={value}
            onChange={e => setValue(e.target.value)}
            autoCapitalize="none"
            spellCheck={false}
          />
          <div className={styles.settingActions}>
            <button className={styles.saveBtn} onClick={handleSave} disabled={loading}>
              {loading ? <span className={styles.miniSpinner} /> : 'Save'}
            </button>
            <button className={styles.cancelBtn} onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <button id="btn-change-device" className={styles.editBtn} onClick={() => { setValue(current ?? ''); setEditing(true); }}>
          {current ? 'Change' : 'Link Device'}
        </button>
      )}

      {status && (
        <div className={`${styles.feedback} ${status === 'ok' ? styles.feedbackOk : styles.feedbackErr}`}>
          {status === 'ok' ? <CheckCircle size={13} /> : <AlertCircle size={13} />}
          {msg}
        </div>
      )}
    </div>
  );
}

/* ── Change Password ── */
function ChangePassword({ onSave }) {
  const [editing, setEditing] = useState(false);
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus]   = useState(null);
  const [msg, setMsg]         = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (newPass.length < 6) { setStatus('err'); setMsg('Password must be at least 6 characters.'); return; }
    if (newPass !== confirm) { setStatus('err'); setMsg('Passwords do not match.'); return; }
    setLoading(true);
    const res = await onSave(newPass);
    setLoading(false);
    if (res.ok) {
      setStatus('ok'); setMsg('Password updated!');
      setEditing(false); setNewPass(''); setConfirm('');
    } else {
      setStatus('err'); setMsg(res.error);
    }
    setTimeout(() => setStatus(null), 3500);
  };

  return (
    <div className={styles.settingRow}>
      <div className={styles.settingMeta}>
        <Lock size={16} className={styles.settingIcon} />
        <div>
          <p className={styles.settingTitle}>Password</p>
          <p className={styles.settingDesc}>Change your account password</p>
        </div>
      </div>

      {editing ? (
        <div className={styles.settingForm}>
          <input
            id="input-new-password"
            className={styles.settingInput}
            type="password"
            placeholder="New password (min 6 chars)"
            value={newPass}
            onChange={e => setNewPass(e.target.value)}
            autoComplete="new-password"
          />
          <input
            id="input-confirm-password"
            className={styles.settingInput}
            type="password"
            placeholder="Confirm new password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            autoComplete="new-password"
          />
          <div className={styles.settingActions}>
            <button className={styles.saveBtn} onClick={handleSave} disabled={loading}>
              {loading ? <span className={styles.miniSpinner} /> : 'Save'}
            </button>
            <button className={styles.cancelBtn} onClick={() => { setEditing(false); setNewPass(''); setConfirm(''); setStatus(null); }}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button id="btn-change-password" className={styles.editBtn} onClick={() => setEditing(true)}>
          Change
        </button>
      )}

      {status && (
        <div className={`${styles.feedback} ${status === 'ok' ? styles.feedbackOk : styles.feedbackErr}`}>
          {status === 'ok' ? <CheckCircle size={13} /> : <AlertCircle size={13} />}
          {msg}
        </div>
      )}
    </div>
  );
}
