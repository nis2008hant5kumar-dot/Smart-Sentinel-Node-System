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
  const { user, deviceId } = auth;

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
        {data === null && tab !== 'account' && (
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <p>Connecting to Firebase…</p>
          </div>
        )}
        {(data !== null || tab === 'account') && renderPage()}
      </main>

      <BottomNav active={tab} onChange={setTab} user={user} />
    </div>
  );
}
