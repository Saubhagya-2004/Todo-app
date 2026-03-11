// lib/firebase.ts
// Initialize Firebase app with Auth and Firestore services

import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration for the Todo App project
const firebaseConfig = {
  apiKey: 'AIzaSyDdc9U4kRDN3B_YxEuX8FFYESIiv1QW2M8',
  authDomain: 'to-do-app-c2bc4.firebaseapp.com',
  projectId: 'to-do-app-c2bc4',
  storageBucket: 'to-do-app-c2bc4.firebasestorage.app',
  messagingSenderId: '374401620474',
  appId: '1:374401620474:web:58924d834bc576a837ec43',
  measurementId: 'G-4LX2GHPE21',
};

// Prevent re-initialization when hot-reloading
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth with AsyncStorage persistence so users stay logged in
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Initialize Firestore database
export const db = getFirestore(app);

export default app;
