from __future__ import annotations

import json
from pathlib import Path

import requests


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "s3-fallback-verification.json"
BASE_URL = "http://127.0.0.1:8000/api"


def main() -> None:
    username = "s3_fallback_user"
    password = "verify123"

    requests.post(
        f"{BASE_URL}/auth/register",
        json={"username": username, "password": password, "confirm_password": password},
        timeout=30,
    )

    login_response = requests.post(
        f"{BASE_URL}/auth/login",
        json={"username": username, "password": password},
        timeout=30,
    )
    login_response.raise_for_status()
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    profile_response = requests.put(
        f"{BASE_URL}/user/profile",
        headers=headers,
        json={"enable_ai_advice": False},
        timeout=30,
    )
    profile_response.raise_for_status()

    sleep_response = requests.post(
        f"{BASE_URL}/health/sleep",
        headers=headers,
        json={
            "sleep_time": "01:40",
            "wake_time": "06:20",
            "sleep_quality": 2,
            "interruption_count": 3,
        },
        timeout=60,
    )
    sleep_response.raise_for_status()

    result = {
        "profile": profile_response.json(),
        "sleep": sleep_response.json(),
    }
    OUTPUT.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    print(str(OUTPUT))


if __name__ == "__main__":
    main()
