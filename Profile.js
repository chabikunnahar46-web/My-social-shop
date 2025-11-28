// Load Friends From Firebase Firestore
const db = firebase.firestore();

const friendList = document.getElementById("friend-list");

db.collection("users").get().then(snapshot => {
    snapshot.forEach(doc => {
        const user = doc.data();

        const box = document.createElement("div");
        box.className = "friend-box";

        box.innerHTML = `
            <img src="${user.photo || 'default.png'}">
            <div class="friend-info">
                <div class="friend-name">${user.name}</div>
                <button class="add-btn">Add Friend</button>
                <button class="msg-btn">Message</button>
            </div>
        `;

        friendList.appendChild(box);
    });
});
