import { ShieldAlert, X } from 'lucide-react';

export default function SosDialog({ open, confirming, onClose, onConfirm }) {
  if (!open) return null;
  return (
    <div className="modal-scrim" role="alertdialog" aria-modal="true" aria-labelledby="sos-title">
      <div className="sos-panel">
        <button className="close-modal" onClick={onClose} aria-label="Close"><X /></button>
        <ShieldAlert size={48} />
        <span className="eyebrow">MANUAL INCIDENT CAPTURE</span>
        <h2 id="sos-title">Log an SOS event?</h2>
        <p>This saves the current telemetry snapshot and black-box buffer. It does not contact emergency services.</p>
        <button className="danger-button" disabled={confirming} onClick={onConfirm}>
          {confirming ? 'LOGGING…' : 'HOLD TO CONFIRM SOS'}
        </button>
        <button className="secondary-button" onClick={onClose}>CANCEL</button>
      </div>
    </div>
  );
}
