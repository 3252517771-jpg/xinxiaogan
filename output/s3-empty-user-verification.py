from __future__ import annotations

import json
import time
import urllib.request
from pathlib import Path
from typing import Any


BASE_URL = "http://127.0.0.1:8000/api"
OUTPUT_PATH = Path("output/s3-empty-user-verification.json")


def api_request(path: str, *, method: str = "GET", payload: dict[str, Any] | None = None, token: str | None = None) -> dict[str, Any]:
    data = None if payload is None else json.dumps(payload).encode("utf-8")
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"

    request = urllib.request.Request(f"{BASE_URL}{path}", data=data, headers=headers, method=method)
    with urllib.request.urlopen(request, timeout=60) as response:
        return json.loads(response.read().decode("utf-8"))


def main() -> None:
    username = f"s3_empty_{int(time.time())}"
    password = "verify123"
    token_response = api_request(
        "/auth/register",
        method="POST",
        payload={
            "username": username,
            "password": password,
            "confirm_password": password,
        },
    )
    token = str(token_response["access_token"])

    profile = api_request("/user/profile", token=token)
    summary_before = api_request("/behavior/summary", token=token)
    sleep_response = api_request(
        "/health/sleep",
        method="POST",
        token=token,
        payload={
            "sleep_time": "23:30",
            "wake_time": "07:10",
            "sleep_quality": 4,
            "interruption_count": 1,
        },
    )
    summary_after = api_request("/behavior/summary", token=token)

    empty_profile_fields = {
        "age": profile["age"],
        "gender": profile["gender"],
        "height_cm": profile["height_cm"],
        "weight_kg": profile["weight_kg"],
    }
    report = {
        "username": username,
        "profile_empty_fields": empty_profile_fields,
        "summary_before": summary_before,
        "sleep_has_ai_advice": bool(sleep_response.get("ai_advice")),
        "sleep_score": sleep_response.get("score"),
        "sleep_record_user_id": sleep_response.get("record", {}).get("user_id"),
        "summary_after": summary_after,
        "passed": all(value is None for value in empty_profile_fields.values())
        and summary_before.get("highlights") == []
        and bool(sleep_response.get("ai_advice")),
    }

    OUTPUT_PATH.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(OUTPUT_PATH)
    if not report["passed"]:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
