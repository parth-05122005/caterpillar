import { Camera, Check, Eye, Phone, Radio, ScanLine, ShieldCheck, UserRoundCheck } from 'lucide-react';

function StatusTile({ icon: Icon, label, value, alert }) {
  return <div className={`status-tile ${alert ? 'bad' : 'good'}`}><Icon /><span>{label}</span><strong>{value}</strong><i>{alert ? 'CHECK NOW' : 'CLEAR'}</i></div>;
}

export default function SafetyTab({ safety }) {
  return (
    <div className="safety-layout">
      <section className="camera-panel">
        <div className="camera-header"><span><Camera size={19} /> REAR CAMERA · LIVE</span><strong><i /> 03 FPS</strong></div>
        <div className="camera-view">
          <div className="camera-grid" />
          <svg viewBox="0 0 800 410" role="img" aria-label="Rear camera simulation">
            <path d="M0 330L175 182h450L800 330v80H0z" fill="#35393c" />
            <path d="M310 410L360 182h80l50 228" fill="#202326" />
            <path d="M0 330h800M175 182l-50 228M625 182l50 228" stroke="#73787d" strokeWidth="3" />
            <rect x="547" y="155" width="95" height="192" fill="none" stroke="#37d67a" strokeWidth="5" />
            <circle cx="593" cy="190" r="23" fill="#545b60" />
            <path d="M562 335l10-95h42l13 95" fill="#4c5358" />
            <text x="548" y="144" fill="#37d67a" fontSize="18" fontWeight="800">ZONE CLEAR</text>
          </svg>
          <div className="camera-corners"><i/><i/><i/><i/></div>
          <div className="safe-zone"><ScanLine size={18} /> REAR ZONE MONITORED</div>
        </div>
      </section>
      <div className="safety-side">
        <div className="status-stack">
          <StatusTile icon={UserRoundCheck} label="SEATBELT" value={safety.seatbelt.status.toUpperCase()} alert={safety.seatbelt.status !== 'fastened'} />
          <StatusTile icon={Phone} label="PHONE USE" value={safety.phone_usage.detected ? 'DETECTED' : 'NONE'} alert={safety.phone_usage.detected} />
          <StatusTile icon={Eye} label="DROWSINESS" value={safety.drowsiness.detected ? 'DETECTED' : 'ALERT'} alert={safety.drowsiness.detected} />
        </div>
        <section className="timeline-card">
          <div className="section-kicker"><span>SHIFT TIMELINE</span><Radio size={18} /></div>
          {safety.events.map((event) => <div className="timeline-item" key={event.id}><i className={event.severity}/><div><strong>{event.type}</strong><span>{event.time}</span></div><Check size={18}/></div>)}
        </section>
        <div className="system-safe"><ShieldCheck /><div><strong>SAFETY SYSTEMS ONLINE</strong><span>4 signals monitored</span></div></div>
      </div>
    </div>
  );
}
