from collections.abc import AsyncGenerator
from typing import TypedDict

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, async_sessionmaker, create_async_engine

from app.config import get_settings
from app.models import Base


class DatabasePing(TypedDict):
    ok: bool
    result: int
    database_url_driver: str


def _build_engine() -> AsyncEngine:
    settings = get_settings()
    return create_async_engine(
        settings.database_url,
        pool_pre_ping=True,
        future=True,
    )


engine = _build_engine()
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

SQLITE_USER_PROFILE_PATCHES = (
    "ALTER TABLE user_profiles ADD COLUMN wechat_sendkey TEXT",
    "ALTER TABLE user_profiles ADD COLUMN enable_ai_advice BOOLEAN NOT NULL DEFAULT 1",
    "ALTER TABLE user_profiles ADD COLUMN enable_push BOOLEAN NOT NULL DEFAULT 0",
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session


def get_database_driver_name() -> str:
    return engine.url.drivername


async def ping_database() -> DatabasePing:
    async with engine.connect() as connection:
        result = await connection.execute(text("SELECT 1"))
        scalar_result = result.scalar_one()

    return {
        "ok": scalar_result == 1,
        "result": int(scalar_result),
        "database_url_driver": get_database_driver_name(),
    }


async def init_database() -> None:
    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)
        if engine.url.get_backend_name() == "sqlite":
            result = await connection.execute(text("PRAGMA table_info(user_profiles)"))
            existing_columns = {row[1] for row in result.fetchall()}
            if "wechat_sendkey" not in existing_columns:
                for statement in SQLITE_USER_PROFILE_PATCHES:
                    await connection.execute(text(statement))


async def dispose_engine() -> None:
    await engine.dispose()
