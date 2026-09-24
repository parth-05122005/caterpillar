import { Activity, Droplets, Fuel, Gauge, RotateCw, Thermometer, TimerReset, Wrench } from 'lucide-react';

const metrics = [
  ['HYDRAULIC TEMP', 'hydraulic_temp_c', '°C', Thermometer, 74, 100],
  ['ENGINE SPEED', 'engine_rpm', 'RPM', Gauge, 1760, 2400],
  ['SYSTEM PRESSURE', 'pressure_bar', 'BAR', Activity, 281, 350],
  ['IDLE TIME', 'idling_time_min', 'MIN', TimerReset, 8.4, 40],
  ['FUEL USED', 'fuel_used_L', 'L', Fuel, 6.52, 20],
  ['LOAD CYCLES', 'load_cycles', 'TODAY', RotateCw, 12, 30],
];

export default function MachineTab({ telemetry, unusual }) {
  return (
    <div className="machine-page">
      <div className="page-title"><div><span className="eyebrow">LIVE TELEMETRY</span><h2>Machine pulse</h2></div><span className="live-label"><i/> STREAMING</span></div>
      <div className="metrics-grid">
        {metrics.map(([label, key, unit, Icon, fallback, max]) => {
          const value = telemetry[key] ?? fallback;
          return <section className="metric-card" key={key}><div className="metric-icon"><Icon /></div><span>{label}</span><div><strong>{value}</strong><small>{unit}</small></div><div className="mini-track"><i style={{width:`${Math.min(100, (Number(value)/max)*100)}%`}} /></div></section>;
        })}
      </div>
      <section className={`behavior-card ${unusual.prediction}`}>
        <div className="behavior-score"><Wrench /><span>AI OPERATING PATTERN</span><strong>{unusual.prediction.toUpperCase()}</strong></div>
        <div className="behavior-copy"><span>{Math.round(unusual.confidence * 100)}% CONFIDENCE</span><h3>{unusual.prediction === 'normal' ? 'Operation within expected range' : 'Unsafe operating pattern detected'}</h3><ul>{unusual.risk_drivers.map((driver) => <li key={driver}><Droplets size={16}/>{driver}</li>)}</ul></div>
      </section>
      <p className="synthetic-note">Prototype note: unusual-behavior labels are synthetic and rule-derived.</p>
    </div>
  );
}
