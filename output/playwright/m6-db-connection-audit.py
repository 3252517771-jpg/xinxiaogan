from __future__ import annotations

import asyncio
import json
from datetime import datetime
from pathlib import Path

from sqlalchemy.exc import SQLAlchemyError

from app.config import get_settings
from app.database import dispose_engine, ping_database


async def main() -> None:
    settings = get_settings()
    evidence_path = Path("output/playwright/m6-db-connection-verification.json")
    evidence_path.parent.mkdir(parents=True, exist_ok=True)

    evidence: dict[str, object] = {
        "milestone": "M6",
        "requirement": "FastAPI + SQLite 开发数据库启动，第一条 SQL 可通过",
        "checked_at": datetime.now().isoformat(timespec="seconds"),
        "database_url_driver": settings.database_url.split(":", 1)[0],
        "app_import_ok": True,
        "sql": "SELECT 1",
        "passed": False,
    }

    try:
        ping = await ping_database()
        evidence["database_ping"] = ping
        evidence["passed"] = bool(ping["ok"])
    except (SQLAlchemyError, OSError) as exc:
        evidence["error_type"] = exc.__class__.__name__
        evidence["error"] = str(exc)
    finally:
        await dispose_engine()

    evidence_path.write_text(
        json.dumps(evidence, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(json.dumps(evidence, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    asyncio.run(main())
