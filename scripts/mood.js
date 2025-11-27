// ===============================
// Mood Based Smart Feed System
// ===============================

// Try to load Firebase safely
let db = null;

try {
    // Firebase auto-import (works only if firebase.js loaded)
    import { db as firestoreDB } from "../Firebase.js";
    db = firestoreDB;
} catch (e) {
    console.warn("Firebase not found. Running in demo mode.");
}

// ======================================
// DEMO POSTS (Firebase না থাকলে এটা চলবে)
// ======================================
const demoPosts = [
    {
        mood: "happy",
        text: "আজ দিনটা খুব সুন্দর লাগছে 😊",
        img: "https://i.ibb.co/YQLPx0z/happy.jpg"
    },
    {
        mood: "sad",
        text: "আজ মনটা খারাপ… 😔",
        img: "https://i.ibb.co/f1ZL6CZ/sad.jpg"
    },
    {
        mood: "angry",
        text: "আজ রাগ লাগছে 😡",
        img: "https://i.ibb.co/Tg2JXY6/angry.jpg"
    }
];

// =========================================
// Mood Load Function
// =========================================
async function loadMoodPosts(selectedMood = "all") {
    const feedBox = document.querySelector("#feedBox");

    // Clear feed
    feedBox.innerHTML = `<p style="padding:10px;">Loading...</p>`;

    // Firebase না থাকলে demo mode
    if (!db) {
        showDemoPosts(selectedMood);
        return;
    }

    try {
        const q = query(
            collection(db, "posts"),
            selectedMood === "all"
                ? where("mood", "!=", "")
                : where("mood", "==", selectedMood)
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            feedBox.innerHTML = `<p>No posts found.</p>`;
            return;
        }

        feedBox.innerHTML = "";

        snapshot.forEach(doc => {
            const data = doc.data();
            feedBox.innerHTML += makePostHTML(data.text, data.img);
        });

    } catch (error) {
        feedBox.innerHTML = `<p>Error loading posts.</p>`;
        console.error(error);
    }
}

// =========================================
// Demo Mode Post Loader
// =========================================
function showDemoPosts(mood) {
    const feedBox = document.querySelector("#feedBox");
    feedBox.innerHTML = "";

    demoPosts
        .filter(p => mood === "all" || p.mood === mood)
        .forEach(p => {
            feedBox.innerHTML += makePostHTML(p.text, p.img);
        });
}

// =========================================
// Generate Post HTML
// =========================================
function makePostHTML(text, img) {
    return `
        <div class="post">
            <p>${text}</p>
            <img src="${img}" alt="post image" class="post-img">
        </div>
    `;
}

// =========================================
// Mood Buttons Click
// =========================================
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".mood-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const mood = btn.getAttribute("data-mood");
            loadMoodPosts(mood);
        });
    });

    // প্রথমে সব পোস্ট দেখাও
    loadMoodPosts("all");
});
// mood.js

const feedData = [
  {
    type: "product",
    title: "Gaming Headset",
    description: "High-quality surround sound headset.",
    price: 49.99,
    mood: "happy"
  },
  {
    type: "video",
    title: "Motivational Video",
    src: "videos/motivation.mp4",
    mood: "motivation"
  },
  {
    type: "image",
    title: "Beautiful Sunset",
    src: "images/sunset.jpg",
    mood: "love"
  },
  {
    type: "product",
    title: "Smart Watch",
    description: "Track your health and notifications.",
    price: 99.99,
    mood: "funny"
  }
];

const feedContainer = document.getElementById("feed");
const moodSelect = document.getElementById("moodSelect");
const applyBtn = document.getElementById("applyMood");
const searchInput = document.getElementById("searchInput");

function renderFeed(items) {
  feedContainer.innerHTML = "";
  items.forEach(item => {
    const div = document.createElement("div");
    div.className = "feed-item";

    if(item.type === "product") {
      div.innerHTML = `
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <p>Price: $${item.price}</p>
        <div class="actions">
          <button class="like">❤️ Like</button>
          <button class="comment">💬 Comment</button>
          <button class="buy">🛒 Buy</button>
          <button class="share">🔁 Share</button>
        </div>
      `;
    }
    else if(item.type === "video") {
      div.innerHTML = `
        <h3>${item.title}</h3>
        <video controls>
          <source src="${item.src}" type="video/mp4">
          Your browser does not support the video tag.
        </video>
        <div class="actions">
          <button class="like">❤️ Like</button>
          <button class="comment">💬 Comment</button>
          <button class="share">🔁 Share</button>
        </div>
      `;
    }
    else if(item.type === "image") {
      div.innerHTML = `
        <h3>${item.title}</h3>
        <img src="${item.src}" alt="${item.title}">
        <div class="actions">
          <button class="like">❤️ Like</button>
          <button class="comment">💬 Comment</button>
          <button class="share">🔁 Share</button>
        </div>
      `;
    }

    feedContainer.appendChild(div);
  });
}

// Initial render
renderFeed(feedData);

// Mood filter
applyBtn.addEventListener("click", () => {
  const mood = moodSelect.value;
  const filtered = mood === "all" ? feedData : feedData.filter(item => item.mood === mood);
  renderFeed(filtered);
});

// Search filter
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const filtered = feedData.filter(item => item.title.toLowerCase().includes(query));
  renderFeed(filtered);
});
