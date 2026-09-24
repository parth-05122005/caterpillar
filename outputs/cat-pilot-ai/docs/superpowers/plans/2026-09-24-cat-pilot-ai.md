# CAT Pilot AI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a local-first CAT Pilot AI demo with a five-tab operator dashboard, model APIs, safety orchestration, and replay scaffolding.

**Architecture:** A Vite React client consumes a normalized live-state adapter with demo and Firebase modes. A FastAPI service owns prediction and RAG endpoints; standalone training and replay processes own offline artifacts and simulated event ingestion.

**Tech Stack:** React, Vite, Tailwind CSS, Firebase JS/Admin SDKs, FastAPI, scikit-learn, OpenCV/Ultralytics/MediaPipe as optional demo integrations.

**Spec:** `docs/superpowers/specs/2026-09-24-cat-pilot-ai-design.md`

## Global Constraints

- Single-page, five-tab operator experience with no routed pages.
- Buttons are at least 56 px tall and typing is not required for normal operator flows.
- Synthetic labels and simulation mode are disclosed in the UI and documentation.
- Safety rule priority is deterministic and critical alerts appear across every tab.
- Secrets and Firebase credentials remain environment-only.

## Review Focus

- Missing Firebase configuration still opens a complete demo dashboard.
- Empty or malformed inference payloads return useful validation errors.
- Critical hazards override warning-only conditions.
- Speech APIs missing from the browser leave a usable typed-free fallback.
- Missing optional video/vision packages do not prevent model training or API startup.

---

### Task 1: Domain contracts and tests

**Files:**
- Create: `backend/tests/test_safety.py`
- Create: `frontend/tests/state.test.mjs`
- Create: `backend/schemas.py`
- Create: `backend/vision/orchestrator.py`
- Create: `frontend/src/lib/state.js`

- [ ] Write safety and dashboard-state tests with literal expected values.
- [ ] Run both tests and confirm they fail because production modules do not exist.
- [ ] Implement the minimal normalization and severity logic.
- [ ] Run both suites and confirm they pass.

### Task 2: Operator dashboard

**Files:**
- Create: `frontend/src/App.jsx`
- Create: `frontend/src/components/*`
- Create: `frontend/src/components/tabs/*`
- Create: `frontend/src/styles.css`

- [ ] Build the persistent header, critical alert rail, five panels, voice overlay, and SOS confirmation.
- [ ] Add responsive tablet/mobile layouts and reduced-motion support.
- [ ] Connect the demo/Firebase data adapter and live clock.
- [ ] Produce a successful optimized build.

### Task 3: Prediction service and model training

**Files:**
- Create: `backend/main.py`
- Create: `backend/model_store.py`
- Create: `training/train_models.py`
- Create: `backend/tests/test_api_contracts.py`

- [ ] Add failing tests for input normalization and model-free health behavior.
- [ ] Implement typed endpoints, model loading, and honest error responses.
- [ ] Train both Random Forest pipelines from the supplied datasets.
- [ ] Save artifacts and metrics, then verify prediction shapes.

### Task 4: Replay, Firebase, and voice scaffolding

**Files:**
- Create: `simulation_rig/replay_demo.py`
- Create: `backend/firebase_admin_init.py`
- Create: `backend/rag/voice_query.py`
- Create: `.env.example`

- [ ] Implement independent telemetry/video loops with safe optional imports.
- [ ] Add Firebase write boundaries and local console mode.
- [ ] Add an in-memory manual retriever and grounded-answer provider boundary.
- [ ] Verify dry-run replay against supplied data.

### Task 5: Documentation and final verification

**Files:**
- Create: `README.md`
- Create: `requirements.txt`
- Create: `frontend/package.json`

- [ ] Document one-command setup, credentials, demo flow, and synthetic-data disclosure.
- [ ] Run all tests, the frontend production build, and Python compilation.
- [ ] Verify required data files and generated artifacts are present.
