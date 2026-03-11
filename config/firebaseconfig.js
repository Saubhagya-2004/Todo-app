// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDdc9U4kRDN3B_YxEuX8FFYESIiv1QW2M8",
  authDomain: "to-do-app-c2bc4.firebaseapp.com",
  projectId: "to-do-app-c2bc4",
  storageBucket: "to-do-app-c2bc4.firebasestorage.app",
  messagingSenderId: "374401620474",
  appId: "1:374401620474:web:58924d834bc576a837ec43",
  measurementId: "G-4LX2GHPE21"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);