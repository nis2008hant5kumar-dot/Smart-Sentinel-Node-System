import { useState } from 'react';
import './index.css';
import { useNodeData } from './hooks/useNodeData';
import { useAuth } from './hooks/useAuth';
import Header from './components/Header/Header';
import BottomNav from './components/BottomNav/BottomNav';
import Dashboard from './pages/Dashboard/Dashboard';
import Controls from './pages/Controls/Controls';
import Components from './pages/Components/Components';
import Account from './pages/Account/Account';
import LoginPage from './pages/Login/LoginPage';
import styles from './App.module.css';

export default function App() {
  const [tab, setTab] = useState('dashboard');
  const auth = useAuth();
  const { user, deviceId, deviceIdLoading } = auth;

  const { data, online, toggleRelay } = useNodeData(deviceId);
  const overload = parseFloat(data?.current_flow ?? 0) > 2.0;

  // ── Auth loading state (undefined = Firebase hasn't resolved yet)
  if (user === undefined) {
    return (
      <div className={styles.app}>
        <div className={styles.orb1} />
        <div className={styles.orb2} />
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Authenticating…</p>
        </div>
      </div>
    );
  }

  // ── Not signed in → show login screen
  if (user === null) {
    return <LoginPage auth={auth} />;
  }

  // ── Signed in → full app
  const renderPage = () => {
    switch (tab) {
      case 'dashboard':  return <Dashboard  data={data} online={online} />;
      case 'controls':   return <Controls   data={data} toggleRelay={toggleRelay} />;
      case 'components': return <Components />;
      case 'account':    return <Account user={user} deviceId={deviceId} logout={auth.logout} changePassword={auth.changePassword} changeDeviceId={auth.changeDeviceId} />;
      default:           return null;
    }
  };

  return (
    <div className={styles.app}>
      {/* Background orbs */}
      <div className={styles.orb1} />
      <div className={styles.orb2} />

      <Header online={online} overload={overload} nodeData={data} />

      <main className={styles.main}>
        {/* Still resolving which device this user owns */}
        {tab !== 'account' && deviceIdLoading && (
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <p>Loading device…</p>
          </div>
        )}

        {/* Device ID resolved but nothing linked yet */}
        {tab !== 'account' && !deviceIdLoading && deviceId === null && (
          <div className={styles.noDevice}>
            <div className={styles.noDeviceIcon}>📡</div>
            <p className={styles.noDeviceTitle}>No Device Linked</p>
            <p className={styles.noDeviceSub}>Link a Node ID to your account to start monitoring.</p>
            <button
              id="btn-go-to-account"
              className={styles.noDeviceBtn}
              onClick={() => setTab('account')}
            >
              Go to Account →
            </button>
          </div>
        )}

        {/* Device linked — still waiting for first Firebase response */}
        {tab !== 'account' && !deviceIdLoading && deviceId !== null && data === undefined && (
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <p>Connecting to Firebase…</p>
          </div>
        )}

        {/* onValue fired but node not found at this path */}
        {tab !== 'account' && !deviceIdLoading && deviceId !== null && data === null && (
          <div className={styles.noDevice}>
            <div className={styles.noDeviceIcon}>⚠️</div>
            <p className={styles.noDeviceTitle}>Node Not Found</p>
            <p className={styles.noDeviceSub}>
              No data found for device ID:<br />
              <code style={{ color: 'var(--primary)', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px' }}>
                {deviceId}
              </code>
              <br /><br />
              Make sure this matches the node key in your Firebase Realtime Database (not the <em>device_id</em> field inside the node).
            </p>
            <button
              id="btn-go-to-account-fix"
              className={styles.noDeviceBtn}
              onClick={() => setTab('account')}
            >
              Change Device ID →
            </button>
          </div>
        )}

        {/* Render page */}
        {(tab === 'account' || (!deviceIdLoading && deviceId !== null && data !== null && data !== undefined)) && renderPage()}
      </main>

      <BottomNav active={tab} onChange={setTab} user={user} />
    </div>
  );
}
