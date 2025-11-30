import { auth, db, storage } from './firebase.js';

import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { 
  collection, addDoc, getDocs 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { 
  uploadBytes, getDownloadURL, ref as sRef 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// Signup
window.signup = async (email, password) => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("Signup successful!");
  } catch (err) {
    alert(err.message);
  }
};

// Login
window.login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login successful!");
  } catch (err) {
    alert(err.message);
  }
};

// Upload Post (image + text)
window.uploadPost = async () => {
    let file = document.getElementById("imageFile").files[0];
    let caption = document.getElementById("caption").value;

    if (!file) return alert("Select an image first!");

    let imgRef = sRef(storage, "posts/" + Date.now());
    await uploadBytes(imgRef, file);

    let imageURL = await getDownloadURL(imgRef);

    await addDoc(collection(db, "Posts"), {
        caption,
        image: imageURL,
        time: Date.now()
    });

    alert("Post uploaded!");
};

// Fetch Posts
window.fetchPosts = async () => {
    const snap = await getDocs(collection(db, "Posts"));
    snap.forEach(doc => console.log(doc.data()));
};
