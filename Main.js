import { db } from './firebase.js';
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const feed = document.getElementById('feed');

async function loadFeed() {
  feed.innerHTML = '';

  // Load latest post
  const postSnap = await getDocs(query(collection(db, 'posts'), orderBy('createdAt', 'desc')));
  postSnap.forEach(doc => {
    const data = doc.data();
    const div = document.createElement('div');
    div.innerHTML = `<h3>${data.userName}</h3><p>${data.caption}</p>`;
    feed.appendChild(div);
  });

  // Load latest product
  const prodSnap = await getDocs(query(collection(db, 'products'), orderBy('createdAt', 'desc')));
  prodSnap.forEach(doc => {
    const data = doc.data();
    const div = document.createElement('div');
    div.innerHTML = `<h3>${data.name} - ${data.price}৳</h3>
                     <p>${data.desc}</p>
                     <button onclick="window.location.href='add-product.html'">Buy Now</button>`;
    feed.appendChild(div);
  });

  // Load latest video
  const reelSnap = await getDocs(query(collection(db, 'reels'), orderBy('createdAt', 'desc')));
  reelSnap.forEach(doc => {
    const data = doc.data();
    const div = document.createElement('div');
    div.innerHTML = `<video src="${data.videoUrl}" controls></video>`;
    feed.appendChild(div);
  });
}

loadFeed();
