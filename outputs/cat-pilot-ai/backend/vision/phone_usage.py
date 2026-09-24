"""Pretrained COCO phone detection, loaded only when vision mode starts."""

from __future__ import annotations


class PhoneDetector:
    def __init__(self, weights: str = "yolov8n.pt"):
        try:
            from ultralytics import YOLO
        except ImportError as exc:
            raise RuntimeError("Install ultralytics to enable phone detection") from exc
        self.model = YOLO(weights)

    def detect(self, frame, driver_region: tuple[int, int, int, int] | None = None) -> dict[str, object]:
        result = self.model(frame, verbose=False)[0]
        best = 0.0
        for box in result.boxes:
            if int(box.cls[0]) == 67:
                best = max(best, float(box.conf[0]))
        return {"detected": best >= 0.35, "confidence": round(best, 3)}
