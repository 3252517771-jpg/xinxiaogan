from __future__ import annotations

import asyncio
import json
import sys
from datetime import date, timedelta
from pathlib import Path

from fastapi.testclient import TestClient

ROOT_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT_DIR / "backend"))

from app.database import AsyncSessionLocal  # noqa: E402
from app.models.health import DietRecord, ExerciseRecord, SleepRecord, StressRecord  # noqa: E402
from app.main import app  # noqa: E402


async def seed_behavior_history(user_id: str) -> None:
    today = date.today()
    async with AsyncSessionLocal() as session:
        session.add_all(
            [
                SleepRecord(
                    user_id=user_id,
                    record_date=today - timedelta(days=1),
                    sleep_time="01:25",
                    wake_time="06:10",
                    sleep_quality=2,
                    interruption_count=2,
                    score=35,
                ),
                SleepRecord(
                    user_id=user_id,
                    record_date=today - timedelta(days=2),
                    sleep_time="01:15",
                    wake_time="05:55",
                    sleep_quality=2,
                    interruption_count=3,
                    score=28,
                ),
                DietRecord(
                    user_id=user_id,
                    record_date=today - timedelta(days=1),
                    meal_type="dinner",
                    food_description="咖啡和面包",
                    calories=180,
                    score=40,
                ),
                DietRecord(
                    user_id=user_id,
                    record_date=today - timedelta(days=2),
                    meal_type="lunch",
                    food_description="饼干",
                    calories=160,
                    score=35,
                ),
                ExerciseRecord(
                    user_id=user_id,
                    record_date=today - timedelta(days=1),
                    exercise_type="walking",
                    duration_min=10,
                    intensity="low",
                    steps=1500,
                    heart_rate=80,
                    score=42,
                ),
                StressRecord(
                    user_id=user_id,
                    record_date=today - timedelta(days=1),
                    stress_level=8,
                    anxiety_level=8,
                    emotion_tag="anxious",
                    score=24,
                ),
                StressRecord(
                    user_id=user_id,
                    record_date=today - timedelta(days=2),
                    stress_level=9,
                    anxiety_level=8,
                    emotion_tag="nervous",
                    score=18,
                ),
            ]
        )
        await session.commit()


def main() -> None:
    username = "s2_verifier"
    password = "verify123"

    with TestClient(app) as client:
        register_response = client.post(
            "/api/auth/register",
            json={
                "username": username,
                "password": password,
                "confirm_password": password,
            },
        )
        if register_response.status_code not in (200, 409):
            raise RuntimeError(register_response.text)

        login_response = client.post(
            "/api/auth/login",
            json={
                "username": username,
                "password": password,
            },
        )
        login_response.raise_for_status()
        token = login_response.json()["access_token"]
        me_response = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
        me_response.raise_for_status()
        user_id = me_response.json()["id"]

        asyncio.run(seed_behavior_history(user_id))

        behavior_summary_response = client.get("/api/behavior/summary")
        behavior_summary_response.raise_for_status()

        sleep_submit_response = client.post(
            "/api/health/sleep",
            headers={"Authorization": f"Bearer {token}"},
            json={
                "sleep_time": "01:35",
                "wake_time": "06:20",
                "sleep_quality": 2,
                "interruption_count": 2,
            },
        )
        sleep_submit_response.raise_for_status()

        diet_submit_response = client.post(
            "/api/health/diet",
            headers={"Authorization": f"Bearer {token}"},
            json={
                "meal_type": "dinner",
                "food_description": "面包和咖啡",
                "calories": 180,
            },
        )
        diet_submit_response.raise_for_status()

        exercise_submit_response = client.post(
            "/api/health/exercise",
            headers={"Authorization": f"Bearer {token}"},
            json={
                "exercise_type": "walking",
                "duration_min": 12,
                "intensity": "low",
                "steps": 1800,
                "heart_rate": 82,
            },
        )
        exercise_submit_response.raise_for_status()

        stress_submit_response = client.post(
            "/api/health/stress",
            headers={"Authorization": f"Bearer {token}"},
            json={
                "stress_level": 8,
                "anxiety_level": 8,
                "emotion_tag": "anxious",
            },
        )
        stress_submit_response.raise_for_status()

        risk_submit_response = client.post(
            "/api/health/risk",
            headers={"Authorization": f"Bearer {token}"},
            json={
                "systolic_bp": 148,
                "diastolic_bp": 95,
                "heart_rate": 104,
                "blood_glucose": 6.9,
                "waist_cm": 95,
                "cholesterol": 5.9,
            },
        )
        risk_submit_response.raise_for_status()

        output = {
            "ok": True,
            "behavior_summary": behavior_summary_response.json(),
            "sleep_submit": sleep_submit_response.json(),
            "diet_submit": diet_submit_response.json(),
            "exercise_submit": exercise_submit_response.json(),
            "stress_submit": stress_submit_response.json(),
            "risk_submit": risk_submit_response.json(),
        }

    output_path = ROOT_DIR / "output" / "s2-api-verification.json"
    output_path.write_text(json.dumps(output, ensure_ascii=False, indent=2), encoding="utf-8")
    print(output_path.resolve())


if __name__ == "__main__":
    main()
