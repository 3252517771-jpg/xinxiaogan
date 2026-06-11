from typing import Literal

from pydantic import BaseModel


BehaviorTag = Literal[
    "late_night",
    "short_sleep",
    "meal_skip",
    "sedentary",
    "high_stress",
    "abnormal_sign",
]

BehaviorDimension = Literal["sleep", "diet", "exercise", "stress", "risk"]


class BehaviorInsight(BaseModel):
    id: BehaviorTag
    dimension: BehaviorDimension
    label: str


class BehaviorSummaryResponse(BaseModel):
    ok: bool = True
    count: int
    highlights: list[BehaviorInsight]
