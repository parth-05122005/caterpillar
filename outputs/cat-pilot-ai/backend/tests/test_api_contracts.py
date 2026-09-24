import unittest

from backend.model_store import (
    unusual_behavior_record,
    task_time_record,
)
from backend.rag.voice_query import ManualRetriever


class ApiContractTests(unittest.TestCase):
    def test_task_time_record_uses_training_column_names(self):
        record = task_time_record(
            task_type="Trenching",
            weather="Cloudy",
            operator_skill="Intermediate",
            machine_age_yrs=5,
            estimated_time_min=48.6,
        )
        self.assertEqual(
            record,
            {
                "Task_Type": "Trenching",
                "Weather": "Cloudy",
                "Operator_Skill": "Intermediate",
                "Machine_Age_yrs": 5,
                "Estimated_Time_min": 48.6,
            },
        )

    def test_unusual_record_normalizes_binary_sensor_values(self):
        record = unusual_behavior_record(1877.8, 6.52, 12, 22.6, "fastened", False)
        self.assertEqual(record["Seatbelt_Status"], "Fastened")
        self.assertEqual(record["Proximity_Hazard"], "No")

    def test_manual_retriever_returns_ranked_matching_chunk(self):
        retriever = ManualRetriever(
            [
                "Check hydraulic oil only when the machine is parked and cool.",
                "Always fasten the seat belt before starting the engine.",
            ]
        )
        matches = retriever.search("When should I check hydraulic oil?", limit=1)
        self.assertEqual(len(matches), 1)
        self.assertIn("hydraulic oil", matches[0].lower())


if __name__ == "__main__":
    unittest.main()
