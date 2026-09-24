import unittest

from backend.vision.orchestrator import evaluate_safety


class SafetyOrchestratorTests(unittest.TestCase):
    def test_proximity_hazard_wins_over_warning_conditions(self):
        result = evaluate_safety(
            seatbelt_status="Unfastened",
            phone_detected=True,
            drowsy=False,
            proximity_hazard=True,
        )
        self.assertEqual(result["severity"], "critical")
        self.assertEqual(result["type"], "proximity")

    def test_drowsiness_is_critical(self):
        result = evaluate_safety("Fastened", False, True, False)
        self.assertEqual(
            result,
            {
                "type": "drowsiness",
                "severity": "critical",
                "message": "DROWSINESS DETECTED — STOP SAFELY",
            },
        )

    def test_unfastened_seatbelt_is_warning(self):
        result = evaluate_safety("Unfastened", False, False, False)
        self.assertEqual(result["severity"], "warning")
        self.assertEqual(result["type"], "seatbelt")

    def test_safe_inputs_have_no_alert(self):
        self.assertIsNone(evaluate_safety("Fastened", False, False, False))


if __name__ == "__main__":
    unittest.main()
