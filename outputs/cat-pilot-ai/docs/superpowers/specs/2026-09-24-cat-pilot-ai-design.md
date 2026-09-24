# CAT Pilot AI Design

CAT Pilot AI is a local-first hackathon demo for heavy-equipment operators. It combines a glanceable five-tab cab dashboard, two models trained from the supplied synthetic CSVs, a safety rule layer, a Firebase-compatible replay process, and a grounded manual assistant.

## Product surface

The React dashboard is a single page with Tasks, Safety, Machine, Training, and Incidents panels. A persistent machine header, critical alert rail, bottom navigation, voice control, and confirmed SOS action remain available across tabs. Controls use at least 56 px touch targets, high contrast, and short operator-facing labels.

## Runtime design

- The frontend reads one normalized live state through a data service. It uses realistic demo data by default and Firebase Realtime Database when environment variables are present.
- FastAPI exposes health, task-time, unusual-behavior, and voice-query endpoints. Model artifacts are loaded once and fail with explicit setup messages when absent.
- Training scripts read the two supplied CSVs, validate required columns, fit scikit-learn pipelines, print honest holdout metrics, and save versioned joblib artifacts.
- The replay process runs video and telemetry on independent threads. Optional integrations are lazy imports so the rest of the demo still runs without camera, Firebase, or model packages.
- Safety severity is deterministic: drowsiness and proximity hazards are critical; phone use and an unfastened belt are warnings.

## Demo resilience

No credentials are committed. `.env.example` documents configuration. The interface visibly labels simulation mode. Missing video, manual, model artifacts, or Firebase configuration produces a usable fallback or a direct error rather than a silent failure.

## Verification

Backend domain behavior is covered with Python standard-library tests. Frontend state derivation is covered with Node's standard test runner. Final verification includes both suites, a production frontend build, CSV validation, and model-training execution when scikit-learn is available.
