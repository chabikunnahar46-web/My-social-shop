// app.js (module)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import {
  getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp,
  doc, updateDoc, arrayUnion, arrayRemove, where, getDocs
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-storage.js";
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-analytics.js";

/* ---------------- FIREBASE CONFIG - replace measurementId with yours ---------------- */
const firebaseConfig = {
  apiKey: "AIzaSyA33of57qBOpIUioKDQ7dMx0KZR6OXLECY",
  authDomain: "bondhotto-24.firebaseapp.com",
  projectId: "bondhotto-24",
  storageBucket: "bondhotto-24.appspot.com",
  messagingSenderId: "585952718894",
  appId: "1:585952718894:web:1d9b2e9f12f617a2f2afbf",
  measurementId: G-KJQSLPY9NQ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
let analytics;
try { analytics = getAnalytics(app); } catch (e) { console.warn("Analytics not initialized:", e.message); }

/* ----------------- DOM helpers ----------------- */
const $ = id => document.getElementById(id);
const feedEl = () => $("feed");
const profilePostsEl = () => $("profilePosts");
const friendsListEl = () => $("friendsList");
const notificationsEl = () => $("notifications");

/* ----------------- TAB system ----------------- */
function showSection(id) {
  document.querySelectorAll(".page-section").forEach(s => s.style.display = "none");
  const el = $(id);
  if (el) el.style.display = "block";
  // highlight top tabs
  document.querySelectorAll(".tab-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.section === id);
  });
}
document.querySelectorAll("[data-section]").forEach(btn => {
  btn.addEventListener("click", () => showSection(btn.dataset.section));
});
document.querySelectorAll(".bottom-nav [data-section]").forEach(btn=>{
  btn.addEventListener("click", ()=> showSection(btn.dataset.section));
});
// default
showSection("home");

/* ----------------- Auth UI + functions ----------------- */
function renderAuthArea(user) {
  const authArea = $("authArea");
  if (!authArea) return;
  if (user) {
    authArea.innerHTML = `
      <div class="muted">Logged in as <b>${user.email}</b></div>
      <button class="small-btn" id="logoutBtn">Log Out</button>
    `;
    $("logoutBtn")?.addEventListener("click", () => logOut());
  } else {
    authArea.innerHTML = `
      <input id="email" placeholder="Email" style="padding:6px;border:1px solid #e6e6e6;border-radius:6px" />
      <input id="password" type="password" placeholder="Password" style="padding:6px;border:1px solid #e6e6e6;border-radius:6px" />
      <button class="small-btn" id="signupBtn">Sign Up</button>
      <button class="small-btn" id="loginBtn">Log In</button>
    `;
    $("signupBtn")?.addEventListener("click", () => signUp());
    $("loginBtn")?.addEventListener("click", () => logIn());
  }
}

export async function signUp() {
  const email = $("email").value.trim();
  const pass = $("password").value;
  try {
    await createUserWithEmailAndPassword(auth, email, pass);
    alert("Signed up — welcome!");
    if (analytics) logEvent(analytics, "sign_up", { email });
  } catch (e) {
    alert(e.message);
  }
}

export async function logIn() {
  const email = $("email").value.trim();
  const pass = $("password").value;
  try {
    await signInWithEmailAndPassword(auth, email, pass);
    alert("Logged in");
    if (analytics) logEvent(analytics, "login", { email });
  } catch (e) {
    alert(e.message);
  }
}

export async function logOut() {
  await signOut(auth);
  alert("Logged out");
}

/* ----------------- Upload profile / cover ----------------- */
async function uploadFileToStorage(path, file) {
  const sRef = ref(storage, path);
  const task = uploadBytesResumable(sRef, file);
  await new Promise((res, rej) => task.on("state_changed", null, rej, res));
  return await getDownloadURL(sRef);
}

async function saveUserMedia(uid, type, url) {
  await addDoc(collection(db, "user_media"), { uid, type, url, timestamp: serverTimestamp() });
}

async function uploadProfile() {
  const file = $("profileFile").files[0];
  const user = auth.currentUser;
  if (!file || !user) return alert("Select a file and login first");
  const url = await uploadFileToStorage(`users/${user.uid}/profile_${Date.now()}_${file.name}`, file);
  await saveUserMedia(user.uid, "profile", url);
  alert("Profile photo uploaded");
}

