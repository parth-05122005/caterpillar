"""Small dependency-free retrieval fallback for the voice assistant."""

from __future__ import annotations

import math
import re
from collections import Counter
from pathlib import Path

TOKEN_RE = re.compile(r"[a-z0-9]+")
DEFAULT_CHUNKS = [
    "Fasten the seat belt before starting the engine or moving the machine.",
    "Park on level ground, lower the implement, stop the engine, and allow the hydraulic system to cool before inspection.",
    "Keep all people outside the machine swing radius and rear danger zone while operating.",
    "If a critical warning appears, stop the machine in a safe location and investigate before continuing.",
]


def _vector(text: str) -> Counter[str]:
    return Counter(TOKEN_RE.findall(text.lower()))


def _cosine(left: Counter[str], right: Counter[str]) -> float:
    dot = sum(value * right.get(key, 0) for key, value in left.items())
    if not dot:
        return 0.0
    lnorm = math.sqrt(sum(value * value for value in left.values()))
    rnorm = math.sqrt(sum(value * value for value in right.values()))
    return dot / (lnorm * rnorm)


class ManualRetriever:
    def __init__(self, chunks: list[str] | None = None):
        self.chunks = chunks or DEFAULT_CHUNKS
        self.vectors = [_vector(chunk) for chunk in self.chunks]

    @classmethod
    def from_json(cls, path: Path) -> "ManualRetriever":
        import json

        if not path.exists():
            return cls()
        data = json.loads(path.read_text(encoding="utf-8"))
        return cls([str(item["text"] if isinstance(item, dict) else item) for item in data])

    def search(self, question: str, limit: int = 4) -> list[str]:
        query = _vector(question)
        ranked = sorted(
            zip(self.chunks, self.vectors),
            key=lambda item: _cosine(query, item[1]),
            reverse=True,
        )
        return [chunk for chunk, vec in ranked[:limit] if _cosine(query, vec) > 0]

    def answer(self, question: str) -> dict[str, object]:
        matches = self.search(question)
        if not matches:
            return {
                "answer": "I couldn't find that in the loaded operator guidance.",
                "sources": [],
            }
        return {
            "answer": matches[0],
            "sources": matches,
        }
