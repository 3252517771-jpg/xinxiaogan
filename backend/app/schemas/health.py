from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field

from app.schemas.behavior import BehaviorInsight
from app.schemas.risk import RiskRecordResponse


MealType = Literal["breakfast", "lunch", "dinner", "snack"]
ExerciseType = Literal["running", "walking", "cycling", "fitness", "ball", "other"]
ExerciseIntensity = Literal["low", "medium", "high"]
EmotionTag = Literal["happy", "calm", "anxious", "tired", "irritable", "down", "nervous", "relaxed"]


class SleepCreateRequest(BaseModel):
    sleep_time: str = Field(min_length=5, max_length=5)
    wake_time: str = Field(min_length=5, max_length=5)
    sleep_quality: int = Field(ge=1, le=5)
    interruption_count: int = Field(ge=0, le=20)


class SleepRecordResponse(BaseModel):
    id: str
    user_id: str
    record_date: str
    sleep_time: str
    wake_time: str
    sleep_quality: int
    interruption_count: int
    score: int
    notes: str | None = None


class DietCreateRequest(BaseModel):
    meal_type: MealType
    food_description: str = Field(min_length=1, max_length=500)
    calories: int = Field(ge=0, le=5000)


class DietRecordResponse(BaseModel):
    id: str
    user_id: str
    record_date: str
    meal_type: MealType
    food_description: str
    calories: int
    score: int


class ExerciseCreateRequest(BaseModel):
    exercise_type: ExerciseType
    duration_min: int = Field(ge=1, le=600)
    intensity: ExerciseIntensity
    steps: int | None = Field(default=None, ge=0)
    heart_rate: int | None = Field(default=None, ge=30, le=250)


class ExerciseRecordResponse(BaseModel):
    id: str
    user_id: str
    record_date: str
    exercise_type: ExerciseType
    duration_min: int
    intensity: ExerciseIntensity
    steps: int | None = None
    heart_rate: int | None = None
    score: int


class StressCreateRequest(BaseModel):
    stress_level: int = Field(ge=1, le=10)
    anxiety_level: int = Field(ge=1, le=10)
    emotion_tag: EmotionTag


class StressRecordResponse(BaseModel):
    id: str
    user_id: str
    record_date: str
    stress_level: int
    anxiety_level: int
    emotion_tag: EmotionTag
    score: int


class SleepSubmitResponse(BaseModel):
    ok: bool = True
    score: int
    record: SleepRecordResponse
    behavior_tags: list[BehaviorInsight] = []
    ai_advice: str


class DietSubmitResponse(BaseModel):
    ok: bool = True
    score: int
    record: DietRecordResponse
    behavior_tags: list[BehaviorInsight] = []
    ai_advice: str


class ExerciseSubmitResponse(BaseModel):
    ok: bool = True
    score: int
    record: ExerciseRecordResponse
    behavior_tags: list[BehaviorInsight] = []
    ai_advice: str


class StressSubmitResponse(BaseModel):
    ok: bool = True
    score: int
    record: StressRecordResponse
    behavior_tags: list[BehaviorInsight] = []
    ai_advice: str


class HealthHistoryItem(BaseModel):
    id: str
    dimension: Literal["sleep", "diet", "exercise", "stress", "risk"]
    record_date: str
    title: str
    score: int
    summary: str


class HealthHistoryResponse(BaseModel):
    ok: bool = True
    count: int
    items: list[HealthHistoryItem]


class LatestHealthResponse(BaseModel):
    ok: bool = True
    sleep: SleepRecordResponse | None = None
    diet: DietRecordResponse | None = None
    exercise: ExerciseRecordResponse | None = None
    stress: StressRecordResponse | None = None
    risk: RiskRecordResponse | None = None


class HealthTrendPoint(BaseModel):
    date: str
    overall: int | None = None
    sleep: int | None = None
    diet: int | None = None
    exercise: int | None = None
    stress: int | None = None
    risk: int | None = None


class HealthTrendResponse(BaseModel):
    ok: bool = True
    days: int
    points: list[HealthTrendPoint]
