// Login.js
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth } from "./Firebase.js"; // তোমার Firebase.js import

async function loginUser() {
    const email = document.getElementById("emailInput").value;
    const password = document.getElementById("passwordInput").value;

    if (!email || !password) {
        alert("Please enter email and password!");
        return;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        alert("Welcome " + userCredential.user.email);
        // এখানে তোমার রিডাইরেক্ট বা page load logic দিতে পারো
        window.location.href = "Post.html"; // উদাহরণ
    } catch (err) {
        alert("Login Failed: " + err.message);
    }
}let accounts = JSON.parse(localStorage.getItem("savedAccounts")) || [];
accounts.push({
    name: userName,
    email: email,
    photo: userPhotoURL
});
localStorage.setItem("savedAccounts", JSON.stringify(accounts));
