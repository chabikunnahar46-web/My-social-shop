// main.js
import { db } from "./Firebase.js";
import { ref as dbRef, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const feedBox = document.getElementById("feed"); // তোমার index.html এ <div id="feed"></div> থাকতে হবে

function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleString();
}

onValue(dbRef(db, "feed"), snapshot => {
  feedBox.innerHTML = "";
  const items = [];
  snapshot.forEach(child => {
    items.push({ key: child.key, ...child.val() });
  });

  // sort by time desc (recent first)
  items.sort((a,b) => (b.time || 0) - (a.time || 0));

  items.forEach(item => {
    const post = document.createElement("div");
    post.className = "post";
    post.style = "background:#fff;padding:10px;margin:12px;border-radius:10px;box-shadow:0 1px 3px rgba(0,0,0,0.1);";

    post.innerHTML = `
      <div style="font-weight:600;margin-bottom:8px;">${item.uid || 'User'}</div>
      <img src="${item.image}" style="width:100%;border-radius:8px;max-height:500px;object-fit:cover;">
      <p style="margin:8px 0;">${item.caption || ''}</p>
      <small style="color:#666">${formatTime(item.time)}</small>
    `;
    feedBox.appendChild(post);
  });
});
