from __future__ import annotations

import json
import sys
from datetime import date, timedelta
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT_DIR / "backend"))

from app.services.behavior import detect_all_behaviors


def main() -> None:
    today = date(2026, 6, 11)

    sleep_records = [
        {"record_date": (today - timedelta(days=0)).isoformat(), "sleep_time": "01:30", "wake_time": "06:40"},
        {"record_date": (today - timedelta(days=1)).isoformat(), "sleep_time": "01:25", "wake_time": "06:20"},
        {"record_date": (today - timedelta(days=2)).isoformat(), "sleep_time": "01:15", "wake_time": "06:00"},
    ]
    diet_records = [
        {"record_date": (today - timedelta(days=0)).isoformat(), "meal_type": "lunch"},
        {"record_date": (today - timedelta(days=1)).isoformat(), "meal_type": "dinner"},
        {"record_date": (today - timedelta(days=2)).isoformat(), "meal_type": "lunch"},
        {"record_date": (today - timedelta(days=3)).isoformat(), "meal_type": "breakfast"},
    ]
    exercise_records = [
        {"record_date": (today - timedelta(days=0)).isoformat(), "duration_min": 20},
        {"record_date": (today - timedelta(days=1)).isoformat(), "duration_min": 0},
    ]
    stress_records = [
        {"record_date": (today - timedelta(days=0)).isoformat(), "stress_level": 7},
        {"record_date": (today - timedelta(days=1)).isoformat(), "stress_level": 8},
        {"record_date": (today - timedelta(days=2)).isoformat(), "stress_level": 9},
    ]
    risk_records = [
        {
            "record_date": today.isoformat(),
            "systolic_bp": 147,
            "diastolic_bp": 96,
            "heart_rate": 105,
            "blood_glucose": 6.8,
            "waist_cm": 94,
            "cholesterol": 5.7,
        }
    ]

    insights = detect_all_behaviors(
        sleep_records=sleep_records,
        diet_records=diet_records,
        exercise_records=exercise_records,
        stress_records=stress_records,
        risk_records=risk_records,
    )

    output = {
        "ok": True,
        "count": len(insights),
        "highlights": [item.model_dump() for item in insights],
    }

    output_path = Path("output/s2-behavior-audit.json")
    output_path.write_text(json.dumps(output, ensure_ascii=False, indent=2), encoding="utf-8")
    print(output_path.resolve())


if __name__ == "__main__":
    main()
