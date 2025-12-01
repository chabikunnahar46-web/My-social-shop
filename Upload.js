 // upload.js
import { db, auth } from "./Firebase.js";
import { ref as dbRef, push, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const CLOUD_NAME = "dj1wdote4";
const UPLOAD_PRESET = "My upload";

const uploadBtn = document.getElementById("uploadBtn");
const imageFileInput = document.getElementById("imageFile");
const captionInput = document.getElementById("caption");
const statusBox = document.getElementById("uploadStatus");

uploadBtn.addEventListener("click", async () => {
  const file = imageFileInput.files[0];
  const caption = (captionInput.value || "").trim();

  if (!file) {
    alert("Please select an image first!");
    return;
  }

  try {
    statusBox.innerText = "Uploading to Cloudinary...";

    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: form
    });

    const data = await res.json();

    if (!data.secure_url) throw new Error("Upload failed");

    const imageURL = data.secure_url;

    statusBox.innerText = "Saving post to database...";

    // current user id (optional) — guest if not logged in
    const uid = auth?.currentUser?.uid || "guest";

    // Push to Realtime DB under /feed
    const newPostRef = push(dbRef(db, "feed"));
    await set(newPostRef, {
      image: imageURL,
      caption: caption,
      uid: uid,
      time: Date.now()
    });

    statusBox.innerHTML = "Uploaded successfully! <br><img src='" + imageURL + "' width='200' />";
    // clear inputs
    captionInput.value = "";
    imageFileInput.value = "";
  } catch (err) {
    console.error(err);
    statusBox.innerText = "Error: " + (err.message || err);
  }
});
