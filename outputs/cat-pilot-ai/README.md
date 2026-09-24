# CAT Pilot AI

A local-first hackathon demo for a heavy-equipment operator tablet. It includes a five-tab React dashboard, FastAPI model service, training scripts for the supplied synthetic datasets, deterministic safety orchestration, Firebase adapters, a voice-manual assistant, and an independent-clock replay process.

## What works immediately

The frontend opens in clearly labelled simulation mode with realistic live data. All five tabs, the slope training control, SOS confirmation, alert rail, incident viewer, voice overlay, and responsive cab-friendly layout work without credentials. Add Firebase settings to switch the same interface to live database subscriptions.

## Quick start

Use PowerShell from this folder.

```powershell
# Frontend
cd frontend
npm install
npm run dev

# Backend (separate terminal)
cd ..
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python training\train_models.py
python -m uvicorn backend.main:app --reload
```

Open `http://127.0.0.1:4173`. API docs are at `http://127.0.0.1:8000/docs`.

## Dataset and model disclosure

The task-time and unusual-behavior models train on the supplied 3,000-row synthetic datasets. Unusual-behavior labels are synthetic and rule-derived, so a high validation score demonstrates pipeline behavior rather than real-world generalization. Seatbelt status is read directly from telemetry, phone use is designed for pretrained COCO class 67, and drowsiness uses EAR/MAR-style landmark logic.

## Firebase setup

1. Copy `.env.example` values into `frontend/.env.local` for the Firebase JS SDK.
2. Set `FIREBASE_CREDENTIALS` and `FIREBASE_DATABASE_URL` before starting the replay process.
3. Run `python simulation_rig\replay_demo.py`. Add `--once` for a safe single-row dry run.

The replay process only writes to Firebase. The website only reads Firebase. Without Firebase configuration, writes become no-ops and telemetry is printed locally.

## Optional video safety pipeline

Place the cab clip at `simulation_rig/assets/cab_camera_veo.mp4`, then install the optional packages listed at the bottom of `requirements.txt`. The repository keeps these dependencies optional because model downloads and MediaPipe support vary by machine. The dashboard's camera panel remains usable as a labelled simulation without them.

## Voice assistant

Chrome's Web Speech API handles speech recognition and speech output. `/voice-query` uses a small dependency-free retrieval fallback against loaded guidance. Replace `backend/rag/manual_chunks.json` with extracted manual chunks for a full demo corpus; an external LLM provider can be added behind the retriever boundary without exposing it to the browser.

## Honest demo script

Say this during judging: “Task-time and unusual-behavior models use synthetic data. Seatbelt state comes from telemetry, phone use uses a pretrained detector, and drowsiness uses eye and mouth landmarks. The camera clip and telemetry are simulated, but they travel through the same Firebase path the real hardware would use.”
