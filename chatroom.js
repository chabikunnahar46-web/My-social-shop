// === দেশ বের করা ===
async function getCountry() {
    try {
        let res = await fetch("https://ipapi.co/json/");
        let data = await res.json();
        return data.country_name;
    } catch {
        return "Unknown";
    }
}

let userCountry = "";
getCountry().then(c => userCountry = c);

// === মেসেজ পাঠানো ===
function sendMessage() {
    const name = document.getElementById("username").value;
    const msg = document.getElementById("message").value;

    if (!name || !msg) return alert("নাম ও মেসেজ দিন!");

    db.collection("globalChatRoom").add({
        name: name,
        message: msg,
        country: userCountry,
        time: Date.now(),
    });

    document.getElementById("message").value = "";
}

// === রিয়েলটাইমে মেসেজ লোড ===
db.collection("globalChatRoom")
  .orderBy("time")
  .onSnapshot(snapshot => {
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
