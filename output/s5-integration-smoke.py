import asyncio
import json
import os
import sys
import tempfile
import time
from pathlib import Path

# Configure before importing app modules.
PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT_ROOT / "backend"))

tmp_db = Path(tempfile.gettempdir()) / f"xinxiaogan_s5_{int(time.time())}.db"
os.environ["DATABASE_URL"] = f"sqlite+aiosqlite:///{tmp_db.as_posix()}"
os.environ["ENABLE_PUSH"] = "false"
os.environ["DEEPSEEK_API_KEY"] = ""

import httpx

from app.main import app


async def main() -> None:
    async with app.router.lifespan_context(app):
        transport = httpx.ASGITransport(app=app)
        async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as client:
            health = await client.get("/health")
            health.raise_for_status()

            username = f"s5_user_{int(time.time())}"
            password = "s5pass123"
            register = await client.post(
                "/api/auth/register",
                json={"username": username, "password": password, "confirm_password": password},
            )
            register.raise_for_status()
            token = register.json()["access_token"]
            headers = {"Authorization": f"Bearer {token}"}

            latest_empty = await client.get("/api/health/latest", headers=headers)
            latest_empty.raise_for_status()
            empty_payload = latest_empty.json()
            empty_ok = all(empty_payload.get(key) is None for key in ["sleep", "diet", "exercise", "stress", "risk"])

            exercise = await client.post(
                "/api/health/exercise",
                headers=headers,
                json={
                    "exercise_type": "walking",
                    "duration_min": 18,
                    "intensity": "low",
                    "steps": 2600,
                    "heart_rate": 86,
                },
            )
            exercise.raise_for_status()
            exercise_payload = exercise.json()

            risk = await client.post(
                "/api/health/risk",
                headers=headers,
                json={
                    "systolic_bp": 148,
                    "diastolic_bp": 94,
                    "heart_rate": 104,
                    "blood_glucose": 7.2,
                    "waist_cm": 96,
                    "cholesterol": 5.8,
                },
            )
            risk.raise_for_status()
            risk_payload = risk.json()

            latest_after = await client.get("/api/health/latest", headers=headers)
            latest_after.raise_for_status()
            latest_after_payload = latest_after.json()

            trend = await client.get("/api/health/trend?days=7", headers=headers)
            trend.raise_for_status()
            trend_payload = trend.json()

            profile = await client.get("/api/user/profile", headers=headers)
            profile.raise_for_status()
            profile_payload = profile.json()

            assertions = {
                "health_ok": health.json().get("status") == "ok",
                "new_user_latest_empty": empty_ok,
                "exercise_has_score": isinstance(exercise_payload.get("score"), int),
                "exercise_has_ai_advice": bool(exercise_payload.get("ai_advice")),
                "exercise_has_behavior_tags": isinstance(exercise_payload.get("behavior_tags"), list),
                "risk_has_ml_fields": all(key in risk_payload for key in ["risk_level", "risk_probability", "risk_alert"]),
                "risk_has_ai_advice": bool(risk_payload.get("ai_advice")),
                "latest_sync_after_submit": latest_after_payload.get("exercise") is not None
                and latest_after_payload.get("risk") is not None,
                "trend_points_7": len(trend_payload.get("points", [])) == 7,
                "trend_has_submitted_scores": any(
                    point.get("exercise") is not None or point.get("risk") is not None
                    for point in trend_payload.get("points", [])
                ),
                "profile_masks_sendkey_state": profile_payload.get("has_wechat_sendkey") is False,
            }
            passed = all(assertions.values())
            print(
                json.dumps(
                    {
                        "passed": passed,
                        "database": str(tmp_db),
                        "assertions": assertions,
                        "sample": {
                            "exercise_score": exercise_payload.get("score"),
                            "exercise_behavior_tags": exercise_payload.get("behavior_tags"),
                            "risk_level": risk_payload.get("risk_level"),
                            "risk_alert": risk_payload.get("risk_alert"),
                            "trend_last": trend_payload.get("points", [])[-1] if trend_payload.get("points") else None,
                        },
                    },
                    ensure_ascii=False,
                    indent=2,
                )
            )
            if not passed:
                raise SystemExit(1)


asyncio.run(main())
