// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAcNV_dCwZF-rgzqhFIyy4qiyBxmK3HjrY",
  authDomain: "adhaya-trust.firebaseapp.com",
  projectId: "adhaya-trust",
  storageBucket: "adhaya-trust.appspot.com",
  messagingSenderId: "215585085681",
  appId: "1:215585085681:web:3ed90eb6ed0b6abd52f150",
  measurementId: "G-G6DP93LZVR"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { app, db, analytics };
