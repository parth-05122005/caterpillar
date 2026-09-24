import { AlertTriangle, ArrowRight, X } from 'lucide-react';

export default function AlertBanner({ alert, onView, onDismiss }) {
  if (!alert) return null;
  return (
    <section className={`alert-banner ${alert.severity}`} role="alert">
      <AlertTriangle size={28} />
      <div><span>{alert.severity.toUpperCase()} ALERT</span><strong>{alert.message}</strong></div>
      <button onClick={onView}>VIEW SAFETY <ArrowRight size={20} /></button>
      <button className="icon-button" aria-label="Acknowledge alert" onClick={onDismiss}><X size={22} /></button>
    </section>
  );
}
