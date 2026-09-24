import { mergeLiveState } from './lib/state.js';

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const firebaseEnabled = Boolean(config.apiKey && config.databaseURL);

export async function subscribeToLiveState(initialState, onState) {
  if (!firebaseEnabled) return () => {};
  const [{ initializeApp }, { getDatabase, onValue, ref }] = await Promise.all([
    import('firebase/app'),
    import('firebase/database'),
  ]);
  const db = getDatabase(initializeApp(config));
  let current = initialState;
  const unsubs = ['dashboard', 'telemetry', 'safety', 'unusual_behavior', 'incidents'].map((path) =>
    onValue(ref(db, path), (snapshot) => {
      current = mergeLiveState(current, { [path]: snapshot.val() || current[path] });
      onState(current);
    }),
  );
  return () => unsubs.forEach((unsubscribe) => unsubscribe());
}

export async function writeSosIncident(payload) {
  if (!firebaseEnabled) return { id: `DEMO-${Date.now()}`, ...payload };
  const [{ initializeApp, getApps }, { getDatabase, push, ref, set }] = await Promise.all([
    import('firebase/app'),
    import('firebase/database'),
  ]);
  const app = getApps()[0] || initializeApp(config);
  const incident = push(ref(getDatabase(app), 'incidents'));
  await set(incident, payload);
  return { id: incident.key, ...payload };
}
