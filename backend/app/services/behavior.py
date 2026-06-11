from __future__ import annotations

from collections.abc import Sequence
from dataclasses import dataclass
from datetime import date

from app.schemas.behavior import BehaviorDimension, BehaviorInsight, BehaviorTag


@dataclass(frozen=True)
class BehaviorRule:
    id: BehaviorTag
    dimension: BehaviorDimension
    label: str


BEHAVIOR_RULES: dict[BehaviorTag, BehaviorRule] = {
    "late_night": BehaviorRule(
        id="late_night",
        dimension="sleep",
        label="近期熬夜较多，注意调整作息哦",
    ),
    "short_sleep": BehaviorRule(
        id="short_sleep",
        dimension="sleep",
        label="睡眠时间偏短，争取早点休息",
    ),
    "meal_skip": BehaviorRule(
        id="meal_skip",
        dimension="diet",
        label="三餐记录不完整，记得按时吃饭",
    ),
    "sedentary": BehaviorRule(
        id="sedentary",
        dimension="exercise",
        label="近期运动偏少，出门走走活动一下",
    ),
    "high_stress": BehaviorRule(
        id="high_stress",
        dimension="stress",
        label="最近压力较大，记得适当放松",
    ),
    "abnormal_sign": BehaviorRule(
        id="abnormal_sign",
        dimension="risk",
        label="某项指标偏高，建议持续关注",
    ),
}


def _sort_recent(records: Sequence[dict], date_key: str = "record_date") -> list[dict]:
    return sorted(records, key=lambda item: item.get(date_key, ""), reverse=True)


def _sleep_duration_hours(sleep_time: str, wake_time: str) -> float:
    sleep_hour, sleep_minute = [int(part) for part in sleep_time.split(":")]
    wake_hour, wake_minute = [int(part) for part in wake_time.split(":")]
    start = sleep_hour * 60 + sleep_minute
    end = wake_hour * 60 + wake_minute
    if end <= start:
        end += 24 * 60
    return round((end - start) / 60, 2)


def detect_sleep_behaviors(records: Sequence[dict]) -> list[BehaviorInsight]:
    recent = _sort_recent(records)[:7]
    latest_three = recent[:3]
    insights: list[BehaviorInsight] = []

    if len(latest_three) == 3 and all((record.get("sleep_time") or "00:00") > "01:00" for record in latest_three):
        insights.append(BehaviorInsight(**BEHAVIOR_RULES["late_night"].__dict__))

    if len(latest_three) == 3 and all(
        _sleep_duration_hours(record.get("sleep_time", "00:00"), record.get("wake_time", "00:00")) < 6
        for record in latest_three
    ):
        insights.append(BehaviorInsight(**BEHAVIOR_RULES["short_sleep"].__dict__))

    return insights


def detect_diet_behaviors(records: Sequence[dict]) -> list[BehaviorInsight]:
    recent = _sort_recent(records)[:7]
    if not recent:
        return []

    meal_counts: dict[str, set[str]] = {}
    for record in recent:
        record_date = record.get("record_date")
        meal_type = record.get("meal_type")
        if not record_date or not meal_type:
            continue
        meal_counts.setdefault(record_date, set()).add(meal_type)

    missing_meals = 0
    for meals in meal_counts.values():
        missing_meals += max(0, 3 - len({"breakfast", "lunch", "dinner"} & meals))

    if missing_meals >= 4:
        return [BehaviorInsight(**BEHAVIOR_RULES["meal_skip"].__dict__)]
    return []


def detect_exercise_behaviors(records: Sequence[dict]) -> list[BehaviorInsight]:
    recent = _sort_recent(records)[:7]
    active_days = {record.get("record_date") for record in recent if (record.get("duration_min") or 0) > 0}
    if len(active_days) < 3:
        return [BehaviorInsight(**BEHAVIOR_RULES["sedentary"].__dict__)]
    return []


