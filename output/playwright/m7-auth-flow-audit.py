import asyncio
import json
import sys
from pathlib import Path
from uuid import uuid4

from httpx import ASGITransport, AsyncClient

ROOT_DIR = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT_DIR / "backend"))

from app.database import init_database
from app.main import app


async def main() -> None:
    await init_database()

    username = f"m7_user_{uuid4().hex[:8]}"
    password = "m7-password-123"
    transport = ASGITransport(app=app)

    async with AsyncClient(transport=transport, base_url="http://m7.local") as client:
        register_response = await client.post(
            "/api/auth/register",
            json={
                "username": username,
                "password": password,
                "confirm_password": password,
            },
        )
        register_json = register_response.json()
        register_token = register_json.get("access_token")

        me_after_register_response = await client.get(
            "/api/auth/me",
            headers={"Authorization": f"Bearer {register_token}"},
        )

        login_response = await client.post(
            "/api/auth/login",
            json={"username": username, "password": password},
        )
        login_json = login_response.json()
        login_token = login_json.get("access_token")

        me_after_login_response = await client.get(
            "/api/auth/me",
            headers={"Authorization": f"Bearer {login_token}"},
        )

        invalid_login_response = await client.post(
            "/api/auth/login",
            json={"username": username, "password": "wrong-password"},
        )

        duplicate_register_response = await client.post(
            "/api/auth/register",
            json={
                "username": username,
                "password": password,
                "confirm_password": password,
            },
        )

    evidence = {
        "passed": all(
            [
                register_response.status_code == 200,
                isinstance(register_token, str) and len(register_token) > 20,
                me_after_register_response.status_code == 200,
                me_after_register_response.json().get("username") == username,
                login_response.status_code == 200,
                isinstance(login_token, str) and len(login_token) > 20,
                me_after_login_response.status_code == 200,
                me_after_login_response.json().get("username") == username,
                invalid_login_response.status_code == 401,
                duplicate_register_response.status_code == 409,
            ],
        ),
        "username": username,
        "register": {
            "status_code": register_response.status_code,
            "token_type": register_json.get("token_type"),
            "username": register_json.get("username"),
            "token_present": isinstance(register_token, str) and len(register_token) > 20,
        },
        "me_after_register": {
            "status_code": me_after_register_response.status_code,
            "body": me_after_register_response.json(),
        },
        "login": {
            "status_code": login_response.status_code,
            "token_type": login_json.get("token_type"),
            "username": login_json.get("username"),
            "token_present": isinstance(login_token, str) and len(login_token) > 20,
        },
        "me_after_login": {
            "status_code": me_after_login_response.status_code,
            "body": me_after_login_response.json(),
        },
        "invalid_login_status": invalid_login_response.status_code,
        "duplicate_register_status": duplicate_register_response.status_code,
    }

    output_path = Path("output/playwright/m7-auth-flow-verification.json")
    output_path.write_text(json.dumps(evidence, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(evidence, ensure_ascii=False, indent=2))

    if not evidence["passed"]:
        raise SystemExit(1)


if __name__ == "__main__":
    asyncio.run(main())
