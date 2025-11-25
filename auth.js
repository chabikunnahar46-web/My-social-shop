import { auth, rtdb } from "./Firebase.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

document.getElementById("signupBtn").addEventListener("click", async () => {
    let email = document.getElementById("email").value;
    let pass  = document.getElementById("password").value;
