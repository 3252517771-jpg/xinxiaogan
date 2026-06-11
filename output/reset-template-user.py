from __future__ import annotations

import asyncio
import sys
from datetime import date, timedelta
from pathlib import Path

from sqlalchemy import delete, select

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "backend"))

from app.database import AsyncSessionLocal, init_database
from app.models.health import DietRecord, ExerciseRecord, SleepRecord, StressRecord
from app.models.risk import RiskRecord
from app.models.user import User, UserProfile
from app.utils.security import hash_password


TEMPLATE_USERNAME = "template_user"
TEMPLATE_PASSWORD = "template123"


async def reset_database() -> None:
    await init_database()
    async with AsyncSessionLocal() as db:
        for model in (RiskRecord, StressRecord, ExerciseRecord, DietRecord, SleepRecord, UserProfile, User):
            await db.execute(delete(model))

        user = User(
            username=TEMPLATE_USERNAME,
            password_hash=hash_password(TEMPLATE_PASSWORD),
        )
        db.add(user)
        await db.flush()

        db.add(
            UserProfile(
                user_id=user.id,
                nickname="模板用户",
                age=29,
                gender="other",
                height_cm=170,
                weight_kg=62,
                timezone="Asia/Shanghai",
                enable_ai_advice=True,
                enable_push=False,
            )
        )

        today = date.today()
        for offset in range(7):
            record_date = today - timedelta(days=offset)
            db.add(
                SleepRecord(
                    user_id=user.id,
                    record_date=record_date,
                    sleep_time="23:00" if offset < 3 else "00:30",
                    wake_time="07:30",
                    sleep_quality=4 if offset < 5 else 3,
                    interruption_count=1 if offset < 5 else 2,
                    score=83 - offset,
                )
            )

        meals = [
            ("breakfast", "燕麦 牛奶 鸡蛋", 420, 86),
            ("lunch", "米饭 鸡胸肉 西兰花", 680, 88),
            ("dinner", "杂粮饭 鱼肉 青菜", 620, 84),
        ]
        for offset in range(5):
            record_date = today - timedelta(days=offset)
            for meal_type, food_description, calories, score in meals:
                db.add(
                    DietRecord(
                        user_id=user.id,
                        record_date=record_date,
                        meal_type=meal_type,
                        food_description=food_description,
                        calories=calories,
                        score=score - offset,
                    )
                )

        exercises = [
            ("walking", 35, "medium", 8200, 92, 80),
            ("running", 28, "high", 7600, 128, 78),
            ("fitness", 45, "medium", 6400, 110, 84),
            ("cycling", 40, "medium", 9000, 104, 86),
        ]
        for offset, (exercise_type, duration_min, intensity, steps, heart_rate, score) in enumerate(exercises):
            db.add(
                ExerciseRecord(
                    user_id=user.id,
                    record_date=today - timedelta(days=offset),
                    exercise_type=exercise_type,
                    duration_min=duration_min,
                    intensity=intensity,
                    steps=steps,
                    heart_rate=heart_rate,
                    score=score,
                )
            )

        stress_rows = [
            (4, 3, "calm", 86),
            (5, 4, "tired", 78),
            (6, 5, "anxious", 70),
            (4, 3, "relaxed", 84),
            (7, 6, "nervous", 62),
        ]
        for offset, (stress_level, anxiety_level, emotion_tag, score) in enumerate(stress_rows):
            db.add(
                StressRecord(
                    user_id=user.id,
                    record_date=today - timedelta(days=offset),
                    stress_level=stress_level,
                    anxiety_level=anxiety_level,
                    emotion_tag=emotion_tag,
                    score=score,
                )
            )

        risk_rows = [
            (118, 76, 72, 5.2, 78, 4.6, 88),
            (124, 80, 76, 5.5, 79, 4.8, 84),
            (132, 84, 82, 5.9, 81, 5.0, 76),
            (140, 90, 96, 6.3, 86, 5.6, 58),
        ]
        for offset, (systolic_bp, diastolic_bp, heart_rate, blood_glucose, waist_cm, cholesterol, score) in enumerate(risk_rows):
            db.add(
                RiskRecord(
                    user_id=user.id,
                    record_date=today - timedelta(days=offset),
                    systolic_bp=systolic_bp,
                    diastolic_bp=diastolic_bp,
                    heart_rate=heart_rate,
                    blood_glucose=blood_glucose,
                    waist_cm=waist_cm,
                    cholesterol=cholesterol,
                    score=score,
                )
            )

        await db.commit()

    async with AsyncSessionLocal() as db:
        user_count = len((await db.scalars(select(User))).all())
        profile_count = len((await db.scalars(select(UserProfile))).all())
        sleep_count = len((await db.scalars(select(SleepRecord))).all())
        diet_count = len((await db.scalars(select(DietRecord))).all())
        exercise_count = len((await db.scalars(select(ExerciseRecord))).all())
        stress_count = len((await db.scalars(select(StressRecord))).all())
        risk_count = len((await db.scalars(select(RiskRecord))).all())

    print(
        {
            "username": TEMPLATE_USERNAME,
            "password": TEMPLATE_PASSWORD,
            "users": user_count,
            "profiles": profile_count,
            "sleep_records": sleep_count,
            "diet_records": diet_count,
            "exercise_records": exercise_count,
            "stress_records": stress_count,
            "risk_records": risk_count,
        }
    )


if __name__ == "__main__":
    asyncio.run(reset_database())
