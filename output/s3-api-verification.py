from __future__ import annotations

import json
from pathlib import Path

import requests


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "s3-api-verification.json"
BASE_URL = "http://127.0.0.1:8000/api"


def post(path: str, token: str, payload: dict) -> dict:
    response = requests.post(
        f"{BASE_URL}{path}",
        headers={"Authorization": f"Bearer {token}"},
        json=payload,
        timeout=60,
    )
    response.raise_for_status()
    return response.json()


def main() -> None:
    username = "s3_verifier"
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

    result = {
        "sleep": post(
            "/health/sleep",
            token,
            {
                "sleep_time": "01:20",
                "wake_time": "07:10",
                "sleep_quality": 3,
                "interruption_count": 2,
            },
        ),
        "diet": post(
            "/health/diet",
            token,
            {
                "meal_type": "dinner",
                "food_description": "米饭 鸡胸肉 西兰花",
                "calories": 720,
            },
        ),
        "exercise": post(
            "/health/exercise",
            token,
            {
                "exercise_type": "walking",
                "duration_min": 25,
                "intensity": "medium",
                "steps": 6800,
                "heart_rate": 90,
            },
        ),
        "stress": post(
            "/health/stress",
            token,
            {
                "stress_level": 7,
                "anxiety_level": 6,
                "emotion_tag": "anxious",
            },
        ),
        "risk": post(
            "/health/risk",
            token,
            {
                "systolic_bp": 148,
                "diastolic_bp": 95,
                "heart_rate": 101,
                "blood_glucose": 6.8,
                "waist_cm": 92,
                "cholesterol": 5.9,
            },
        ),
    }

    OUTPUT.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    print(str(OUTPUT))


if __name__ == "__main__":
    main()
