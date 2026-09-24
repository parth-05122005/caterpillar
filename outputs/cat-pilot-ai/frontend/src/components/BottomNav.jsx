import { ClipboardList, GraduationCap, RadioTower, ShieldCheck, Wrench } from 'lucide-react';

const items = [
  ['tasks', 'Tasks', ClipboardList],
  ['safety', 'Safety', ShieldCheck],
  ['machine', 'Machine', Wrench],
  ['training', 'Training', GraduationCap],
  ['incidents', 'Incidents', RadioTower],
];

export default function BottomNav({ active, onChange, alertActive }) {
  return (
    <nav className="bottom-nav" aria-label="Primary">
      {items.map(([id, label, Icon]) => (
        <button key={id} className={active === id ? 'active' : ''} onClick={() => onChange(id)}>
          <span className="nav-icon"><Icon size={24} />{id === 'safety' && alertActive && <i />}</span>
          {label}
        </button>
      ))}
    </nav>
  );
}