async function uploadCover() {
  const file = $("coverFile").files[0];
  const user = auth.currentUser;
  if (!file || !user) return alert("Select a file and login first");
  const url = await uploadFileToStorage(`users/${user.uid}/cover_${Date.now()}_${file.name}`, file);
  await saveUserMedia(user.uid, "cover", url);
  alert("Cover photo uploaded");
}

/* attach upload buttons */
$("uploadProfileBtn")?.addEventListener("click", uploadProfile);
$("uploadCoverBtn")?.addEventListener("click", uploadCover);

/* ----------------- Posts: create, like, comment ----------------- */
async function addPost() {
  const text = $("postText").value.trim();
  const file = $("postFile").files[0];
  const user = auth.currentUser;
  if (!user) return alert("Please login to post");
  if (!text && !file) return alert("Post empty");

  let imageUrl = "";
  if (file) {
    imageUrl = await uploadFileToStorage(`posts/${user.uid}_${Date.now()}_${file.name}`, file);
  }

  await addDoc(collection(db, "posts"), {
    uid: user.uid,
    user: user.email,
    text,
    image: imageUrl,
    likes: [],
    timestamp: serverTimestamp()
  });

  $("postText").value = "";
  $("postFile").value = "";
  if (analytics) logEvent(analytics, "create_post", { uid: user.uid });
}
$("postBtn")?.addEventListener("click", addPost);

async function toggleLike(postId, uid) {
  const pDoc = doc(db, "posts", postId);
  // we use arrayUnion/arrayRemove for likes array
  const postRef = pDoc;
  // fetch current doc then decide
  const q = query(collection(db, "posts"), where("__name__", "==", postId));
  // simpler: just update with arrayUnion - to toggle we need current state which we'd know from UI; but here we'll implement optimistic toggling by checking DOM attribute
  const likeBtn = document.querySelector(`[data-like='${postId}']`);
  const liked = likeBtn?.dataset.liked === "true";
  if (!liked) {
    await updateDoc(postRef, { likes: arrayUnion(uid) });
  } else {
    await updateDoc(postRef, { likes: arrayRemove(uid) });
  }
}

