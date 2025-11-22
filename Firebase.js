 // Firebase CDN import
import { initializeApp } 
    from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";

import { getAuth } 
    from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

import { getFirestore } 
    from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA33of57qBOpIUioKDQ7dMx0KZR6OXLECY",
  authDomain: "bondhotto-24.firebaseapp.com",
  projectId: "bondhotto-24",
  storageBucket: "bondhotto-24.firebasestorage.app",
  messagingSenderId: "585952718894",
  appId: "1:585952718894:web:1d9b2e9f12f617a2f2afbf",
  measurementId: "G-KJQSLPY9NQ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Auth + Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
