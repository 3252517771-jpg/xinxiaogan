from typing import Literal

from pydantic import BaseModel, Field

from app.schemas.behavior import BehaviorInsight


RiskLevel = Literal["low", "medium", "high"]


class RiskCreateRequest(BaseModel):
    systolic_bp: int = Field(ge=60, le=250)
    diastolic_bp: int = Field(ge=30, le=150)
    heart_rate: int = Field(ge=30, le=250)
    blood_glucose: float = Field(ge=1.0, le=30.0)
    waist_cm: float = Field(ge=0.0, le=200.0)
    cholesterol: float = Field(ge=0.0, le=20.0)


class RiskPredictionResponse(BaseModel):
    risk_level: RiskLevel
    risk_probability: float = Field(ge=0.0, le=1.0)
    risk_alert: bool


class RiskRecordResponse(BaseModel):
    id: str
    user_id: str
    record_date: str
    systolic_bp: int
    diastolic_bp: int
    heart_rate: int
    blood_glucose: float
    waist_cm: float
    cholesterol: float
    score: int


class RiskSubmitResponse(BaseModel):
    ok: bool = True
    score: int
    record: RiskRecordResponse
    risk_level: RiskLevel
    risk_probability: float = Field(ge=0.0, le=1.0)
    risk_alert: bool
    behavior_tags: list[BehaviorInsight] = []
    ai_advice: str
