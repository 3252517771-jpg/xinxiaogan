# Raw Datasets

## S1 risk model dataset

S1 now uses a real public dataset for training.

- Source: CDC NHANES 2017-2018 official public files
- Base URL: `https://wwwn.cdc.gov/Nchs/Data/Nhanes/Public/2017/DataFiles/`
- Downloaded by: `backend/ml_models/train.py`

### Files used

| File | Purpose | Key fields |
|------|---------|------------|
| `BPX_J.XPT` | blood pressure and pulse | `BPXSY1-3`, `BPXDI1-3`, `BPXPLS` |
| `BMX_J.XPT` | body measures | `BMXWAIST` |
| `GLU_J.XPT` | fasting glucose | `LBXGLU` |
| `TCHOL_J.XPT` | total cholesterol | `LBXTC` |
| `MCQ_J.XPT` | cardiovascular diagnosis labels | `MCQ160C`, `MCQ160E`, `MCQ160F` |

### App feature mapping

| App feature | NHANES field | Notes |
|-------------|--------------|-------|
| `systolic_bp` | avg(`BPXSY1`, `BPXSY2`, `BPXSY3`) | mmHg |
| `diastolic_bp` | avg(`BPXDI1`, `BPXDI2`, `BPXDI3`) | mmHg |
| `heart_rate` | `BPXPLS` | bpm |
| `blood_glucose` | `LBXGLU / 18.0` | converted from mg/dL to mmol/L |
| `waist_cm` | `BMXWAIST` | cm |
| `cholesterol` | `LBXTC / 38.67` | converted from mg/dL to mmol/L |

### Label generation

NHANES does not ship a native three-class risk target for this exact feature set, so S1 derives labels in a reproducible way:

- `high`: self-reported coronary heart disease, heart attack, or stroke in `MCQ160C/E/F`, or multiple biomarker thresholds in the high-risk range
- `medium`: no diagnosis, but one or more biomarkers in the warning range
- `low`: no diagnosis and biomarkers mostly in the normal range

This keeps the dataset public, reproducible, and aligned with the app's six input fields.
