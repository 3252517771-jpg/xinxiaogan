from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.user import User
from app.schemas.risk import RiskCreateRequest, RiskSubmitResponse
from app.services.risk_service import submit_risk_record
from app.utils.dependencies import get_current_user


router = APIRouter(prefix="/health", tags=["health"])


@router.post("/risk", response_model=RiskSubmitResponse)
async def submit_risk(
    payload: RiskCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> RiskSubmitResponse:
    return await submit_risk_record(db, current_user, payload)
