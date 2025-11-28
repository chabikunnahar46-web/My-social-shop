import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "./Firebase.js";

async function addComment(postId) {
    const input = document.getElementById("commentInput_" + postId);
    const text = input.value;

    if (!text) return alert("Please enter a comment!");

    try {
        await addDoc(collection(db, "posts", postId, "comments"), {
            text: text,
            user: auth.currentUser ? auth.currentUser.displayName || auth.currentUser.email : "Anonymous",
            time: serverTimestamp()
        });
        input.value = "";
    } catch (err) {
        console.error("Comment Error:", err);
    }
}

window.addComment = addComment;
