 import { db } from "./Firebase.js";
import { ref, push, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Send Button Event
document.getElementById("send").addEventListener("click", () => {
    const name = document.getElementById("username").value.trim();
    const message = document.getElementById("message").value.trim();

    if(name === "" || message === "") {
        alert("Please enter name and message!");
        return;
    }

    const postsRef = ref(db, "Posts");
    const newPostRef = push(postsRef);
    set(newPostRef, {
        name: name,
        text: message,
        timestamp: Date.now()
    }).then(() => {
        console.log("✅ Post sent:", message);
        document.getElementById("username").value = "";
        document.getElementById("message").value = "";
    }).catch((err) => {
        console.error("❌ Error sending post:", err);
    });
});
