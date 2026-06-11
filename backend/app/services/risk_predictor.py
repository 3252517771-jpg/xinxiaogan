from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any

import joblib
from sklearn.preprocessing import StandardScaler

from app.config import get_settings


FEATURE_ORDER = (
    "systolic_bp",
    "diastolic_bp",
    "heart_rate",
    "blood_glucose",
    "waist_cm",
    "cholesterol",
)

RISK_LEVEL_MAP = {
    0: "low",
    1: "medium",
    2: "high",
}


@dataclass
class RiskPrediction:
    risk_level: str
    risk_probability: float
    risk_alert: bool


_model: Any | None = None
_scaler: StandardScaler | None = None


def _model_file_path(filename: str) -> Path:
    settings = get_settings()
    return settings.ml_models_path / filename


def load_models() -> None:
    global _model, _scaler

    settings = get_settings()
    model_path = _model_file_path(settings.risk_model_filename)
    scaler_path = _model_file_path(settings.risk_scaler_filename)

    if not model_path.exists() or not scaler_path.exists():
        raise FileNotFoundError(
            "risk model artifacts are missing. Run backend/ml_models/train.py in the Conda environment first."
        )

    _model = joblib.load(model_path)
    _scaler = joblib.load(scaler_path)


def _ensure_loaded() -> None:
    if _model is None or _scaler is None:
        load_models()


def predict_risk(features: dict[str, float | int]) -> RiskPrediction:
    _ensure_loaded()

    ordered_values = [[float(features[key]) for key in FEATURE_ORDER]]
    scaled_values = _scaler.transform(ordered_values)

    model_prediction = int(_model.predict(scaled_values)[0])
    if hasattr(_model, "predict_proba"):
        probabilities = _model.predict_proba(scaled_values)[0]
        risk_probability = float(probabilities[model_prediction])
    else:
        risk_probability = 1.0

    risk_level = RISK_LEVEL_MAP.get(model_prediction, "medium")
    return RiskPrediction(
        risk_level=risk_level,
        risk_probability=round(risk_probability, 3),
        risk_alert=risk_level == "high",
    )
