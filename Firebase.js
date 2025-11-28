// =============================
// Correct Firebase Setup for Bondhotto24
// =============================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// Your Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyA33of57qBOpIUioKDQ7dMx0KZR6OXLECY",
    authDomain: "bondhotto-24.firebaseapp.com",
    projectId: "bondhotto-24",
    storageBucket: "bondhotto-24.appspot.com",
    messagingSenderId: "585952718894",
    appId: "1:585952718894:web:1d9b2e9f12f617a2f2afbf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Proper Services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

console.log("🔥 Firebase Connected Successfully!");
