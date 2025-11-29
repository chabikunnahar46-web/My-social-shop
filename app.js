// app.js (module) - Home page logic with Firebase hooks
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-storage.js";
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-analytics.js";

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
try{ analytics = getAnalytics(app); } catch(e){ console.warn('Analytics init failed:', e.message); }

const $ = id => document.getElementById(id);

// --- TAB wiring (top & bottom)
document.querySelectorAll('[data-section]').forEach(btn => {
  btn.addEventListener('click', () => showSection(btn.dataset.section));
});
function showSection(id){
  document.querySelectorAll('.page-section').forEach(s=>s.style.display='none');
  const el = document.getElementById(id);
  if(el) el.style.display='block';
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.section===id));
}
showSection('home');

// --- Auth UI
function renderAuthArea(user){
  const a = $('authArea');
  if(user){
    a.innerHTML = `Logged in as <b>${user.email}</b> <button class="small-btn" id="logoutBtn">Log Out</button>`;
    $('logoutBtn')?.addEventListener('click', () => signOut(auth));
  } else {
    a.innerHTML = `<input id="email" placeholder="Email" style="padding:6px;border:1px solid #eaeef3;border-radius:6px"/><input id="password" type="password" placeholder="Password" style="padding:6px;border:1px solid #eaeef3;border-radius:6px"/><button class="small-btn" id="signupBtn">Sign Up</button><button class="small-btn" id="loginBtn">Log In</button>`;
    $('signupBtn')?.addEventListener('click', async()=>{ try{ await createUserWithEmailAndPassword(auth,$('email').value,$('password').value); alert('Signed up'); if(analytics) logEvent(analytics,'sign_up'); } catch(e){alert(e.message);} });
    $('loginBtn')?.addEventListener('click', async()=>{ try{ await signInWithEmailAndPassword(auth,$('email').value,$('password').value); alert('Logged in'); if(analytics) logEvent(analytics,'login'); } catch(e){alert(e.message);} });
  }
}

onAuthStateChanged(auth, user => {
  renderAuthArea(user);
});

// --- Post creation
async function uploadFileToStorage(path,file){
  const sRef = ref(storage,path);
  const task = uploadBytesResumable(sRef,file);
  await new Promise((res,rej)=> task.on('state_changed', null, rej, res));
  return await getDownloadURL(sRef);
}

$('postBtn')?.addEventListener('click', async ()=>{
  const text = $('postText').value.trim();
  const file = $('postFile').files[0];
  const user = auth.currentUser;
  if(!user) return alert('Please login to post');
  if(!text && !file) return alert('Post empty');
  let imageUrl = '';
  if(file){ imageUrl = await uploadFileToStorage(`posts/${user.uid}_${Date.now()}_${file.name}`, file); }
  await addDoc(collection(db,'posts'), { uid: user.uid, user: user.email, text, image: imageUrl, timestamp: serverTimestamp(), likes: 0 });
  $('postText').value=''; $('postFile').value='';
  if(analytics) logEvent(analytics,'create_post');
});

// --- Load feed (real-time)
function escapeHtml(s){ if(!s) return ''; return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

function renderPost(p){
  const div = document.createElement('div'); div.className='feed-post card';
  const time = p.timestamp && p.timestamp.seconds ? new Date(p.timestamp.seconds*1000).toLocaleString() : '';
  div.innerHTML = `
    <div class="meta"><div><b>${escapeHtml(p.user||'Anonymous')}</b><div class='muted'>${time}</div></div></div>
    <div class="content">${escapeHtml(p.text||'')}</div>
    ${p.image?`<img src="${p.image}" />`:''}
    <div class="post-actions"><div>❤️ 
