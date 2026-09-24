"""MediaPipe landmark EAR/MAR helpers and stateful drowsiness timing."""

from __future__ import annotations

import math
import time


def point_distance(a, b) -> float:
    return math.hypot(a.x - b.x, a.y - b.y)


def eye_aspect_ratio(points: list[object]) -> float:
    horizontal = 2 * point_distance(points[0], points[3])
    return 0.0 if horizontal == 0 else (point_distance(points[1], points[5]) + point_distance(points[2], points[4])) / horizontal


class DrowsinessDetector:
    def __init__(self, ear_threshold: float = 0.2, closed_seconds: float = 1.5):
        self.ear_threshold = ear_threshold
        self.closed_seconds = closed_seconds
        self.closed_since: float | None = None

    def update(self, ear: float, yawning: bool = False, now: float | None = None) -> dict[str, object]:
        now = now or time.monotonic()
        if ear < self.ear_threshold:
            self.closed_since = self.closed_since or now
        else:
            self.closed_since = None
        closed_too_long = self.closed_since is not None and now - self.closed_since >= self.closed_seconds
        return {"detected": closed_too_long or yawning, "ear_score": round(ear, 3)}
