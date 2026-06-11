from fastapi import APIRouter

from app.schemas.behavior import BehaviorSummaryResponse
from app.services.behavior import build_mock_behavior_summary


router = APIRouter(prefix="/behavior", tags=["behavior"])


@router.get("/summary", response_model=BehaviorSummaryResponse)
async def get_behavior_summary() -> BehaviorSummaryResponse:
    highlights = build_mock_behavior_summary()
    return BehaviorSummaryResponse(
        count=len(highlights),
        highlights=highlights,
    )
