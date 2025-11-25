// Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut,
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import { 
    getStorage, 
    ref, 
    uploadBytes, 
    getDownloadURL 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

// Firebase Config
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

// Initialize
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const storage = getStorage(app);


// 🔹 Signup Function
window.signup = function () {
    const email = document.getElementById("signupEmail").value;
    const pass = document.getElementById("signupPass").value;

    createUserWithEmailAndPassword(auth, email, pass)
        .then(() => alert("Account Created!"))
        .catch(err => alert(err.message));
};


// 🔹 Login Function
window.login = function () {
    const email = document.getElementById("loginEmail").value;
    const pass = document.getElementById("loginPass").value;

    signInWithEmailAndPassword(auth, email, pass)
        .then(() => alert("Logged in!"))
        .catch(err => alert(err.message));
};


// 🔹 Auto Detect User Login
onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById("authSection").style.display = "none";
        document.getElementById("profileSection").style.display = "block";

        document.getElementById("userEmail").innerText = user.email;

        // Load profile picture
        const picRef = ref(storage, "profilePics/" + user.uid);
        getDownloadURL(picRef)
            .then(url => document.getElementById("profilePic").src = url)
            .catch(() => {});
    }
});


// 🔹 Upload Profile Picture
window.uploadProfilePic = function () {
    const file = document.getElementById("uploadPic").files[0];
    if (!file) return alert("Select a picture");

    const user = auth.currentUser;
    const picRef = ref(storage, "profilePics/" + user.uid);

    uploadBytes(picRef, file).then(() => {
        getDownloadURL(picRef).then(url => {
            document.getElementById("profilePic").src = url;
            alert("Profile picture updated!");
        });
    });
};


// 🔹 Logout
window.logout = function () {
    signOut(auth).then(() => {
        location.reload();
    });
};
