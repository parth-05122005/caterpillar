import { useEffect, useMemo, useState } from 'react';
import TopBar from './components/TopBar.jsx';
import BottomNav from './components/BottomNav.jsx';
import AlertBanner from './components/AlertBanner.jsx';
import VoiceAssistant from './components/VoiceAssistant.jsx';
import SosDialog from './components/SosDialog.jsx';
import TasksTab from './components/tabs/TasksTab.jsx';
import SafetyTab from './components/tabs/SafetyTab.jsx';
import MachineTab from './components/tabs/MachineTab.jsx';
import TrainingTab from './components/tabs/TrainingTab.jsx';
import IncidentsTab from './components/tabs/IncidentsTab.jsx';
import { demoState } from './lib/demoData.js';
import { firebaseEnabled, subscribeToLiveState, writeSosIncident } from './firebase.js';

export default function App() {
  const [active, setActive] = useState('tasks');
  const [state, setState] = useState(demoState);
  const [clock, setClock] = useState('');
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [sosOpen, setSosOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [flash, setFlash] = useState('');
  const [dismissedAlert, setDismissedAlert] = useState(false);

  useEffect(() => {
    const tick = () => setClock(new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date()));
    tick(); const timer = setInterval(tick, 1000); return () => clearInterval(timer);
  }, []);
  useEffect(() => { let cleanup = () => {}; subscribeToLiveState(demoState, setState).then((fn) => { cleanup = fn; }); return () => cleanup(); }, []);
  useEffect(() => { setDismissedAlert(false); }, [state.safety.active_alert]);

  const alert = dismissedAlert ? null : state.safety.active_alert;
  const panels = useMemo(() => ({
    tasks: <TasksTab dashboard={state.dashboard} onComplete={() => setFlash('TASK COMPLETE · GREAT WORK')} />,
    safety: <SafetyTab safety={state.safety} />,
    machine: <MachineTab telemetry={state.telemetry} unusual={state.unusual_behavior} />,
    training: <TrainingTab />,
    incidents: <IncidentsTab incidents={Array.isArray(state.incidents) ? state.incidents : Object.values(state.incidents || {})} telemetry={state.telemetry} />,
  }), [state]);

  const confirmSos = async () => {
    setConfirming(true);
    await writeSosIncident({ alert_type: 'SOS', severity: 'critical', timestamp: new Date().toISOString(), telemetry_snapshot: state.telemetry });
    setConfirming(false); setSosOpen(false); setFlash(`SOS LOGGED · ${clock}`); setTimeout(() => setFlash(''), 3500);
  };

  return (
    <div className="app-shell">
      {flash && <div className={`flash-message ${flash.startsWith('SOS') ? 'danger' : ''}`}>{flash}</div>}
      <TopBar clock={clock} machine={state.dashboard} demoMode={!firebaseEnabled} onVoice={() => setVoiceOpen(true)} onSos={() => setSosOpen(true)} />
      <main>
        <AlertBanner alert={alert} onView={() => setActive('safety')} onDismiss={() => setDismissedAlert(true)} />
        <div className="tab-heading"><span>{active === 'tasks' ? `GOOD MORNING · ${new Intl.DateTimeFormat('en-IN', {weekday:'long'}).format(new Date()).toUpperCase()}` : active.toUpperCase()}</span><small>SHIFT 01 · NORTH QUARRY</small></div>
        <div className="tab-content" key={active}>{panels[active]}</div>
      </main>
      <BottomNav active={active} onChange={setActive} alertActive={Boolean(alert)} />
      <VoiceAssistant open={voiceOpen} onClose={() => setVoiceOpen(false)} />
      <SosDialog open={sosOpen} confirming={confirming} onClose={() => setSosOpen(false)} onConfirm={confirmSos} />
    </div>
  );
}
