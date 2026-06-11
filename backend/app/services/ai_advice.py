from __future__ import annotations

from typing import Any, Literal

from openai import AsyncOpenAI

from app.config import get_settings
from app.schemas.behavior import BehaviorInsight


AdviceDimension = Literal["sleep", "diet", "exercise", "stress", "risk"]

SYSTEM_PROMPT = (
    "你是“小心肝”的健康陪伴助手。"
    "你收到的数据已经过脱敏处理，不包含任何身份信息。"
    "请基于这些摘要生成一段简短、温和、具体、可执行的建议。"
    "要求：1. 60字以内。2. 不要医学诊断。3. 不要复述隐私。4. 最多1个emoji。"
)

FALLBACK_TEMPLATES: dict[AdviceDimension, dict[str, str]] = {
    "sleep": {
        "high": "最近作息状态不错，继续把入睡和起床时间尽量固定，晚上少受信息流打扰。",
        "medium": "这几天先把睡前节奏放慢一点，今晚比平时早躺下15分钟，会更容易稳住状态。",
        "low": "这段时间先别硬撑，今晚优先补足睡眠，把入睡时间慢慢往前挪一点点。",
    },
    "diet": {
        "high": "饮食结构整体在线，接下来继续守住规律进餐，把油重和太晚的餐次再收一收。",
        "medium": "先把三餐节奏稳住，比起吃得完美，按时吃和不过晚会更快帮你把状态拉回来。",
        "low": "这几天先别让自己空腹太久，优先补齐正餐，再慢慢减少高油高糖的临时应付。",
    },
    "exercise": {
        "high": "运动节奏不错，接下来保持中等强度，同时记得在久坐时穿插几次短暂活动。",
        "medium": "先别追求太猛，今天补一段20到30分钟的轻中强度活动，比完全不动更关键。",
        "low": "先从短一点的活动开始也很好，出去走一走或做几组拉伸，身体会更快找回状态。",
    },
    "stress": {
        "high": "你现在的节奏还稳得住，继续给自己留一点缓冲时间，别把每件事都排得太满。",
        "medium": "先把注意力收回到眼前一件小事上，配合几次慢呼吸，会比硬扛更有效。",
        "low": "这阵子先给自己减一点负荷，今晚少接收刺激信息，把任务拆小会轻松很多。",
    },
    "risk": {
        "high": "当前体征整体比较稳，继续按现在的频率记录，重点看趋势而不是单次波动。",
        "medium": "这几项体征值得持续盯住，最近把作息、饮食和活动量尽量收回到更规律的节奏。",
        "low": "这次体征提醒先别拖，尽快复测并持续记录变化，必要时考虑线下做进一步检查。",
    },
}


def _score_bucket(score: int, risk_level: str | None = None) -> str:
    if risk_level == "high" or score < 60:
        return "low"
    if risk_level == "medium" or score < 80:
        return "medium"
    return "high"


def _score_level_text(score: int, risk_level: str | None = None) -> str:
    bucket = _score_bucket(score, risk_level)
    return {
        "high": "状态较稳",
        "medium": "状态一般",
        "low": "需要更多关注",
    }[bucket]


def _describe_time_slot(value: str | None) -> str | None:
    if not value:
        return None
    hour = int(value.split(":")[0])
    if hour < 1:
        return "深夜前后"
    if hour < 3:
        return "凌晨时段"
    if hour < 6:
        return "清晨前后"
    if hour < 10:
        return "早晨时段"
    if hour < 14:
        return "白天时段"
    if hour < 19:
        return "傍晚时段"
    return "夜间时段"


def _describe_sleep_quality(value: int | None) -> str | None:
    if value is None:
        return None
    if value >= 4:
        return "睡眠质量较好"
    if value == 3:
        return "睡眠质量中等"
    return "睡眠质量偏弱"


def _describe_stress_level(value: int | None) -> str | None:
    if value is None:
        return None
    if value <= 3:
        return "压力感较轻"
    if value <= 6:
        return "压力感中等"
    return "压力感较高"


def _describe_calories(value: int | None) -> str | None:
    if value is None:
        return None
    if value < 500:
        return "摄入偏少"
    if value <= 900:
        return "摄入适中"
    return "摄入偏多"


def _describe_exercise(duration: int | None, intensity: str | None) -> str | None:
    if duration is None:
        return None
    duration_text = "短时活动" if duration < 20 else "常规活动" if duration < 45 else "较长活动"
    intensity_text = {
        "low": "低强度",
        "medium": "中等强度",
        "high": "高强度",
    }.get(intensity or "", "活动")
    return f"{duration_text}，{intensity_text}"


