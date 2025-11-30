import { db, storage } from "./Firebase.js";
import { ref, set, push } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getDownloadURL, uploadBytes, ref as storageRef } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

document.getElementById("uploadBtn").addEventListener("click", async () => {
    let file = document.getElementById("imageFile").files[0];
    let caption = document.getElementById("caption").value;

    if (!file) {
        alert("Select an image first!");
        return;
    }

    // 1) Upload to Storage
    let uniqueName = "post_" + Date.now();
    let imgRef = storageRef(storage, "uploads/" + uniqueName);

    await uploadBytes(imgRef, file);
    let imageURL = await getDownloadURL(imgRef);

    // 2) Save to Realtime Database
    let postRef = push(ref(db, "feed"));

    await set(postRef, {
        image: imageURL,
        caption: caption,
        time: new Date().toISOString()
    });

    alert("Uploaded Successfully!");
});
