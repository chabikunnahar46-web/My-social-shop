 import { db } from "./firebase.js";
import {
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

let userCountry = "Unknown";

// Country finder
fetch("https://ipapi.co/json/")
  .then(res => res.json())
  .then(data => userCountry = data.country_name);

// Send message
export async function sendMessage() {
    const name = document.getElementById("username").value;
    const msg = document.getElementById("message").value;

    if (!name || !msg) {
        alert("নাম ও মেসেজ দিন!");
        return;
    }

    await addDoc(collection(db, "globalChatRoom"), {
        name: name,
        message: msg,
        country: userCountry,
        time: Date.now()
    });

    document.getElementById("message").value = "";
}

// Load messages realtime
const q = query(collection(db, "globalChatRoom"), orderBy("time"));

onSnapshot(q, (snapshot) => {
    const chat = document.getElementById("chatBox");
    chat.innerHTML = "";

    snapshot.forEach(doc => {
        const d = doc.data();
        chat.innerHTML += `
            <div class="message">
                <b>${d.name}</b>: ${d.message}
                <div class="country">🌍 ${d.country}</div>
            </div>
        `;
    });

    chat.scrollTop = chat.scrollHeight;
});

// Button click event
window.sendMessage = sendMessage;
