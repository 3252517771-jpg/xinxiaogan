from __future__ import annotations

import json
import urllib.request
from pathlib import Path

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler


BASE_URL = "https://wwwn.cdc.gov/Nchs/Data/Nhanes/Public/2017/DataFiles"
RAW_DIR = Path(__file__).resolve().parents[1] / "datasets" / "raw" / "nhanes_2017_2018"
PROCESSED_DIR = Path(__file__).resolve().parents[1] / "datasets" / "processed"
MODEL_DIR = Path(__file__).resolve().parent

DATA_FILES = {
    "blood_pressure": "BPX_J.XPT",
    "body_measure": "BMX_J.XPT",
    "glucose": "GLU_J.XPT",
    "cholesterol": "TCHOL_J.XPT",
    "medical_condition": "MCQ_J.XPT",
}

FEATURE_COLUMNS = [
    "systolic_bp",
    "diastolic_bp",
    "heart_rate",
    "blood_glucose",
    "waist_cm",
    "cholesterol",
]

RISK_LABELS = {
    "low": 0,
    "medium": 1,
    "high": 2,
}


def download_file(filename: str) -> Path:
    RAW_DIR.mkdir(parents=True, exist_ok=True)
    destination = RAW_DIR / filename
    if not destination.exists():
        urllib.request.urlretrieve(f"{BASE_URL}/{filename}", destination)
    return destination


def load_xpt(filename: str) -> pd.DataFrame:
    path = download_file(filename)
    return pd.read_sas(path)


def compute_average(frame: pd.DataFrame, columns: list[str]) -> pd.Series:
    available = [column for column in columns if column in frame.columns]
    return frame[available].mean(axis=1, skipna=True)


def build_training_dataset() -> pd.DataFrame:
    blood_pressure = load_xpt(DATA_FILES["blood_pressure"])
    body_measure = load_xpt(DATA_FILES["body_measure"])
    glucose = load_xpt(DATA_FILES["glucose"])
    cholesterol = load_xpt(DATA_FILES["cholesterol"])
    medical_condition = load_xpt(DATA_FILES["medical_condition"])

    feature_frame = pd.DataFrame(
        {
            "SEQN": blood_pressure["SEQN"],
            "systolic_bp": compute_average(blood_pressure, ["BPXSY1", "BPXSY2", "BPXSY3"]),
            "diastolic_bp": compute_average(blood_pressure, ["BPXDI1", "BPXDI2", "BPXDI3"]),
            "heart_rate": blood_pressure["BPXPLS"],
        }
    )

    feature_frame = feature_frame.merge(
        body_measure.loc[:, ["SEQN", "BMXWAIST"]].rename(columns={"BMXWAIST": "waist_cm"}),
        on="SEQN",
        how="inner",
    )
    feature_frame = feature_frame.merge(
        glucose.loc[:, ["SEQN", "LBXGLU"]].rename(columns={"LBXGLU": "blood_glucose_mg_dl"}),
        on="SEQN",
        how="inner",
    )
    feature_frame = feature_frame.merge(
        cholesterol.loc[:, ["SEQN", "LBXTC"]].rename(columns={"LBXTC": "cholesterol_mg_dl"}),
        on="SEQN",
        how="inner",
    )
    feature_frame = feature_frame.merge(
        medical_condition.loc[:, ["SEQN", "MCQ160C", "MCQ160E", "MCQ160F"]],
        on="SEQN",
        how="left",
    )

    feature_frame["blood_glucose"] = feature_frame["blood_glucose_mg_dl"] / 18.0
    feature_frame["cholesterol"] = feature_frame["cholesterol_mg_dl"] / 38.67
    feature_frame["risk_label"] = feature_frame.apply(assign_risk_label, axis=1)

    clean_frame = feature_frame.dropna(subset=FEATURE_COLUMNS + ["risk_label"]).copy()
    clean_frame = clean_frame.loc[(clean_frame[FEATURE_COLUMNS] > 0).all(axis=1)].copy()
    clean_frame["risk_code"] = clean_frame["risk_label"].map(RISK_LABELS)
    return clean_frame


def assign_risk_label(row: pd.Series) -> str:
    diagnosis_values = {row.get("MCQ160C"), row.get("MCQ160E"), row.get("MCQ160F")}
    diagnosis_positive = 1.0 in diagnosis_values

    risk_points = 0

    if row["systolic_bp"] >= 140:
        risk_points += 2
    elif row["systolic_bp"] >= 130:
        risk_points += 1

    if row["diastolic_bp"] >= 90:
        risk_points += 2
    elif row["diastolic_bp"] >= 80:
        risk_points += 1

    if row["heart_rate"] > 100 or row["heart_rate"] < 50:
        risk_points += 1

    if row["blood_glucose"] >= 7.0:
        risk_points += 2
    elif row["blood_glucose"] >= 5.6:
        risk_points += 1

    if row["waist_cm"] >= 100:
        risk_points += 2
    elif row["waist_cm"] >= 90:
        risk_points += 1

    if row["cholesterol"] >= 6.2:
        risk_points += 2
    elif row["cholesterol"] >= 5.2:
        risk_points += 1

    if diagnosis_positive or risk_points >= 5:
        return "high"
    if risk_points >= 2:
        return "medium"
    return "low"


def main() -> None:
    dataset = build_training_dataset()
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
    processed_csv = PROCESSED_DIR / "risk_training_dataset.csv"
    dataset.to_csv(processed_csv, index=False)

    x_train, x_test, y_train, y_test = train_test_split(
        dataset[FEATURE_COLUMNS],
        dataset["risk_code"],
        test_size=0.2,
        random_state=42,
        stratify=dataset["risk_code"],
    )

    scaler = StandardScaler()
    x_train_scaled = scaler.fit_transform(x_train)
    x_test_scaled = scaler.transform(x_test)

    model = RandomForestClassifier(
        n_estimators=160,
        max_depth=8,
        min_samples_leaf=8,
        random_state=42,
    )
    model.fit(x_train_scaled, y_train)

    predictions = model.predict(x_test_scaled)
    report = classification_report(
        y_test,
        predictions,
        target_names=["low", "medium", "high"],
        output_dict=True,
        zero_division=0,
    )

    joblib.dump(model, MODEL_DIR / "risk_classifier.joblib")
    joblib.dump(scaler, MODEL_DIR / "risk_scaler.joblib")

    summary = {
        "source": "CDC NHANES 2017-2018 official public dataset",
        "files": list(DATA_FILES.values()),
        "row_count": int(len(dataset)),
        "class_distribution": {
            label: int((dataset["risk_label"] == label).sum()) for label in ["low", "medium", "high"]
        },
        "feature_columns": FEATURE_COLUMNS,
        "processed_csv": str(processed_csv),
        "model_output": str(MODEL_DIR / "risk_classifier.joblib"),
        "scaler_output": str(MODEL_DIR / "risk_scaler.joblib"),
        "metrics": {
            "accuracy": round(float(report["accuracy"]), 4),
            "macro_f1": round(float(report["macro avg"]["f1-score"]), 4),
            "weighted_f1": round(float(report["weighted avg"]["f1-score"]), 4),
        },
    }

    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