def detect_stress_behaviors(records: Sequence[dict]) -> list[BehaviorInsight]:
    recent = _sort_recent(records)[:3]
    if len(recent) == 3 and all((record.get("stress_level") or 0) >= 7 for record in recent):
        return [BehaviorInsight(**BEHAVIOR_RULES["high_stress"].__dict__)]
    return []


def detect_risk_behaviors(records: Sequence[dict]) -> list[BehaviorInsight]:
    if not records:
        return []

    latest = _sort_recent(records)[0]
    is_abnormal = (
        latest.get("systolic_bp", 0) > 140
        or latest.get("diastolic_bp", 0) > 90
        or latest.get("heart_rate", 0) < 60
        or latest.get("heart_rate", 0) > 100
        or latest.get("blood_glucose", 0.0) < 3.9
        or latest.get("blood_glucose", 0.0) > 6.1
        or latest.get("waist_cm", 0.0) > 90
        or latest.get("cholesterol", 0.0) > 5.2
    )
    if is_abnormal:
        return [BehaviorInsight(**BEHAVIOR_RULES["abnormal_sign"].__dict__)]
    return []


def detect_behaviors_by_dimension(dimension: BehaviorDimension, records: Sequence[dict]) -> list[BehaviorInsight]:
    detectors = {
        "sleep": detect_sleep_behaviors,
        "diet": detect_diet_behaviors,
        "exercise": detect_exercise_behaviors,
        "stress": detect_stress_behaviors,
        "risk": detect_risk_behaviors,
    }
    return detectors[dimension](records)


def detect_all_behaviors(
    *,
    sleep_records: Sequence[dict],
    diet_records: Sequence[dict],
    exercise_records: Sequence[dict],
    stress_records: Sequence[dict],
    risk_records: Sequence[dict],
) -> list[BehaviorInsight]:
    insights = [
        *detect_sleep_behaviors(sleep_records),
        *detect_diet_behaviors(diet_records),
        *detect_exercise_behaviors(exercise_records),
        *detect_stress_behaviors(stress_records),
        *detect_risk_behaviors(risk_records),
    ]
    return insights


def build_mock_behavior_summary(today: date | None = None) -> list[BehaviorInsight]:
    reference_day = today or date.today()
    sleep_records = [
        {"record_date": reference_day.isoformat(), "sleep_time": "01:35", "wake_time": "06:50"},
        {"record_date": reference_day.replace(day=max(1, reference_day.day - 1)).isoformat(), "sleep_time": "01:20", "wake_time": "06:40"},
        {"record_date": reference_day.replace(day=max(1, reference_day.day - 2)).isoformat(), "sleep_time": "01:10", "wake_time": "06:10"},
    ]
    diet_records = [
        {"record_date": reference_day.isoformat(), "meal_type": "lunch"},
        {"record_date": reference_day.isoformat(), "meal_type": "dinner"},
        {"record_date": reference_day.replace(day=max(1, reference_day.day - 1)).isoformat(), "meal_type": "dinner"},
        {"record_date": reference_day.replace(day=max(1, reference_day.day - 2)).isoformat(), "meal_type": "lunch"},
    ]
    exercise_records = [
        {"record_date": reference_day.isoformat(), "duration_min": 0},
        {"record_date": reference_day.replace(day=max(1, reference_day.day - 1)).isoformat(), "duration_min": 0},
    ]
    stress_records = [
        {"record_date": reference_day.isoformat(), "stress_level": 8},
        {"record_date": reference_day.replace(day=max(1, reference_day.day - 1)).isoformat(), "stress_level": 8},
        {"record_date": reference_day.replace(day=max(1, reference_day.day - 2)).isoformat(), "stress_level": 7},
    ]
    risk_records = [
        {
            "record_date": reference_day.isoformat(),
            "systolic_bp": 148,
            "diastolic_bp": 96,
            "heart_rate": 102,
            "blood_glucose": 6.8,
            "waist_cm": 93,
            "cholesterol": 5.8,
        }
    ]

    return detect_all_behaviors(
        sleep_records=sleep_records,
        diet_records=diet_records,
        exercise_records=exercise_records,
        stress_records=stress_records,
        risk_records=risk_records,
    )
