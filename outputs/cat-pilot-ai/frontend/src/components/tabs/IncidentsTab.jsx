import { CalendarClock, ChevronRight, Film, RadioTower } from 'lucide-react';
import { useState } from 'react';

export default function IncidentsTab({ incidents, telemetry }) {
  const [selected, setSelected] = useState(incidents[0]);
  return (
    <div className="incidents-grid">
      <section className="incident-list span-5">
        <div className="section-kicker"><span>BLACK-BOX EVENTS</span><strong>{incidents.length} EVENTS</strong></div>
        {incidents.map((incident) => <button key={incident.id} className={`incident-row ${selected?.id===incident.id?'selected':''}`} onClick={()=>setSelected(incident)}><i className={incident.severity}/><div><span>{incident.id} · {incident.severity.toUpperCase()}</span><strong>{incident.type}</strong><small>{incident.time}</small></div><ChevronRight/></button>)}
      </section>
      <section className="incident-detail span-7">
        {selected ? <>
          <div className="incident-video"><Film size={44}/><span>10-SECOND BUFFER</span><strong>{selected.type.toUpperCase()}</strong><button><PlayIcon/> PLAY CLIP</button></div>
          <div className="incident-summary"><div><CalendarClock/><span>CAPTURED</span><strong>{selected.time}</strong></div><div><RadioTower/><span>MACHINE</span><strong>{selected.machine}</strong></div></div>
          <div className="snapshot"><span>TELEMETRY SNAPSHOT</span><div><b>RPM</b><strong>{telemetry.engine_rpm}</strong></div><div><b>HYDRAULIC</b><strong>{telemetry.hydraulic_temp_c}°C</strong></div><div><b>PRESSURE</b><strong>{telemetry.pressure_bar} bar</strong></div></div>
        </> : <div className="empty-state">No incident selected</div>}
      </section>
    </div>
  );
}

function PlayIcon(){return <span className="play-triangle">▶</span>}
