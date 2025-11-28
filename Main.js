import { auth, db } from './firebase.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

// Signup
window.signup = async (email, password) => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("Signup successful!");
  } catch (err) { alert(err.message); }
};

// Login
window.login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login successful!");
  } catch (err) { alert(err.message); }
};

// Save Post
window.savePost = async (message) => {
  try {
    await addDoc(collection(db, "feed/Posts"), {
      message,
      timestamp: Date.now()
    });
    alert("Post saved!");
  } catch(err) { alert(err.message); }
};

// Fetch Posts
window.fetchPosts = async () => {
  const querySnapshot = await getDocs(collection(db, "feed/Posts"));
  querySnapshot.forEach((doc) => {
    console.log(doc.data());
  });
};body { font-family: Arial; padding: 20px; }
input { margin: 5px 0; padding: 5px; }
button { margin: 5px 0; padding: 5px 10px; cursor: pointer; }
h2 { margin-top: 20px; }
