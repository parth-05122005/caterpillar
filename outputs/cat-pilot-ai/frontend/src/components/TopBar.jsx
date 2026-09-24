import { Leaf, Mic, ShieldAlert } from 'lucide-react';

export default function TopBar({ clock, machine, demoMode, onVoice, onSos }) {
  return (
    <header className="topbar">
      <div className="brand-block">
        <div className="brand-mark">CAT<span>▰</span></div>
        <div>
          <div className="eyebrow">PILOT AI · {demoMode ? 'SIMULATION' : 'LIVE'}</div>
          <h1>{machine.machine_id}</h1>
        </div>
      </div>
      <div className="topbar-actions">
        <div className="status-block">
          <span className="status-dot" />
          <span>{machine.status}</span>
          <strong>{clock}</strong>
        </div>
        <div className="eco-chip"><Leaf size={20} /> <strong>{machine.eco_score}</strong><span>ECO</span></div>
        <button className="header-button voice-button" onClick={onVoice}><Mic size={22} /> HEY CAT</button>
        <button className="header-button sos-button" onClick={onSos}><ShieldAlert size={22} /> SOS</button>
      </div>
    </header>
  );
}
