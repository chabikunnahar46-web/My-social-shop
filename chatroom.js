import { db, auth } from "./Firebase.js";
import { ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// Send Message
document.getElementById("sendBtn").addEventListener("click", () => {
    const msg = document.getElementById("msgBox").value.trim();

    if (msg === "") return;

    const user = auth.currentUser;

    push(ref(db, "globalChat"), {
        user: user ? user.uid : "guest",
        message: msg,
        time: Date.now()
    });

    document.getElementById("msgBox").value = "";
});

// Read Messages
onChildAdded(ref(db, "globalChat"), (snapshot) => {
    const data = snapshot.val();
    const box = document.getElementById("chatBox");

    const p = document.createElement("p");
    p.innerHTML = `<b>${data.user}</b>: ${data.message}`;
    box.appendChild(p);
});
