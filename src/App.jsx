import { useState } from 'react';
import './index.css';
import { useNodeData } from './hooks/useNodeData';
import Header from './components/Header/Header';
import BottomNav from './components/BottomNav/BottomNav';
import Dashboard from './pages/Dashboard/Dashboard';
import Controls from './pages/Controls/Controls';
import Components from './pages/Components/Components';
import styles from './App.module.css';

export default function App() {
  const [tab, setTab] = useState('dashboard');
  const { data, online, toggleRelay } = useNodeData();
  const overload = parseFloat(data?.current_flow ?? 0) > 2.0;

  const renderPage = () => {
    switch (tab) {
      case 'dashboard':  return <Dashboard  data={data} online={online} />;
      case 'controls':   return <Controls   data={data} toggleRelay={toggleRelay} />;
      case 'components': return <Components />;
      default:           return null;
    }
  };

  return (
    <div className={styles.app}>
      {/* Background orbs */}
      <div className={styles.orb1} />
      <div className={styles.orb2} />

      <Header online={online} overload={overload} />

      <main className={styles.main}>
        {data === null && (
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <p>Connecting to Firebase…</p>
          </div>
        )}
        {data !== null && renderPage()}
      </main>

      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}
