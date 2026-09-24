"""Centralized Firebase Admin initialization with explicit opt-in."""

from __future__ import annotations

import os
from functools import lru_cache


@lru_cache(maxsize=1)
def get_database_root():
    credentials_path = os.getenv("FIREBASE_CREDENTIALS")
    database_url = os.getenv("FIREBASE_DATABASE_URL")
    if not credentials_path or not database_url:
        return None
    try:
        import firebase_admin
        from firebase_admin import credentials, db
    except ImportError as exc:
        raise RuntimeError("firebase-admin is required for live replay mode") from exc
    if not firebase_admin._apps:
        firebase_admin.initialize_app(credentials.Certificate(credentials_path), {"databaseURL": database_url})
    return db.reference("/")


def update_path(path: str, value: object) -> None:
    root = get_database_root()
    if root is None:
        return
    root.child(path).set(value)
