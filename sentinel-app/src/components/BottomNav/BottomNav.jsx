import styles from './BottomNav.module.css';
import { LayoutDashboard, SlidersHorizontal, Cpu } from 'lucide-react';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'controls',  label: 'Controls',  icon: SlidersHorizontal },
  { id: 'components',label: 'Components',icon: Cpu },
];

export default function BottomNav({ active, onChange }) {
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
            <Icon size={22} strokeWidth={active === id ? 2.2 : 1.8} />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