/* ----------------- load feed (real-time) ----------------- */
function escapeHtml(str) {
  if (!str) return "";
  return String(str).replace(/[&<>"']/g, s => ({ "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;" }[s]));
}

function renderPostItem(id, p, currentUid) {
  const container = document.createElement("div");
  container.className = "feed-post card";
  const liked = Array.isArray(p.likes) && p.likes.includes(currentUid);
  const time = p.timestamp && p.timestamp.seconds ? new Date(p.timestamp.seconds * 1000).toLocaleString() : "";
  container.innerHTML = `
    <div class="meta"><div><b>${escapeHtml(p.user || "Anonymous")}</b><div class="muted">${time}</div></div></div>
    <div class="content">${escapeHtml(p.text || "")}</div>
    ${p.image ? `<img src="${p.image}" alt="post image" />` : ""}
    <div class="post-actions">
      <div style="cursor:pointer" data-like="${id}" data-liked="${liked}" ${liked? "class='liked'":""}>${liked? "💙 Liked":"🤍 Like"}</div>
      <div style="cursor:pointer" data-comment="${id}">💬 Comment</div>
      <div style="cursor:pointer">🔁 Share</div>
    </div>
    <div id="comments-${id}" class="muted"></div>
  `;
  // like click
  container.querySelector(`[data-like='${id}']`).addEventListener("click", async (e) => {
    if (!currentUid) { alert("Login to like"); return; }
    await toggleLike(id, currentUid);
  });
  // comment click opens prompt for quick comment
  container.querySelector(`[data-comment='${id}']`).addEventListener("click", async () => {
    const text = prompt("Write a comment");
    if (!text) return;
    await addDoc(collection(db, "posts", id, "comments"), { uid: currentUid, text, timestamp: serverTimestamp(), userEmail: auth.currentUser?.email || "Anonymous" });
  });

  return container;
}

function loadFeed() {
  const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
  onSnapshot(q, snapshot => {
    const feed = feedEl();
    feed.innerHTML = "";
    snapshot.forEach(docSnap => {
      const p = docSnap.data();
      const id = docSnap.id;
      const currentUid = auth.currentUser ? auth.currentUser.uid : null;
      const item = renderPostItem(id, p, currentUid);
      feed.appendChild(item);
      // listen comments under this post
      const commentsContainer = $(`comments-${id}`);
      if (commentsContainer) {
        const cq = query(collection(db, "posts", id, "comments"), orderBy("timestamp", "asc"));
        onSnapshot(cq, cs => {
          commentsContainer.innerHTML = "";
          cs.forEach(cdoc => {
            const cd = cdoc.data();
            const div = document.createElement("div");
            div.innerHTML = `<b>${escapeHtml(cd.userEmail||"User")}</b>: ${escapeHtml(cd.text)}`;
            commentsContainer.appendChild(div);
          });
        });
      }
    });
  });
}

/* ----------------- load profile media (latest) ----------------- */
function loadUserMedia(uid) {
  const q = query(collection(db, "user_media"), orderBy("timestamp", "desc"));
  onSnapshot(q, snap => {
    let profileUrl = "", coverUrl = "";
    snap.forEach(docSnap => {
      const d = docSnap.data();
      if (d.uid !== uid) return;
      if (d.type === "profile" && !profileUrl) profileUrl = d.url;
      if (d.type === "cover" && !coverUrl) coverUrl = d.url;
    });
    $("profileImg").src = profileUrl || "https://via.placeholder.com/110";
    $("coverImg").src = coverUrl || "https://via.placeholder.com/900x160";
  });
}

/* ----------------- Friends / Notifications (simple) ----------------- */
async function sendFriendRequest(targetEmail) {
  const user = auth.currentUser;
  if (!user) return alert("Login first");
  await addDoc(collection(db, "friend_requests"), { from: user.email, to: targetEmail, status: "pending", timestamp: serverTimestamp() });
  alert("Friend request sent");
}
function loadFriends() {
  // for demo, show incoming/outgoing requests
  onSnapshot(query(collection(db,"friend_requests"), orderBy("timestamp","desc")), snap=>{
    const out = [];
    snap.forEach(s=> out.push(s.data()));
    friendsListEl().innerHTML = out.length ? out.map(r => `<div class="card muted">${escapeHtml(r.from)} → ${escapeHtml(r.to)} [${r.status}]</div>`).join("") : "<div class='muted'>No friend activity</div>";
  });
}
function loadNotifications() {
  onSnapshot(query(collection(db,"notifications"), orderBy("timestamp","desc")), snap=>{
    const arr = [];
    snap.forEach(s => arr.push(s.data()));
    notificationsEl().innerHTML = arr.length ? arr.map(n => `<div class='card muted'>${escapeHtml(n.text)}</div>`).join("") : "<div class='muted'>No notifications</div>";
  });
}

/* ----------------- Load profile posts (user own) ----------------- */
function loadProfilePosts(uid) {
  onSnapshot(query(collection(db, "posts"), orderBy("timestamp", "desc")), snap => {
    profilePostsEl().innerHTML = "";
    snap.forEach(snapDoc => {
      const p = snapDoc.data();
      if (p.uid !== uid) return;
      const el = renderPostItem(snapDoc.id, p, uid);
      profilePostsEl().appendChild(el);
    });
  });
}

/* ----------------- Auth state listener ----------------- */
onAuthStateChanged(auth, user => {
  renderAuthArea(user);
  if (user) {
    $("profileName").innerText = user.email;
    loadUserMedia(user.uid);
    loadProfilePosts(user.uid);
    if (analytics) logEvent(analytics, "user_open_profile", { uid: user.uid });
  } else {
    $("profileName").innerText = "Guest";
  }
});

/* ----------------- start feed and other listeners ----------------- */
loadFeed();
loadFriends();
loadNotifications();

/* ----------------- attach upload buttons (fallback if elements loaded late) ----------------- */
document.addEventListener("DOMContentLoaded", () => {
  $("uploadProfileBtn")?.addEventListener("click", uploadProfile);
  $("uploadCoverBtn")?.addEventListener("click", uploadCover);
  // bottom nav data-section wiring already in HTML via attributes; keep default home
});
