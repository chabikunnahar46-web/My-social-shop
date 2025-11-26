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
