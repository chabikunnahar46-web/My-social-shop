// =============================
// Firebase Setup (Correct)
// =============================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyA33of57qBOpIUioKDQ7dMx0KZR6OXLECY",
    authDomain: "bondhotto-24.firebaseapp.com",
    databaseURL: "https://bondhotto-24-default-rtdb.firebaseio.com",
    projectId: "bondhotto-24",
    storageBucket: "bondhotto-24.firebasestorage.app",
    messagingSenderId: "585952718894",
    appId: "1:585952718894:web:1d9b2e9f12f617a2f2afbf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const db = getDatabase(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

console.log("🔥 Firebase Connected Successfully");
