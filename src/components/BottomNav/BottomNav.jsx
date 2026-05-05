import styles from './BottomNav.module.css';
import { LayoutDashboard, SlidersHorizontal, Cpu, UserCircle2 } from 'lucide-react';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'controls',  label: 'Controls',  icon: SlidersHorizontal },
  { id: 'components',label: 'Hardware',  icon: Cpu },
  { id: 'account',   label: 'Account',   icon: UserCircle2 },
];

export default function BottomNav({ active, onChange, user }) {
  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            id={`nav-${id}`}
            className={`${styles.item} ${active === id ? styles.active : ''}`}
            onClick={() => onChange(id)}
          >
            {id === 'account' && user?.photoURL
              ? <img
                  src={user.photoURL}
                  alt="avatar"
                  className={`${styles.avatar} ${active === id ? styles.avatarActive : ''}`}
                  referrerPolicy="no-referrer"
                />
              : <Icon size={22} strokeWidth={active === id ? 2.2 : 1.8} />
            }
            <span>{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
