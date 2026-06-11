from __future__ import annotations

from pydantic import BaseModel, Field


class UserProfileResponse(BaseModel):
    id: str
    user_id: str
    nickname: str | None = None
    age: int | None = None
    gender: str | None = None
    height_cm: float | None = None
    weight_kg: float | None = None
    timezone: str
    wechat_sendkey: str | None = None
    enable_ai_advice: bool = True
    enable_push: bool = False


class UserProfileUpdateRequest(BaseModel):
    nickname: str | None = Field(default=None, max_length=50)
    age: int | None = Field(default=None, ge=0, le=150)
    gender: str | None = Field(default=None, max_length=10)
    height_cm: float | None = Field(default=None, gt=0, lt=300)
    weight_kg: float | None = Field(default=None, gt=0, lt=500)
    timezone: str | None = Field(default=None, max_length=50)
    wechat_sendkey: str | None = None
    enable_ai_advice: bool | None = None
    enable_push: bool | None = None
