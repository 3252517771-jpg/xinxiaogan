from __future__ import annotations

from datetime import date

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.health import DietRecord, ExerciseRecord, SleepRecord, StressRecord
from app.models.risk import RiskRecord
from app.models.user import User, UserProfile
from app.schemas.health import (
    DietCreateRequest,
    DietRecordResponse,
    DietSubmitResponse,
    HealthHistoryItem,
    HealthHistoryResponse,
    HealthTrendPoint,
    HealthTrendResponse,
    LatestHealthResponse,
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
from app.services.ai_advice import generate_ai_advice
from app.services.score_service import calc_diet_score, calc_exercise_score, calc_sleep_score, calc_stress_score


async def _load_ai_enabled(db: AsyncSession, user_id: str) -> bool:
    profile = await db.scalar(select(UserProfile).where(UserProfile.user_id == user_id))
    if profile is None:
        return True
    return profile.enable_ai_advice


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


def _risk_response(record: RiskRecord):
    from app.schemas.risk import RiskRecordResponse

    return RiskRecordResponse(
        id=record.id,
        user_id=record.user_id,
        record_date=record.record_date.isoformat(),
        systolic_bp=record.systolic_bp,
        diastolic_bp=record.diastolic_bp,
        heart_rate=record.heart_rate,
        blood_glucose=record.blood_glucose,
        waist_cm=record.waist_cm,
        cholesterol=record.cholesterol,
        score=record.score,
    )


def _history_item(record, dimension: str, title: str, summary: str) -> HealthHistoryItem:
    return HealthHistoryItem(
        id=record.id,
        dimension=dimension,
        record_date=record.record_date.isoformat(),
        title=title,
        score=record.score,
        summary=summary,
    )


async def list_health_history(db: AsyncSession, current_user: User, limit: int = 20) -> HealthHistoryResponse:
    sleep_records = (
        await db.scalars(select(SleepRecord).where(SleepRecord.user_id == current_user.id).order_by(SleepRecord.record_date.desc()).limit(limit))
    ).all()
    diet_records = (
        await db.scalars(select(DietRecord).where(DietRecord.user_id == current_user.id).order_by(DietRecord.record_date.desc()).limit(limit))
    ).all()
    exercise_records = (
        await db.scalars(select(ExerciseRecord).where(ExerciseRecord.user_id == current_user.id).order_by(ExerciseRecord.record_date.desc()).limit(limit))
    ).all()
    stress_records = (
        await db.scalars(select(StressRecord).where(StressRecord.user_id == current_user.id).order_by(StressRecord.record_date.desc()).limit(limit))
    ).all()
    risk_records = (
        await db.scalars(select(RiskRecord).where(RiskRecord.user_id == current_user.id).order_by(RiskRecord.record_date.desc()).limit(limit))
    ).all()

    items: list[HealthHistoryItem] = [
        *[
            _history_item(
                record,
                "sleep",
                "作息记录",
                f"{record.sleep_time} 入睡，{record.wake_time} 起床，夜间中断 {record.interruption_count} 次",
            )
            for record in sleep_records
        ],
        *[
            _history_item(record, "diet", "饮食记录", f"{record.meal_type} {record.calories} kcal，{record.food_description}")
            for record in diet_records
        ],
        *[
            _history_item(
                record,
                "exercise",
                "运动记录",
                f"{record.exercise_type} {record.duration_min} 分钟，{record.steps or 0} 步，{record.intensity} 强度",
            )
            for record in exercise_records
        ],
        *[
            _history_item(record, "stress", "压力记录", f"压力 {record.stress_level}/10，焦虑 {record.anxiety_level}/10，情绪 {record.emotion_tag}")
            for record in stress_records
        ],
        *[
            _history_item(
                record,
                "risk",
                "风险记录",
                f"血压 {record.systolic_bp}/{record.diastolic_bp}，心率 {record.heart_rate}，血糖 {record.blood_glucose}",
            )
            for record in risk_records
        ],
    ]
    items.sort(key=lambda item: item.record_date, reverse=True)
    limited_items = items[:limit]
    return HealthHistoryResponse(count=len(limited_items), items=limited_items)


async def get_latest_health_records(db: AsyncSession, current_user: User) -> LatestHealthResponse:
    sleep = await db.scalar(select(SleepRecord).where(SleepRecord.user_id == current_user.id).order_by(SleepRecord.record_date.desc()))
    diet = await db.scalar(select(DietRecord).where(DietRecord.user_id == current_user.id).order_by(DietRecord.record_date.desc()))
    exercise = await db.scalar(select(ExerciseRecord).where(ExerciseRecord.user_id == current_user.id).order_by(ExerciseRecord.record_date.desc()))
    stress = await db.scalar(select(StressRecord).where(StressRecord.user_id == current_user.id).order_by(StressRecord.record_date.desc()))
    risk = await db.scalar(select(RiskRecord).where(RiskRecord.user_id == current_user.id).order_by(RiskRecord.record_date.desc()))

    return LatestHealthResponse(
        sleep=_sleep_response(sleep) if sleep else None,
        diet=_diet_response(diet) if diet else None,
        exercise=_exercise_response(exercise) if exercise else None,
        stress=_stress_response(stress) if stress else None,
        risk=_risk_response(risk) if risk else None,
    )


async def get_health_trend(db: AsyncSession, current_user: User, days: int = 7) -> HealthTrendResponse:
    bounded_days = max(1, min(days, 30))
    today = date.today()
    start_date = today.fromordinal(today.toordinal() - bounded_days + 1)
    day_keys = [start_date.fromordinal(start_date.toordinal() + offset) for offset in range(bounded_days)]
    trend_by_day: dict[date, dict[str, int | None]] = {
        day: {"sleep": None, "diet": None, "exercise": None, "stress": None, "risk": None}
        for day in day_keys
    }

    async def load_dimension(model, key: str) -> None:
        rows = await db.execute(
            select(model.record_date, func.avg(model.score))
            .where(
                model.user_id == current_user.id,
                model.record_date >= start_date,
                model.record_date <= today,
            )
            .group_by(model.record_date)
        )
        for record_date, average_score in rows.all():
            if record_date in trend_by_day:
                trend_by_day[record_date][key] = round(float(average_score))

    await load_dimension(SleepRecord, "sleep")
    await load_dimension(DietRecord, "diet")
    await load_dimension(ExerciseRecord, "exercise")
    await load_dimension(StressRecord, "stress")
    await load_dimension(RiskRecord, "risk")

    points: list[HealthTrendPoint] = []
    for day in day_keys:
        values = trend_by_day[day]
        dimension_scores = [score for score in values.values() if score is not None]
        overall = round(sum(dimension_scores) / len(dimension_scores)) if dimension_scores else None
        points.append(
            HealthTrendPoint(
                date=day.isoformat(),
                overall=overall,
                sleep=values["sleep"],
                diet=values["diet"],
                exercise=values["exercise"],
                stress=values["stress"],
                risk=values["risk"],
            )
        )

    return HealthTrendResponse(days=bounded_days, points=points)


async def submit_sleep_record(db: AsyncSession, current_user: User, payload: SleepCreateRequest) -> SleepSubmitResponse:
    today = date.today()
    score = calc_sleep_score(payload)
    ai_enabled = await _load_ai_enabled(db, current_user.id)

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
    ai_advice = await generate_ai_advice(
        dimension="sleep",
        score=score,
        behavior_tags=behavior_tags,
        payload=payload.model_dump(),
        enable_ai_advice=ai_enabled,
    )

    return SleepSubmitResponse(
        score=score,
        record=_sleep_response(record),
        behavior_tags=behavior_tags,
        ai_advice=ai_advice,
    )


async def submit_diet_record(db: AsyncSession, current_user: User, payload: DietCreateRequest) -> DietSubmitResponse:
    today = date.today()
    score = calc_diet_score(payload)
    ai_enabled = await _load_ai_enabled(db, current_user.id)

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
    ai_advice = await generate_ai_advice(
        dimension="diet",
        score=score,
        behavior_tags=behavior_tags,
        payload=payload.model_dump(),
        enable_ai_advice=ai_enabled,
    )

    return DietSubmitResponse(
        score=score,
        record=_diet_response(record),
        behavior_tags=behavior_tags,
        ai_advice=ai_advice,
    )


async def submit_exercise_record(
    db: AsyncSession,
    current_user: User,
    payload: ExerciseCreateRequest,
) -> ExerciseSubmitResponse:
    today = date.today()
    score = calc_exercise_score(payload)
    ai_enabled = await _load_ai_enabled(db, current_user.id)

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
    ai_advice = await generate_ai_advice(
        dimension="exercise",
        score=score,
        behavior_tags=behavior_tags,
        payload=payload.model_dump(),
        enable_ai_advice=ai_enabled,
    )

    return ExerciseSubmitResponse(
        score=score,
        record=_exercise_response(record),
        behavior_tags=behavior_tags,
        ai_advice=ai_advice,
    )


async def submit_stress_record(db: AsyncSession, current_user: User, payload: StressCreateRequest) -> StressSubmitResponse:
    today = date.today()
    score = calc_stress_score(payload)
    ai_enabled = await _load_ai_enabled(db, current_user.id)

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
    ai_advice = await generate_ai_advice(
        dimension="stress",
        score=score,
        behavior_tags=behavior_tags,
        payload=payload.model_dump(),
        enable_ai_advice=ai_enabled,
    )

    return StressSubmitResponse(
        score=score,
        record=_stress_response(record),
        behavior_tags=behavior_tags,
        ai_advice=ai_advice,
    )
