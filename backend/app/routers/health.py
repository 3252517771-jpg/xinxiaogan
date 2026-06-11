from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.user import User
from app.schemas.health import (
    DietCreateRequest,
    DietSubmitResponse,
    ExerciseCreateRequest,
    ExerciseSubmitResponse,
    HealthHistoryResponse,
    HealthTrendResponse,
    LatestHealthResponse,
    SleepCreateRequest,
    SleepSubmitResponse,
    StressCreateRequest,
    StressSubmitResponse,
)
from app.schemas.risk import RiskCreateRequest, RiskSubmitResponse
from app.services.health_service import (
    get_latest_health_records,
    get_health_trend,
    list_health_history,
    submit_diet_record,
    submit_exercise_record,
    submit_sleep_record,
    submit_stress_record,
)
from app.services.risk_service import submit_risk_record
from app.utils.dependencies import get_current_user


router = APIRouter(prefix="/health", tags=["health"])


@router.get("/history", response_model=HealthHistoryResponse)
async def get_history(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> HealthHistoryResponse:
    return await list_health_history(db, current_user)


@router.get("/latest", response_model=LatestHealthResponse)
async def get_latest(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> LatestHealthResponse:
    return await get_latest_health_records(db, current_user)


@router.get("/trend", response_model=HealthTrendResponse)
async def get_trend(
    days: int = 7,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> HealthTrendResponse:
    return await get_health_trend(db, current_user, days)


@router.post("/sleep", response_model=SleepSubmitResponse)
async def submit_sleep(
    payload: SleepCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> SleepSubmitResponse:
    return await submit_sleep_record(db, current_user, payload)


@router.post("/diet", response_model=DietSubmitResponse)
async def submit_diet(
    payload: DietCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> DietSubmitResponse:
    return await submit_diet_record(db, current_user, payload)


@router.post("/exercise", response_model=ExerciseSubmitResponse)
async def submit_exercise(
    payload: ExerciseCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ExerciseSubmitResponse:
    return await submit_exercise_record(db, current_user, payload)


@router.post("/stress", response_model=StressSubmitResponse)
async def submit_stress(
    payload: StressCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> StressSubmitResponse:
    return await submit_stress_record(db, current_user, payload)


@router.post("/risk", response_model=RiskSubmitResponse)
async def submit_risk(
    payload: RiskCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> RiskSubmitResponse:
    return await submit_risk_record(db, current_user, payload)