def anonymize_for_llm(
    *,
    dimension: AdviceDimension,
    score: int,
    behavior_tags: list[BehaviorInsight],
    payload: dict[str, Any],
    risk_level: str | None = None,
    risk_alert: bool | None = None,
) -> dict[str, Any]:
    summary: dict[str, Any] = {
        "dimension": dimension,
        "score_level": _score_level_text(score, risk_level),
        "behavior_labels": [item.label for item in behavior_tags],
    }

    if dimension == "sleep":
        summary["sleep_time_desc"] = _describe_time_slot(payload.get("sleep_time"))
        summary["wake_time_desc"] = _describe_time_slot(payload.get("wake_time"))
        summary["quality_desc"] = _describe_sleep_quality(payload.get("sleep_quality"))
        interruption = payload.get("interruption_count")
        if interruption is not None:
            summary["interruption_desc"] = "夜间较安稳" if interruption == 0 else "夜间有过中断"
    elif dimension == "diet":
        summary["meal_type"] = payload.get("meal_type")
        summary["calorie_desc"] = _describe_calories(payload.get("calories"))
        food_text = str(payload.get("food_description") or "")
        summary["food_mix"] = "食物种类较单一" if len(food_text.split()) <= 1 else "食物搭配较完整"
    elif dimension == "exercise":
        summary["exercise_desc"] = _describe_exercise(payload.get("duration_min"), payload.get("intensity"))
        steps = payload.get("steps")
        if steps is not None:
            summary["activity_level"] = "步数较充足" if steps >= 8000 else "步数仍可提升"
    elif dimension == "stress":
        summary["stress_desc"] = _describe_stress_level(payload.get("stress_level"))
        emotion_tag = payload.get("emotion_tag")
        if emotion_tag:
            summary["emotion_tag"] = str(emotion_tag)
    elif dimension == "risk":
        summary["risk_level"] = risk_level
        summary["risk_alert"] = bool(risk_alert)
        summary["blood_pressure_desc"] = "血压组合偏高" if payload.get("systolic_bp", 0) >= 140 else "血压表现较稳"
        summary["glucose_desc"] = "血糖表现偏高" if payload.get("blood_glucose", 0) > 6.1 else "血糖表现较稳"

    return summary


def build_fallback_advice(
    *,
    dimension: AdviceDimension,
    score: int,
    behavior_tags: list[BehaviorInsight],
    risk_level: str | None = None,
) -> str:
    bucket = _score_bucket(score, risk_level)
    base = FALLBACK_TEMPLATES[dimension][bucket]
    if behavior_tags:
        return f"{base} 重点留意：{behavior_tags[0].label}。"
    return base


def _build_user_prompt(summary: dict[str, Any]) -> str:
    lines = [
        f"维度：{summary['dimension']}",
        f"状态：{summary['score_level']}",
    ]
    for key, value in summary.items():
        if key in {"dimension", "score_level"} or value in (None, [], ""):
            continue
        if key == "behavior_labels":
            lines.append(f"行为提示：{'；'.join(value) if value else '无'}")
        else:
            lines.append(f"{key}：{value}")
    lines.append("请给出一段具体、温和、可执行的建议。")
    return "\n".join(lines)


async def generate_ai_advice(
    *,
    dimension: AdviceDimension,
    score: int,
    behavior_tags: list[BehaviorInsight],
    payload: dict[str, Any],
    enable_ai_advice: bool = True,
    risk_level: str | None = None,
    risk_alert: bool | None = None,
) -> str:
    settings = get_settings()
    fallback = build_fallback_advice(
        dimension=dimension,
        score=score,
        behavior_tags=behavior_tags,
        risk_level=risk_level,
    )

    if not enable_ai_advice or not settings.enable_ai_advice or not settings.deepseek_api_key:
        return fallback

    summary = anonymize_for_llm(
        dimension=dimension,
        score=score,
        behavior_tags=behavior_tags,
        payload=payload,
        risk_level=risk_level,
        risk_alert=risk_alert,
    )

    client = AsyncOpenAI(
        api_key=settings.deepseek_api_key,
        base_url=settings.deepseek_base_url,
    )

    try:
        response = await client.chat.completions.create(
            model=settings.deepseek_model,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": _build_user_prompt(summary)},
            ],
            max_tokens=120,
            temperature=0.7,
        )
        content = response.choices[0].message.content if response.choices else None
        return content.strip() if content else fallback
    except Exception:
        return fallback
