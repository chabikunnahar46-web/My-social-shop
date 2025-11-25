import { db } from "./Firebase.js";
import { ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// =========================
// Add Post
// =========================
document.getElementById("postBtn").addEventListener("click", () => {
  const text = document.getElementById("postText").value;

  if (text.trim() === "")
    return alert("Write something!");

  push(ref(db, "posts"), {
    text: text,
    time: Date.now()
  });

  document.getElementById("postText").value = "";
});


// =========================
// Load Posts
// =========================
const postBox = document.getElementById("postBox");

onValue(ref(db, "posts"), snapshot => {
  postBox.innerHTML = "";

  snapshot.forEach(child => {
    const post = child.val();

    postBox.innerHTML =
      `<div class="post">
          <p>${post.text}</p>
          <button>❤️ রিয়াক্ট</button>
          <button>💬 মন্তব্য</button>
          <button>🔁 শেয়ার</button>
       </div>` + postBox.innerHTML;
  });
});


// =========================
// Add Shop Item
// =========================
document.getElementById("shopBtn").addEventListener("click", () => {
  const item = document.getElementById("itemName").value;
  const price = document.getElementById("itemPrice").value;

  if (item.trim() === "" || price.trim() === "")
    return alert("Enter Name & Price");

  push(ref(db, "shop"), {
    name: item,
    price: price
  });

  document.getElementById("itemName").value = "";
  document.getElementById("itemPrice").value = "";
});


// =========================
// Load Shop Items
// =========================
const shopBox = document.getElementById("shopBox");

onValue(ref(db, "shop"), snapshot => {
  shopBox.innerHTML = "";

  snapshot.forEach(child => {
    const item = child.val();

    shopBox.innerHTML += `
      <div class="shop-item">
        <h3>${item.name}</h3>
        <p>Price: ${item.price} TK</p>
      </div>`;
  });
});
