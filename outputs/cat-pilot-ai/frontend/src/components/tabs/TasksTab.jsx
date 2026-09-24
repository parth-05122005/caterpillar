import { ArrowRight, CheckCircle2, Clock3, CloudSun, Flag, TriangleAlert } from 'lucide-react';

export default function TasksTab({ dashboard, onComplete }) {
  const task = dashboard.current_task;
  return (
    <div className="page-grid tasks-grid">
      <section className="hero-task span-8">
        <div className="section-kicker"><span>CURRENT ASSIGNMENT</span><strong>{task.task_id}</strong></div>
        <div className="task-heading">
          <div><span className="eyebrow">IN PROGRESS</span><h2>{task.task_type}</h2><p>{task.sector}</p></div>
          <div className="progress-number">{task.progress_pct}<span>%</span></div>
        </div>
        <div className="progress-track"><i style={{ width: `${task.progress_pct}%` }} /></div>
        <div className="task-meta">
          <span><CloudSun /> {task.weather}</span>
          <span><Clock3 /> {task.eta_min} MIN REMAINING</span>
        </div>
        <button className="primary-button wide" onClick={onComplete}><CheckCircle2 /> COMPLETE TASK</button>
      </section>

      <aside className="prediction-card span-4">
        <span className="eyebrow">AI TIME FORECAST</span>
        <div className="forecast-time"><strong>{task.predicted_min}</strong><span>MIN</span></div>
        <p>Predicted completion</p>
        <div className="comparison"><span>ORIGINAL ESTIMATE</span><strong>{task.estimated_min} min</strong></div>
        <div className="forecast-note"><TriangleAlert size={18} /><span>3 min over estimate</span></div>
        <small>Updates on each telemetry tick</small>
      </aside>

      <section className="next-task span-8">
        <div className="section-kicker"><span>UP NEXT</span><strong>IN ~{dashboard.next_task.eta_min} MIN</strong></div>
        <div className="next-row">
          <div className="task-icon"><Flag /></div>
          <div><h3>{dashboard.next_task.task_type}</h3><p>{dashboard.next_task.task_id} · Stockpile B</p></div>
          <ArrowRight />
        </div>
      </section>

      <section className="issue-card span-4">
        <span className="eyebrow">NEED SUPPORT?</span>
        <h3>Report a site issue</h3>
        <button className="secondary-button"><TriangleAlert /> REPORT ISSUE</button>
      </section>
    </div>
  );
}
