"""Deterministic safety rule layer shared by the API and replay process."""

from __future__ import annotations


def evaluate_safety(
    seatbelt_status: str,
    phone_detected: bool,
    drowsy: bool,
    proximity_hazard: bool,
) -> dict[str, str] | None:
    """Return the highest-priority active alert, or ``None`` when safe."""
    if proximity_hazard:
        return {
            "type": "proximity",
            "severity": "critical",
            "message": "WORKER IN REAR DANGER ZONE",
        }
    if drowsy:
        return {
            "type": "drowsiness",
            "severity": "critical",
            "message": "DROWSINESS DETECTED — STOP SAFELY",
        }
    if phone_detected:
        return {
            "type": "phone_usage",
            "severity": "warning",
            "message": "PHONE USE DETECTED",
        }
    if seatbelt_status.strip().lower() != "fastened":
        return {
            "type": "seatbelt",
            "severity": "warning",
            "message": "FASTEN SEATBELT",
        }
    return None
