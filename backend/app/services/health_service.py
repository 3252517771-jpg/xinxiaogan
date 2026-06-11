from __future__ import annotations

from datetime import date

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.health import DietRecord, ExerciseRecord, SleepRecord, StressRecord
from app.models.user import User
from app.schemas.health import (
    DietCreateRequest,
    DietRecordResponse,
    DietSubmitResponse,
    ExerciseCreateRequest,
    ExerciseRecordResponse,
    ExerciseSubmitResponse,
    SleepCreateRequest,
    SleepRecordResponse,
    SleepSubmitResponse,
    StressCreateRequest,
    StressRecordResponse,
    StressSubmitResponse,
)
from app.services.behavior import (
    detect_diet_behaviors,
    detect_exercise_behaviors,
    detect_sleep_behaviors,
    detect_stress_behaviors,
)
from app.services.score_service import calc_diet_score, calc_exercise_score, calc_sleep_score, calc_stress_score


def _sleep_response(record: SleepRecord) -> SleepRecordResponse:
    return SleepRecordResponse(
        id=record.id,
        user_id=record.user_id,
        record_date=record.record_date.isoformat(),
        sleep_time=record.sleep_time,
        wake_time=record.wake_time,
        sleep_quality=record.sleep_quality,
        interruption_count=record.interruption_count,
        score=record.score,
        notes=record.notes,
    )


def _diet_response(record: DietRecord) -> DietRecordResponse:
    return DietRecordResponse(
        id=record.id,
        user_id=record.user_id,
        record_date=record.record_date.isoformat(),
        meal_type=record.meal_type,
        food_description=record.food_description,
        calories=record.calories,
        score=record.score,
    )


def _exercise_response(record: ExerciseRecord) -> ExerciseRecordResponse:
    return ExerciseRecordResponse(
        id=record.id,
        user_id=record.user_id,
        record_date=record.record_date.isoformat(),
        exercise_type=record.exercise_type,
        duration_min=record.duration_min,
        intensity=record.intensity,
        steps=record.steps,
        heart_rate=record.heart_rate,
        score=record.score,
    )


def _stress_response(record: StressRecord) -> StressRecordResponse:
    return StressRecordResponse(
        id=record.id,
        user_id=record.user_id,
        record_date=record.record_date.isoformat(),
        stress_level=record.stress_level,
        anxiety_level=record.anxiety_level,
        emotion_tag=record.emotion_tag,
        score=record.score,
    )


async def submit_sleep_record(db: AsyncSession, current_user: User, payload: SleepCreateRequest) -> SleepSubmitResponse:
    today = date.today()
    score = calc_sleep_score(payload)

    record = await db.scalar(
        select(SleepRecord).where(
            SleepRecord.user_id == current_user.id,
            SleepRecord.record_date == today,
        )
    )

    if record is None:
        record = SleepRecord(
            user_id=current_user.id,
            record_date=today,
            sleep_time=payload.sleep_time,
            wake_time=payload.wake_time,
            sleep_quality=payload.sleep_quality,
            interruption_count=payload.interruption_count,
            score=score,
        )
        db.add(record)
    else:
        record.sleep_time = payload.sleep_time
        record.wake_time = payload.wake_time
        record.sleep_quality = payload.sleep_quality
        record.interruption_count = payload.interruption_count
        record.score = score

    await db.commit()
    await db.refresh(record)

    records = await db.scalars(
        select(SleepRecord)
        .where(SleepRecord.user_id == current_user.id)
        .order_by(SleepRecord.record_date.desc())
        .limit(7)
    )
    behavior_tags = detect_sleep_behaviors(
        [
            {
                "record_date": item.record_date.isoformat(),
                "sleep_time": item.sleep_time,
                "wake_time": item.wake_time,
            }
            for item in records.all()
        ]
    )

    return SleepSubmitResponse(score=score, record=_sleep_response(record), behavior_tags=behavior_tags)


async def submit_diet_record(db: AsyncSession, current_user: User, payload: DietCreateRequest) -> DietSubmitResponse:
    today = date.today()
    score = calc_diet_score(payload)

    record = DietRecord(
        user_id=current_user.id,
        record_date=today,
        meal_type=payload.meal_type,
        food_description=payload.food_description,
        calories=payload.calories,
        score=score,
    )
    db.add(record)
    await db.commit()
    await db.refresh(record)

    records = await db.scalars(
        select(DietRecord)
        .where(DietRecord.user_id == current_user.id)
        .order_by(DietRecord.record_date.desc())
        .limit(21)
    )
    behavior_tags = detect_diet_behaviors(
        [
            {
                "record_date": item.record_date.isoformat(),
                "meal_type": item.meal_type,
            }
            for item in records.all()
        ]
    )

    return DietSubmitResponse(score=score, record=_diet_response(record), behavior_tags=behavior_tags)


async def submit_exercise_record(
    db: AsyncSession,
    current_user: User,
    payload: ExerciseCreateRequest,
) -> ExerciseSubmitResponse:
    today = date.today()
    score = calc_exercise_score(payload)

    record = ExerciseRecord(
        user_id=current_user.id,
        record_date=today,
        exercise_type=payload.exercise_type,
        duration_min=payload.duration_min,
        intensity=payload.intensity,
        steps=payload.steps,
        heart_rate=payload.heart_rate,
        score=score,
    )
    db.add(record)
    await db.commit()
    await db.refresh(record)

    records = await db.scalars(
        select(ExerciseRecord)
        .where(ExerciseRecord.user_id == current_user.id)
        .order_by(ExerciseRecord.record_date.desc())
        .limit(14)
    )
    behavior_tags = detect_exercise_behaviors(
        [
            {
                "record_date": item.record_date.isoformat(),
                "duration_min": item.duration_min,
            }
            for item in records.all()
        ]
    )

    return ExerciseSubmitResponse(score=score, record=_exercise_response(record), behavior_tags=behavior_tags)


async def submit_stress_record(db: AsyncSession, current_user: User, payload: StressCreateRequest) -> StressSubmitResponse:
    today = date.today()
    score = calc_stress_score(payload)

    record = await db.scalar(
        select(StressRecord).where(
            StressRecord.user_id == current_user.id,
            StressRecord.record_date == today,
        )
    )

    if record is None:
        record = StressRecord(
            user_id=current_user.id,
            record_date=today,
            stress_level=payload.stress_level,
            anxiety_level=payload.anxiety_level,
            emotion_tag=payload.emotion_tag,
            score=score,
        )
        db.add(record)
    else:
        record.stress_level = payload.stress_level
        record.anxiety_level = payload.anxiety_level
        record.emotion_tag = payload.emotion_tag
        record.score = score

    await db.commit()
    await db.refresh(record)

    records = await db.scalars(
        select(StressRecord)
        .where(StressRecord.user_id == current_user.id)
        .order_by(StressRecord.record_date.desc())
        .limit(7)
    )
    behavior_tags = detect_stress_behaviors(
        [
            {
                "record_date": item.record_date.isoformat(),
                "stress_level": item.stress_level,
            }
            for item in records.all()
        ]
    )

    return StressSubmitResponse(score=score, record=_stress_response(record), behavior_tags=behavior_tags)
