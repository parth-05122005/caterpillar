"""Replay telemetry and optional video on independent clocks."""

from __future__ import annotations

import argparse
import csv
import json
import threading
import time
from pathlib import Path

from backend.firebase_admin_init import update_path
from backend.vision.orchestrator import evaluate_safety


def normalize_telemetry(row: dict[str, str]) -> dict[str, object]:
    return {
        "timestamp": row["Timestamp"],
        "engine_hours": float(row["Engine_Hours"]),
        "fuel_used_L": float(row["Fuel_Used_L"]),
        "load_cycles": int(row["Load_Cycles"]),
        "idling_time_min": float(row["Idling_Time_min"]),
        "seatbelt_status": row["Seatbelt_Status"],
        "hydraulic_temp_c": 74,
        "engine_rpm": 1760,
        "pressure_bar": 281,
    }


def telemetry_loop(csv_path: Path, interval: float, once: bool = False) -> None:
    with csv_path.open(newline="", encoding="utf-8-sig") as handle:
        rows = list(csv.DictReader(handle))
    if not rows:
        raise ValueError(f"No telemetry rows found in {csv_path}")
    index = 0
    while True:
        row = rows[index % len(rows)]
        telemetry = normalize_telemetry(row)
        proximity = row["Proximity_Hazard"].strip().lower() == "yes"
        alert = evaluate_safety(row["Seatbelt_Status"], False, False, proximity)
        safety = {
            "seatbelt": {"status": row["Seatbelt_Status"].lower(), "confidence": 1},
            "phone_usage": {"detected": False, "confidence": 0},
            "drowsiness": {"detected": False, "ear_score": .29},
            "proximity": {"hazard": proximity, "zone": "rear"},
            "active_alert": alert,
        }
        update_path("telemetry", telemetry)
        update_path("safety", safety)
        print(json.dumps({"telemetry": telemetry, "alert": alert}))
        if once: return
        index += 1
        time.sleep(interval)


def video_loop(video_path: Path, once: bool = False) -> None:
    if not video_path.exists():
        print(f"Video disabled: {video_path} not found")
        return
    try:
        import cv2
    except ImportError:
        print("Video disabled: install opencv-python")
        return
    cap = cv2.VideoCapture(str(video_path))
    fps = cap.get(cv2.CAP_PROP_FPS) or 30
    while True:
        ok, _frame = cap.read()
        if not ok:
            cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
            continue
        if once: break
        time.sleep(1 / fps)
    cap.release()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--telemetry", type=Path, default=Path("data/cat_operator_dataset_3000.csv"))
    parser.add_argument("--video", type=Path, default=Path("simulation_rig/assets/cab_camera_veo.mp4"))
    parser.add_argument("--interval", type=float, default=3)
    parser.add_argument("--once", action="store_true", help="Process one telemetry row and exit")
    args = parser.parse_args()
    if args.once:
        telemetry_loop(args.telemetry, args.interval, once=True)
    else:
        threading.Thread(target=video_loop, args=(args.video,), daemon=True).start()
        threading.Thread(target=telemetry_loop, args=(args.telemetry, args.interval), daemon=True).start()
        while True: time.sleep(1)
