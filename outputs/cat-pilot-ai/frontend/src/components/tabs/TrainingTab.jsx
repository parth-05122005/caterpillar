import { BookOpenCheck, CheckCircle2, ChevronRight, Play, RotateCcw } from 'lucide-react';
import { useState } from 'react';

const modules = [
  ['Pre-task safety check', '6 min', 100],
  ['CAT 349 refresher', '8 min', 60],
  ['Site hazard onboarding', '5 min', 25],
];

export default function TrainingTab() {
  const [angle, setAngle] = useState(12);
  const limit = 25;
  const safe = angle < limit;
  return (
    <div className="training-grid">
      <section className="slope-card span-8">
        <div className="section-kicker"><span>30-SECOND SLOPE CHECK</span><strong className={safe ? 'safe-text' : 'danger-text'}>{safe ? 'WITHIN DEMO LIMIT' : 'OVER DEMO LIMIT'}</strong></div>
        <div className="slope-visual">
          <div className="slope-world" style={{transform:`rotate(${-angle}deg)`}}><div className="ground-line"/><div className="machine-shape"><div className="cab"/><div className="body"/><div className="track"/><div className="boom"/></div></div>
          <div className="angle-readout"><strong>{angle}°</strong><span>INCLINE</span></div>
          <div className="limit-marker">DEMO LIMIT {limit}°</div>
        </div>
        <input aria-label="Slope angle" type="range" min="0" max="32" value={angle} onChange={(e)=>setAngle(Number(e.target.value))}/>
        <div className="range-labels"><span>LEVEL · 0°</span><span>MAX · 32°</span></div>
        <p>This visual is a training aid. Use the site plan and machine-specific operating manual for real limits.</p>
      </section>
      <aside className="modules-card span-4">
        <div className="section-kicker"><span>LEARNING PATH</span><BookOpenCheck size={19}/></div>
        {modules.map(([name, time, progress]) => <button className="module-row" key={name}><span className="play-circle">{progress === 100 ? <CheckCircle2/> : <Play/>}</span><div><strong>{name}</strong><span>{time} · {progress}%</span><i><b style={{width:`${progress}%`}}/></i></div><ChevronRight/></button>)}
        <button className="secondary-button"><RotateCcw/> REVIEW COMPLETED MODULES</button>
      </aside>
    </div>
  );
}
