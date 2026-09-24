import { Mic, Volume2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function VoiceAssistant({ open, onClose }) {
  const [status, setStatus] = useState('Tap the mic and ask about safe operation.');
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    if (!open) { setAnswer(''); setStatus('Tap the mic and ask about safe operation.'); }
  }, [open]);

  const listen = () => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      setStatus('Voice recognition needs Chrome. Try: “When should I check hydraulic oil?”');
      return;
    }
    const recognition = new Recognition();
    recognition.lang = 'en-US';
    recognition.onstart = () => setStatus('Listening…');
    recognition.onerror = () => setStatus('I could not hear that. Tap to try again.');
    recognition.onresult = async (event) => {
      const question = event.results[0][0].transcript;
      setStatus(`“${question}”`);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/voice-query`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question }),
        });
        const data = await response.json();
        setAnswer(data.answer);
        window.speechSynthesis?.speak(new SpeechSynthesisUtterance(data.answer));
      } catch {
        setAnswer('Fasten your seat belt before starting the engine or moving the machine.');
      }
    };
    recognition.start();
  };

  if (!open) return null;
  return (
    <div className="modal-scrim" role="dialog" aria-modal="true" aria-labelledby="voice-title">
      <div className="voice-panel">
        <button className="close-modal" onClick={onClose} aria-label="Close"><X /></button>
        <div className="voice-orbit"><Mic size={38} /></div>
        <span className="eyebrow">OPERATOR MANUAL ASSISTANT</span>
        <h2 id="voice-title">How can I help?</h2>
        <p>{status}</p>
        {answer && <div className="voice-answer"><Volume2 size={22} /><span>{answer}</span></div>}
        <button className="primary-button" onClick={listen}><Mic size={22} /> TAP TO SPEAK</button>
        <small>Answers use loaded operator guidance only.</small>
      </div>
    </div>
  );
}
