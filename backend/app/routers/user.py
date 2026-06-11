from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserProfileResponse, UserProfileUpdateRequest
from app.services.user_service import get_user_profile, update_user_profile
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
