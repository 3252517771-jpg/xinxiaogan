from __future__ import annotations

from datetime import date

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.risk import RiskRecord
from app.models.user import User, UserProfile
from app.schemas.risk import RiskCreateRequest, RiskRecordResponse, RiskSubmitResponse
from app.services.ai_advice import generate_ai_advice
from app.services.behavior import detect_risk_behaviors
from app.services.risk_predictor import predict_risk
from app.services.score_service import calc_risk_score


async def _load_ai_enabled(db: AsyncSession, user_id: str) -> bool:
    profile = await db.scalar(select(UserProfile).where(UserProfile.user_id == user_id))
    if profile is None:
        return True
    return profile.enable_ai_advice


def _to_record_response(record: RiskRecord) -> RiskRecordResponse:
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


async def submit_risk_record(
    db: AsyncSession,
    current_user: User,
    payload: RiskCreateRequest,
) -> RiskSubmitResponse:
    today = date.today()
    score = calc_risk_score(payload)
    ai_enabled = await _load_ai_enabled(db, current_user.id)
    prediction = predict_risk(payload.model_dump())
    behavior_tags = detect_risk_behaviors([payload.model_dump() | {"record_date": today.isoformat()}])
    ai_advice = await generate_ai_advice(
        dimension="risk",
        score=score,
        behavior_tags=behavior_tags,
        payload=payload.model_dump(),
        enable_ai_advice=ai_enabled,
        risk_level=prediction.risk_level,
        risk_alert=prediction.risk_alert,
    )

    existing_record = await db.scalar(
        select(RiskRecord).where(
            RiskRecord.user_id == current_user.id,
            RiskRecord.record_date == today,
        )
    )

    if existing_record is None:
        record = RiskRecord(
            user_id=current_user.id,
            record_date=today,
            systolic_bp=payload.systolic_bp,
            diastolic_bp=payload.diastolic_bp,
            heart_rate=payload.heart_rate,
            blood_glucose=payload.blood_glucose,
            waist_cm=payload.waist_cm,
            cholesterol=payload.cholesterol,
            score=score,
        )
        db.add(record)
    else:
        record = existing_record
        record.systolic_bp = payload.systolic_bp
        record.diastolic_bp = payload.diastolic_bp
        record.heart_rate = payload.heart_rate
        record.blood_glucose = payload.blood_glucose
        record.waist_cm = payload.waist_cm
        record.cholesterol = payload.cholesterol
        record.score = score

    await db.commit()
    await db.refresh(record)

    return RiskSubmitResponse(
        score=score,
        record=_to_record_response(record),
        risk_level=prediction.risk_level,
        risk_probability=prediction.risk_probability,
        risk_alert=prediction.risk_alert,
        behavior_tags=behavior_tags,
        ai_advice=ai_advice,
    )
