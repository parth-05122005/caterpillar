export function getAlertTone(alert) {
  if (!alert) return 'safe';
  return alert.severity === 'critical' ? 'critical' : 'warning';
}

function isObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

export function mergeLiveState(base, update) {
  const result = { ...base };
  for (const [key, value] of Object.entries(update || {})) {
    result[key] = isObject(value) && isObject(base?.[key])
      ? mergeLiveState(base[key], value)
      : value;
  }
  return result;
}
