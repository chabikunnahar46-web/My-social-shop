// Firebase.js

// Import Firebase Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs 
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

import { 
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js";

import {
    getDatabase,
    ref as dbRef,
    set,
    get,
    child
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";


// ---------- YOUR FIREBASE CONFIG (Correct + Safe) ----------
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
// ------------------------------------------------------------


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Setup Services
const db = getFirestore(app);
const realtimeDB = getDatabase(app);
const auth = getAuth(app);
const storage = getStorage(app);


// Export everything for other files
export {
    db,
    auth,
    storage,
    realtimeDB,
    collection,
    addDoc,
    getDocs,
    ref,
    uploadBytes,
    getDownloadURL,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    dbRef,
    set,
    get,
    child
};
