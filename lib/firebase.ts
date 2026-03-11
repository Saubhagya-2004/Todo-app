


import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
  apiKey: 'AIzaSyDdc9U4kRDN3B_YxEuX8FFYESIiv1QW2M8',
  authDomain: 'to-do-app-c2bc4.firebaseapp.com',
  projectId: 'to-do-app-c2bc4',
  storageBucket: 'to-do-app-c2bc4.firebasestorage.app',
  messagingSenderId: '374401620474',
  appId: '1:374401620474:web:58924d834bc576a837ec43',
  measurementId: 'G-4LX2GHPE21',
};


const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();


export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});


export const db = getFirestore(app);

export default app;
