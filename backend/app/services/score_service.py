from __future__ import annotations

from app.schemas.health import DietCreateRequest, ExerciseCreateRequest, SleepCreateRequest, StressCreateRequest
from app.schemas.risk import RiskCreateRequest


def _clamp(score: int) -> int:
    return max(0, min(100, score))


def calc_sleep_score(payload: SleepCreateRequest) -> int:
    score = 0

    if payload.sleep_time <= "23:00":
        score += 10
    elif payload.sleep_time <= "24:00":
        score += 5
    else:
        score -= 5

    sleep_hour, sleep_minute = [int(part) for part in payload.sleep_time.split(":")]
    wake_hour, wake_minute = [int(part) for part in payload.wake_time.split(":")]
    start = sleep_hour * 60 + sleep_minute
    end = wake_hour * 60 + wake_minute
    if end <= start:
        end += 24 * 60
    duration = (end - start) / 60

    if 7 <= duration <= 9:
        score += 40
    elif 6 <= duration < 7:
        score += 20
    else:
        score -= 10

    score += payload.sleep_quality * 8

    if payload.interruption_count == 0:
        score += 20
    elif payload.interruption_count == 1:
        score += 15
    elif payload.interruption_count == 2:
        score += 5

    return _clamp(score)


def calc_diet_score(payload: DietCreateRequest) -> int:
    score = 60
    if payload.meal_type in {"breakfast", "lunch", "dinner"}:
        score += 10
    if 350 <= payload.calories <= 850:
        score += 20
    elif payload.calories < 200 or payload.calories > 1200:
        score -= 15

    if any(keyword in payload.food_description for keyword in ["菜", "蔬", "蛋", "鱼", "鸡", "豆"]):
        score += 10

    return _clamp(score)


def calc_exercise_score(payload: ExerciseCreateRequest) -> int:
    score = 30

    if payload.duration_min >= 45:
        score += 35
    elif payload.duration_min >= 30:
        score += 25
    elif payload.duration_min >= 15:
        score += 15

    intensity_bonus = {"low": 10, "medium": 20, "high": 15}
    score += intensity_bonus[payload.intensity]

    if payload.steps is not None:
        if payload.steps >= 10000:
            score += 20
        elif payload.steps >= 6000:
            score += 10

    if payload.heart_rate is not None and 90 <= payload.heart_rate <= 150:
        score += 10

    return _clamp(score)


def calc_stress_score(payload: StressCreateRequest) -> int:
    score = 100
    score -= payload.stress_level * 6
    score -= payload.anxiety_level * 4
    if payload.emotion_tag in {"relaxed", "calm", "happy"}:
        score += 8
    elif payload.emotion_tag in {"anxious", "irritable", "nervous", "down"}:
        score -= 8
    return _clamp(score)


def calc_risk_score(payload: RiskCreateRequest) -> int:
    score = 100

    if payload.systolic_bp > 140:
        score -= 22
    elif payload.systolic_bp > 120:
        score -= 10

    if payload.diastolic_bp > 90:
        score -= 18
    elif payload.diastolic_bp > 80:
        score -= 8

    if payload.heart_rate < 60 or payload.heart_rate > 100:
        score -= 15

    if payload.blood_glucose < 3.9 or payload.blood_glucose > 6.1:
        score -= 15

    if payload.waist_cm > 90:
        score -= 15

    if payload.cholesterol > 5.2:
        score -= 15

    return _clamp(score)
