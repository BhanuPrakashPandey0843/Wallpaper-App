import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, Auth, initializeAuth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra ?? {};
const firebaseConfig = {
  apiKey: String(extra.firebaseApiKey ?? ''),
  authDomain: String(extra.firebaseAuthDomain ?? ''),
  projectId: String(extra.firebaseProjectId ?? ''),
  storageBucket: String(extra.firebaseStorageBucket ?? ''),
  messagingSenderId: String(extra.firebaseMessagingSenderId ?? ''),
  appId: String(extra.firebaseAppId ?? ''),
};

const hasValidFirebaseConfig = Object.values(firebaseConfig).every((value) => Boolean(value && value !== 'undefined'));
const app = hasValidFirebaseConfig ? (!getApps().length ? initializeApp(firebaseConfig) : getApp()) : null;

let auth: Auth | null = null;
if (app) {
  try {
    auth = initializeAuth(app);
  } catch {
    auth = getAuth(app);
  }
}

let db: Firestore | null = null;
if (app) {
  db = getFirestore(app);
}

export { app, auth, db };
