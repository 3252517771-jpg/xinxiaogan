from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User, UserProfile
from app.schemas.user import UserProfileResponse, UserProfileUpdateRequest


def _to_profile_response(profile: UserProfile) -> UserProfileResponse:
    return UserProfileResponse(
        id=profile.id,
        user_id=profile.user_id,
        nickname=profile.nickname,
        age=profile.age,
        gender=profile.gender,
        height_cm=profile.height_cm,
        weight_kg=profile.weight_kg,
        timezone=profile.timezone,
        wechat_sendkey=profile.wechat_sendkey,
        enable_ai_advice=profile.enable_ai_advice,
        enable_push=profile.enable_push,
    )


async def get_user_profile(db: AsyncSession, current_user: User) -> UserProfileResponse:
    profile = await db.scalar(select(UserProfile).where(UserProfile.user_id == current_user.id))
    if profile is None:
        profile = UserProfile(user_id=current_user.id, nickname=current_user.username)
        db.add(profile)
        await db.commit()
        await db.refresh(profile)
    return _to_profile_response(profile)


async def update_user_profile(
    db: AsyncSession,
    current_user: User,
    payload: UserProfileUpdateRequest,
) -> UserProfileResponse:
    profile = await db.scalar(select(UserProfile).where(UserProfile.user_id == current_user.id))
    if profile is None:
        profile = UserProfile(user_id=current_user.id, nickname=current_user.username)
        db.add(profile)
        await db.flush()

    updates = payload.model_dump(exclude_unset=True)
    for key, value in updates.items():
        setattr(profile, key, value)

    await db.commit()
    await db.refresh(profile)
    return _to_profile_response(profile)
