// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: "AIzaSyBsB_Y_aNM0BtgDUI1uXc15SGKFj0EFUuE",
  authDomain: "aaradhya-e6be8.firebaseapp.com",
  projectId: "aaradhya-e6be8",
  storageBucket: "aaradhya-e6be8.firebasestorage.app",
  messagingSenderId: "18655221378",
  appId: "1:18655221378:web:7c6798360fc49d17dc869b",
  measurementId: "G-G2V3587P7M"

};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { app, db, analytics };
