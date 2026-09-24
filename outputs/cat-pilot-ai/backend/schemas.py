"""Typed API payloads for CAT Pilot AI."""

from pydantic import BaseModel, Field


class TaskTimeRequest(BaseModel):
    task_type: str = Field(min_length=1)
    weather: str = Field(min_length=1)
    operator_skill: str = Field(min_length=1)
    machine_age_yrs: float = Field(ge=0)
    estimated_time_min: float = Field(gt=0)


class UnusualBehaviorRequest(BaseModel):
    engine_hours: float = Field(ge=0)
    fuel_used_l: float = Field(ge=0)
    load_cycles: int = Field(ge=0)
    idling_time_min: float = Field(ge=0)
    seatbelt_status: str
    proximity_hazard: bool


class VoiceQueryRequest(BaseModel):
    question: str = Field(min_length=2, max_length=500)
