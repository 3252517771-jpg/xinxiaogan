from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.user import User
from app.schemas.behavior import BehaviorSummaryResponse
from app.services.behavior import build_behavior_summary
from app.utils.dependencies import get_current_user


router = APIRouter(prefix="/behavior", tags=["behavior"])


@router.get("/summary", response_model=BehaviorSummaryResponse)
async def get_behavior_summary(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> BehaviorSummaryResponse:
    highlights = await build_behavior_summary(db, current_user.id)
    return BehaviorSummaryResponse(
        count=len(highlights),
        highlights=highlights,
    )
