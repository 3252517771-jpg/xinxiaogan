from __future__ import annotations

import asyncio
import sys
import tempfile
from datetime import date, timedelta
from pathlib import Path
from uuid import uuid4

ROOT_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT_DIR / "backend"))

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

from app.models import Base
from app.models.health import SleepRecord
from app.models.risk import RiskRecord
from app.models.user import User, UserProfile
from app.services import push_service
from app.services.push_service import PushResult


def unique_id() -> str:
    return str(uuid4())


def make_user(username: str, enable_push: bool, sendkey: str | None = "SCT_TEST_VALID_KEY_123") -> tuple[User, UserProfile]:
    user = User(id=unique_id(), username=username, password_hash="smoke-test")
    profile = UserProfile(user_id=user.id, nickname=username, enable_push=enable_push, wechat_sendkey=sendkey)
    return user, profile


async def main() -> None:
    sent_messages: list[dict[str, str]] = []

    async def fake_send_wechat_push(sendkey: str, title: str, content: str = "", short: str | None = None) -> PushResult:
        sent_messages.append({"sendkey": sendkey, "title": title, "short": short or ""})
        return PushResult(success=True, message="fake queued")

    original_sender = push_service.send_wechat_push
    push_service.send_wechat_push = fake_send_wechat_push

    db_file = Path(tempfile.gettempdir()) / f"xinxiaogan-s4-push-smoke-{uuid4().hex}.db"
    engine = create_async_engine(f"sqlite+aiosqlite:///{db_file.as_posix()}", future=True)
    SessionLocal = async_sessionmaker(engine, expire_on_commit=False)

    try:
        async with engine.begin() as connection:
            await connection.run_sync(Base.metadata.create_all)

        today = date.today()
        async with SessionLocal() as db:
            daily_user, daily_profile = make_user("daily_target", True)
            disabled_user, disabled_profile = make_user("disabled_user", False)
            nokey_user, nokey_profile = make_user("nokey_user", True, None)
            recorded_user, recorded_profile = make_user("already_recorded", True)
            risk_user, risk_profile = make_user("risk_target", True)
            safe_risk_user, safe_risk_profile = make_user("safe_risk", True)
            encourage_user, encourage_profile = make_user("encourage_target", True)
            weak_encourage_user, weak_encourage_profile = make_user("weak_encourage", True)

            db.add_all(
                [
                    daily_user,
                    daily_profile,
                    disabled_user,
                    disabled_profile,
                    nokey_user,
                    nokey_profile,
                    recorded_user,
                    recorded_profile,
                    risk_user,
                    risk_profile,
                    safe_risk_user,
                    safe_risk_profile,
                    encourage_user,
                    encourage_profile,
                    weak_encourage_user,
                    weak_encourage_profile,
                    SleepRecord(
                        user_id=recorded_user.id,
                        record_date=today,
                        sleep_time="23:00",
                        wake_time="07:00",
                        sleep_quality=4,
                        interruption_count=0,
                        score=88,
                    ),
                    RiskRecord(
                        user_id=risk_user.id,
                        record_date=today,
                        systolic_bp=150,
                        diastolic_bp=95,
                        heart_rate=95,
                        blood_glucose=8.0,
                        waist_cm=95,
                        cholesterol=6.0,
                        score=50,
                    ),
                    RiskRecord(
                        user_id=safe_risk_user.id,
                        record_date=today,
                        systolic_bp=115,
                        diastolic_bp=75,
                        heart_rate=70,
                        blood_glucose=5.5,
                        waist_cm=78,
                        cholesterol=4.2,
                        score=90,
                    ),
                    *[
                        SleepRecord(
                            user_id=encourage_user.id,
                            record_date=today - timedelta(days=offset),
                            sleep_time="23:00",
                            wake_time="07:00",
                            sleep_quality=4,
                            interruption_count=0,
                            score=88,
                        )
                        for offset in range(3)
                    ],
                    *[
                        SleepRecord(
                            user_id=weak_encourage_user.id,
                            record_date=today - timedelta(days=offset),
                            sleep_time="23:30",
                            wake_time="07:00",
                            sleep_quality=4,
                            interruption_count=0,
                            score=88,
                        )
                        for offset in range(2)
                    ],
                ]
            )
            await db.commit()

            scheduler = AsyncIOScheduler(timezone="Asia/Shanghai")
            push_service.register_push_jobs(scheduler, SessionLocal)
            job_ids = sorted(job.id for job in scheduler.get_jobs())

            daily_count = await push_service.check_daily_reminder(db)
            risk_count = await push_service.check_risk_alert(db)
            encouragement_count = await push_service.check_encouragement(db)

        expected_job_ids = ["daily-reminder", "encouragement", "risk-alert"]
        assert job_ids == expected_job_ids, f"unexpected scheduler jobs: {job_ids}"
        assert daily_count == 1, f"daily reminder should send 1, got {daily_count}"
        assert risk_count == 1, f"risk alert should send 1, got {risk_count}"
        assert encouragement_count == 1, f"encouragement should send 1, got {encouragement_count}"
        assert len(sent_messages) == 3, f"expected 3 fake pushes, got {len(sent_messages)}"
        assert all(message["sendkey"].startswith("SCT") for message in sent_messages)

        print("S4 push rule smoke passed")
        print(f"scheduler_jobs={job_ids}")
        print(f"daily_reminder_count={daily_count}")
        print(f"risk_alert_count={risk_count}")
        print(f"encouragement_count={encouragement_count}")
        print(f"captured_titles={[message['title'] for message in sent_messages]}")
    finally:
        push_service.send_wechat_push = original_sender
        await engine.dispose()
        db_file.unlink(missing_ok=True)


if __name__ == "__main__":
    asyncio.run(main())
