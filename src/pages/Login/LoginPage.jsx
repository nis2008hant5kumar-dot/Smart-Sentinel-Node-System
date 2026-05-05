import { useState } from 'react';
import styles from './LoginPage.module.css';
import { Zap, User, Lock, ArrowRight, Cpu } from 'lucide-react';

export default function LoginPage({ auth }) {
  const { login, signup, authError } = auth;
  const [mode, setMode]       = useState('login'); // 'login' | 'signup'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nodeId, setNodeId]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (mode === 'login') {
      await login(username, password);
    } else {
      await signup(username, password, nodeId);
    }
    setLoading(false);
  };

  const switchMode = () => {
    setMode(m => m === 'login' ? 'signup' : 'login');
    setNodeId('');
  };

  return (
    <div className={styles.page}>
      {/* Ambient orbs */}
      <div className={styles.orb1} />
      <div className={styles.orb2} />

      <div className={styles.card}>
        {/* Logo */}
        <div className={styles.logoWrap}>
          <div className={styles.logo}><Zap size={24} /></div>
          <div>
            <div className={styles.brand}>Sentinel Node</div>
            <div className={styles.tagline}>Smart IoT Dashboard</div>
          </div>
        </div>

        <h1 className={styles.title}>
          {mode === 'login' ? 'Welcome back' : 'Create account'}
        </h1>
        <p className={styles.subtitle}>
          {mode === 'login'
            ? 'Sign in to monitor your node'
            : 'Link your account to a Sentinel device'}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.field}>
            <User size={15} className={styles.fieldIcon} />
            <input
              id="input-username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
            />
          </label>

          <label className={styles.field}>
            <Lock size={15} className={styles.fieldIcon} />
            <input
              id="input-password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </label>

          {/* Device ID — signup only */}
          {mode === 'signup' && (
            <div className={styles.deviceSection}>
              <p className={styles.deviceLabel}>
                <Cpu size={13} /> Link a Device
              </p>
              <label className={styles.field}>
                <Cpu size={15} className={styles.fieldIcon} />
                <input
                  id="input-node-id"
                  type="text"
                  placeholder="Node / Device ID  (e.g. 12345678901)"
                  value={nodeId}
                  onChange={e => setNodeId(e.target.value)}
                  required
                  autoCapitalize="none"
                  spellCheck={false}
                  className={styles.mono}
                />
              </label>
              <p className={styles.deviceHint}>
                Find the Device ID printed on your ESP32 board or in the firmware config.
              </p>
            </div>
          )}

          {authError && (
            <div className={styles.error}>{authError}</div>
          )}

          <button
            id="btn-submit-auth"
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? (
              <span className={styles.spinner} />
            ) : (
              <>
                {mode === 'login' ? 'Sign In' : 'Create Account'}
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <p className={styles.toggle}>
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
          {' '}
          <button
            id="btn-toggle-mode"
            className={styles.toggleBtn}
            onClick={switchMode}
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}
