from __future__ import annotations

from datetime import date

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.risk import RiskRecord
from app.models.user import User
from app.schemas.risk import RiskCreateRequest, RiskRecordResponse, RiskSubmitResponse
from app.services.risk_predictor import predict_risk


def _calculate_risk_score(payload: RiskCreateRequest) -> int:
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

    return max(0, min(100, score))


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
    score = _calculate_risk_score(payload)
    prediction = predict_risk(payload.model_dump())

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
    )
