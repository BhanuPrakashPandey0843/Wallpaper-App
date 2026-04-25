import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, Auth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyADSJhSL-mUkh_HsHr6r0InrPxoxMo7QPU',
  authDomain: 'wallpaper-c74a3.firebaseapp.com',
  projectId: 'wallpaper-c74a3',
  storageBucket: 'wallpaper-c74a3.appspot.com',
  messagingSenderId: '704605252889',
  appId: '1:704605252889:web:fd7d4f666da70d2aeda988',
  measurementId: 'G-CL5K9HN0NL',
};

// Prevent duplicate initialization
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Auth with AsyncStorage persistence for React Native
let auth: Auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (error: any) {
  auth = getAuth(app);
}

const db: Firestore = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
