"""Train both prototype models from the supplied synthetic datasets."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

TASK_FEATURES = ["Task_Type", "Weather", "Operator_Skill", "Machine_Age_yrs", "Estimated_Time_min"]
UNUSUAL_FEATURES = ["Engine_Hours", "Fuel_Used_L", "Load_Cycles", "Idling_Time_min", "Seatbelt_Status", "Proximity_Hazard"]


def require_columns(frame, columns: list[str], source: Path) -> None:
    missing = [column for column in columns if column not in frame.columns]
    if missing:
        raise ValueError(f"{source.name} is missing required columns: {', '.join(missing)}")


def train(task_csv: Path, operator_csv: Path, output_dir: Path) -> dict[str, float]:
    import joblib
    import pandas as pd
    from sklearn.compose import ColumnTransformer
    from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
    from sklearn.metrics import f1_score, mean_absolute_error, r2_score
    from sklearn.model_selection import train_test_split
    from sklearn.pipeline import Pipeline
    from sklearn.preprocessing import OneHotEncoder

    tasks = pd.read_csv(task_csv)
    operators = pd.read_csv(operator_csv)
    require_columns(tasks, TASK_FEATURES + ["Actual_Time_min"], task_csv)
    require_columns(operators, UNUSUAL_FEATURES + ["Unsafe_Operation"], operator_csv)

    task_prep = ColumnTransformer([("category", OneHotEncoder(handle_unknown="ignore"), TASK_FEATURES[:3])], remainder="passthrough")
    task_model = Pipeline([("prep", task_prep), ("model", RandomForestRegressor(n_estimators=240, random_state=42, min_samples_leaf=2, n_jobs=-1))])
    x_train, x_test, y_train, y_test = train_test_split(tasks[TASK_FEATURES], tasks["Actual_Time_min"], test_size=.2, random_state=42)
    task_model.fit(x_train, y_train)
    task_predictions = task_model.predict(x_test)

    category_features = ["Seatbelt_Status", "Proximity_Hazard"]
    unusual_prep = ColumnTransformer([("category", OneHotEncoder(handle_unknown="ignore"), category_features)], remainder="passthrough")
    unusual_model = Pipeline([("prep", unusual_prep), ("model", RandomForestClassifier(n_estimators=240, random_state=42, class_weight="balanced", min_samples_leaf=2, n_jobs=-1))])
    ux_train, ux_test, uy_train, uy_test = train_test_split(operators[UNUSUAL_FEATURES], operators["Unsafe_Operation"], test_size=.2, random_state=42, stratify=operators["Unsafe_Operation"])
    unusual_model.fit(ux_train, uy_train)
    unusual_predictions = unusual_model.predict(ux_test)

    output_dir.mkdir(parents=True, exist_ok=True)
    joblib.dump(task_model, output_dir / "task_time_model.pkl")
    joblib.dump(unusual_model, output_dir / "unusual_behavior_model.pkl")
    metrics = {
        "task_time_r2": round(float(r2_score(y_test, task_predictions)), 4),
        "task_time_mae_min": round(float(mean_absolute_error(y_test, task_predictions)), 4),
        "unusual_behavior_f1": round(float(f1_score(uy_test, unusual_predictions, pos_label="Yes")), 4),
        "task_rows": int(len(tasks)),
        "operator_rows": int(len(operators)),
    }
    (output_dir / "metrics.json").write_text(json.dumps(metrics, indent=2), encoding="utf-8")
    return metrics


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--task-csv", type=Path, default=Path("data/task_time_dataset_3000.csv"))
    parser.add_argument("--operator-csv", type=Path, default=Path("data/cat_operator_dataset_3000.csv"))
    parser.add_argument("--output-dir", type=Path, default=Path("backend/models"))
    args = parser.parse_args()
    print(json.dumps(train(args.task_csv, args.operator_csv, args.output_dir), indent=2))
