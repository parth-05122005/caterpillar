"""FastAPI inference service for the CAT Pilot AI demo."""

from __future__ import annotations

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from backend.model_store import predict_record, task_time_record, unusual_behavior_record
from backend.rag.voice_query import ManualRetriever
from backend.schemas import TaskTimeRequest, UnusualBehaviorRequest, VoiceQueryRequest

app = FastAPI(title="CAT Pilot AI", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:4173", "http://localhost:4173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
retriever = ManualRetriever()


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "cat-pilot-ai"}


@app.post("/predict/task-time")
def predict_task_time(payload: TaskTimeRequest) -> dict[str, float | str]:
    record = task_time_record(**payload.model_dump())
    try:
        value, _ = predict_record("task_time_model.pkl", record)
    except (FileNotFoundError, RuntimeError) as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    predicted = round(float(value), 1)
    delta = round(predicted - payload.estimated_time_min, 1)
    return {
        "predicted_min": predicted,
        "delta_vs_estimate_min": delta,
        "explanation": f"{abs(delta):.1f} min {'over' if delta >= 0 else 'under'} estimate",
    }


@app.post("/predict/unusual-behavior")
def predict_unusual(payload: UnusualBehaviorRequest) -> dict[str, object]:
    record = unusual_behavior_record(**payload.model_dump())
    try:
        value, confidence = predict_record("unusual_behavior_model.pkl", record)
    except (FileNotFoundError, RuntimeError) as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    label = "unsafe" if str(value).strip().lower() in {"yes", "unsafe", "1", "true"} else "normal"
    drivers = []
    if payload.seatbelt_status.lower() != "fastened": drivers.append("seatbelt unfastened")
    if payload.proximity_hazard: drivers.append("proximity hazard")
    if payload.idling_time_min > 30: drivers.append("excessive idling")
    return {"prediction": label, "confidence": confidence, "risk_drivers": drivers}


@app.post("/voice-query")
def voice_query(payload: VoiceQueryRequest) -> dict[str, object]:
    return retriever.answer(payload.question)
