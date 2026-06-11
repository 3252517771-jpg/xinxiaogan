from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.user import User
from app.schemas.user import PushTestResponse, UserProfileResponse, UserProfileUpdateRequest
from app.services.push_service import send_profile_push_test
from app.services.user_service import get_or_create_user_profile_model, get_user_profile, update_user_profile
from app.utils.dependencies import get_current_user


router = APIRouter(prefix="/user", tags=["user"])


@router.get("/profile", response_model=UserProfileResponse)
async def read_profile(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> UserProfileResponse:
    return await get_user_profile(db, current_user)


@router.put("/profile", response_model=UserProfileResponse)
async def save_profile(
    payload: UserProfileUpdateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> UserProfileResponse:
    return await update_user_profile(db, current_user, payload)


@router.post("/push-test", response_model=PushTestResponse)
async def push_test(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> PushTestResponse:
    profile = await get_or_create_user_profile_model(db, current_user)
    result = await send_profile_push_test(profile)
    return PushTestResponse(success=result.success, message=result.message)
