// =========================
// Firebase Config & Setup
// =========================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getDatabase, 
    ref, 
    push, 
    onValue 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyA33of57qBOpIUioKDQ7dMx0KZR6OXLECY",
    authDomain: "bondhotto-24.firebaseapp.com",
    databaseURL: "https://bondhotto-24-default-rtdb.firebaseio.com",
    projectId: "bondhotto-24",
    storageBucket: "bondhotto-24.firebasestorage.app",
    messagingSenderId: "585952718894",
    appId: "1:585952718894:web:1d9b2e9f12f617a2f2afbf",
    measurementId: "G-KJQSLPY9NQ"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
