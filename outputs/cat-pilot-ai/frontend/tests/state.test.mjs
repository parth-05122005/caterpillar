import test from 'node:test';
import assert from 'node:assert/strict';

import { getAlertTone, mergeLiveState } from '../src/lib/state.js';

test('critical alert tone overrides nominal state', () => {
  assert.equal(getAlertTone({ severity: 'critical' }), 'critical');
});

test('missing live branches retain complete demo state', () => {
  const base = {
    dashboard: { machine_id: 'CAT 349', eco_score: 92 },
    telemetry: { engine_rpm: 1750 },
    safety: { active_alert: null },
  };
  const merged = mergeLiveState(base, { telemetry: { engine_rpm: 1810 } });
  assert.equal(merged.dashboard.machine_id, 'CAT 349');
  assert.equal(merged.dashboard.eco_score, 92);
  assert.equal(merged.telemetry.engine_rpm, 1810);
  assert.equal(merged.safety.active_alert, null);
});

test('nested Firebase updates do not erase sibling safety values', () => {
  const base = {
    safety: {
      seatbelt: { status: 'fastened' },
      phone_usage: { detected: false },
    },
  };
  const merged = mergeLiveState(base, {
    safety: { phone_usage: { detected: true, confidence: 0.91 } },
  });
  assert.equal(merged.safety.seatbelt.status, 'fastened');
  assert.equal(merged.safety.phone_usage.detected, true);
});
