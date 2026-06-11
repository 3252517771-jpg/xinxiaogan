from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User, UserProfile
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse
from app.utils.security import create_access_token, hash_password, verify_password


async def register_user(db: AsyncSession, payload: RegisterRequest) -> TokenResponse:
    username = payload.username.strip()
    if payload.password != payload.confirm_password:
        raise HTTPException(status_code=400, detail="两次输入的密码不一致")

    existing_user = await db.scalar(select(User).where(User.username == username))
    if existing_user:
        raise HTTPException(status_code=409, detail="用户名已存在")

    user = User(username=username, password_hash=hash_password(payload.password))
    db.add(user)
    await db.flush()
    db.add(UserProfile(user_id=user.id, nickname=username))
    await db.commit()
    await db.refresh(user)

    return TokenResponse(access_token=create_access_token(user.id), username=user.username)


async def login_user(db: AsyncSession, payload: LoginRequest) -> TokenResponse:
    username = payload.username.strip()
    user = await db.scalar(select(User).where(User.username == username))
    if not user or user.deleted_at is not None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="用户名或密码错误")

    return TokenResponse(access_token=create_access_token(user.id), username=user.username)
