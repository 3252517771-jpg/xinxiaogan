from __future__ import annotations

import logging
from dataclasses import dataclass
from datetime import date, timedelta
from typing import Protocol

import httpx
from sqlalchemy import exists, func, select
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker

from app.models.health import DietRecord, ExerciseRecord, SleepRecord, StressRecord
from app.models.risk import RiskRecord
from app.models.user import UserProfile

logger = logging.getLogger(__name__)

SERVER_CHAN_BASE_URL = "https://sctapi.ftqq.com"
SENDKEY_PREFIX = "SCT"


@dataclass(frozen=True)
class PushResult:
    success: bool
    message: str


class PushProfile(Protocol):
    wechat_sendkey: str | None


def is_valid_sendkey(sendkey: str | None) -> bool:
    return bool(sendkey and sendkey.startswith(SENDKEY_PREFIX) and len(sendkey) >= 16)


async def send_wechat_push(
    sendkey: str,
    title: str,
    content: str = "",
    short: str | None = None,
) -> PushResult:
    if not is_valid_sendkey(sendkey):
        return PushResult(success=False, message="SendKey 格式不正确")

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                f"{SERVER_CHAN_BASE_URL}/{sendkey}.send",
                data={
                    "title": title[:32],
                    "desp": content[:32768],
                    "short": (short or content or title)[:64],
                    "noip": "1",
                },
            )
            response.raise_for_status()
            body = response.json()
    except (httpx.HTTPError, ValueError) as exc:
        logger.warning("server_chan_push_failed: %s", exc.__class__.__name__)
        return PushResult(success=False, message="推送服务暂时不可用")

    if body.get("code") == 0:
        return PushResult(success=True, message="测试推送已加入 Server 酱队列")

    return PushResult(success=False, message=str(body.get("message") or "Server 酱返回失败"))


async def send_profile_push_test(profile: PushProfile) -> PushResult:
    if not profile.wechat_sendkey:
        return PushResult(success=False, message="请先填写并保存 SendKey")

    return await send_wechat_push(
        sendkey=profile.wechat_sendkey,
        title="小心肝推送测试",
        content="这是一条来自小心肝的微信通知测试。收到它，就说明 S4 推送通道已经连通。",
        short="小心肝推送通道已连通",
    )


async def _push_enabled_profiles(db: AsyncSession) -> list[UserProfile]:
    result = await db.scalars(
        select(UserProfile).where(
            UserProfile.enable_push.is_(True),
            UserProfile.wechat_sendkey.is_not(None),
        )
    )
    return [profile for profile in result.all() if is_valid_sendkey(profile.wechat_sendkey)]


async def check_daily_reminder(db: AsyncSession) -> int:
    today = date.today()
    sent_count = 0

    for profile in await _push_enabled_profiles(db):
        checks = (
            exists().where(SleepRecord.user_id == profile.user_id, SleepRecord.record_date == today),
            exists().where(DietRecord.user_id == profile.user_id, DietRecord.record_date == today),
            exists().where(ExerciseRecord.user_id == profile.user_id, ExerciseRecord.record_date == today),
            exists().where(StressRecord.user_id == profile.user_id, StressRecord.record_date == today),
            exists().where(RiskRecord.user_id == profile.user_id, RiskRecord.record_date == today),
        )
        has_any_record = any([bool(await db.scalar(select(check))) for check in checks])
        if has_any_record:
            continue

        result = await send_wechat_push(
            profile.wechat_sendkey or "",
            "小心肝今日提醒",
            "今天还没有记录健康数据。花一分钟补一条，森林里的小伙伴就知道你今天的状态啦。",
            "今天还没有记录健康数据",
        )
        if result.success:
            sent_count += 1

    return sent_count


async def check_risk_alert(db: AsyncSession) -> int:
    today = date.today()
    sent_count = 0
    rows = await db.execute(
        select(UserProfile, RiskRecord)
        .join(RiskRecord, RiskRecord.user_id == UserProfile.user_id)
        .where(
            UserProfile.enable_push.is_(True),
            UserProfile.wechat_sendkey.is_not(None),
            RiskRecord.record_date == today,
            RiskRecord.score < 60,
        )
    )

    for profile, _record in rows.all():
        if not is_valid_sendkey(profile.wechat_sendkey):
            continue
        result = await send_wechat_push(
            profile.wechat_sendkey or "",
            "小心肝风险提醒",
            "小心肝检测到今天的体征趋势需要关注，记得打开风险页看一眼。",
            "今天的体征趋势需要关注",
        )
        if result.success:
            sent_count += 1

    return sent_count


async def check_encouragement(db: AsyncSession) -> int:
    start_date = date.today() - timedelta(days=2)
    sent_count = 0
    rows = await db.execute(
        select(UserProfile.user_id, func.count())
        .select_from(UserProfile)
        .join(SleepRecord, SleepRecord.user_id == UserProfile.user_id)
        .where(
            UserProfile.enable_push.is_(True),
            UserProfile.wechat_sendkey.is_not(None),
            SleepRecord.record_date >= start_date,
            SleepRecord.score >= 80,
        )
        .group_by(UserProfile.user_id)
        .having(func.count() >= 3)
    )
    user_ids = [row[0] for row in rows.all()]
    if not user_ids:
        return sent_count

    profiles = await db.scalars(select(UserProfile).where(UserProfile.user_id.in_(user_ids)))
    for profile in profiles.all():
        if not is_valid_sendkey(profile.wechat_sendkey):
            continue
        result = await send_wechat_push(
            profile.wechat_sendkey or "",
            "小心肝连续好状态",
            "连续 3 天作息状态都很棒，继续保持这个节奏。",
            "连续 3 天状态不错",
        )
        if result.success:
            sent_count += 1

    return sent_count


def register_push_jobs(scheduler, session_factory: async_sessionmaker[AsyncSession]) -> None:
    async def run_daily_reminder() -> None:
        async with session_factory() as db:
            await check_daily_reminder(db)

    async def run_risk_alert() -> None:
        async with session_factory() as db:
            await check_risk_alert(db)

    async def run_encouragement() -> None:
        async with session_factory() as db:
            await check_encouragement(db)

    scheduler.add_job(run_daily_reminder, "cron", hour=21, minute=0, id="daily-reminder", replace_existing=True)
    scheduler.add_job(run_risk_alert, "cron", hour=22, minute=0, id="risk-alert", replace_existing=True)
    scheduler.add_job(run_encouragement, "cron", day_of_week="sun", hour=22, minute=30, id="encouragement", replace_existing=True)
