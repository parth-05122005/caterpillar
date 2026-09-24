"""Model artifact loading and inference record normalization."""

from __future__ import annotations

from functools import lru_cache
from pathlib import Path
from typing import Any

MODELS_DIR = Path(__file__).resolve().parent / "models"


def task_time_record(
    task_type: str,
    weather: str,
    operator_skill: str,
    machine_age_yrs: float,
    estimated_time_min: float,
) -> dict[str, Any]:
    return {
        "Task_Type": task_type,
        "Weather": weather,
        "Operator_Skill": operator_skill,
        "Machine_Age_yrs": machine_age_yrs,
        "Estimated_Time_min": estimated_time_min,
    }


def unusual_behavior_record(
    engine_hours: float,
    fuel_used_l: float,
    load_cycles: int,
    idling_time_min: float,
    seatbelt_status: str,
    proximity_hazard: bool | str,
) -> dict[str, Any]:
    seatbelt = "Fastened" if seatbelt_status.strip().lower() == "fastened" else "Unfastened"
    proximity = proximity_hazard
    if isinstance(proximity_hazard, bool):
        proximity = "Yes" if proximity_hazard else "No"
    return {
        "Engine_Hours": engine_hours,
        "Fuel_Used_L": fuel_used_l,
        "Load_Cycles": load_cycles,
        "Idling_Time_min": idling_time_min,
        "Seatbelt_Status": seatbelt,
        "Proximity_Hazard": str(proximity).title(),
    }


@lru_cache(maxsize=4)
def load_model(filename: str):
    path = MODELS_DIR / filename
    if not path.exists():
        raise FileNotFoundError(
            f"Model artifact missing: {path}. Run training/train_models.py first."
        )
    try:
        import joblib
    except ImportError as exc:
        raise RuntimeError("joblib is required to load model artifacts") from exc
    return joblib.load(path)


def predict_record(filename: str, record: dict[str, Any]) -> tuple[Any, float | None]:
    try:
        import pandas as pd
    except ImportError as exc:
        raise RuntimeError("pandas is required for model inference") from exc
    model = load_model(filename)
    frame = pd.DataFrame([record])
    prediction = model.predict(frame)[0]
    confidence = None
    if hasattr(model, "predict_proba"):
        confidence = float(max(model.predict_proba(frame)[0]))
    return prediction, confidence
