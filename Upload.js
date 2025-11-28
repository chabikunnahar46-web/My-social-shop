import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { storage, db, auth } from "./Firebase.js"; // তোমার Firebase.js থেকে

async function uploadPhoto() {
    const file = document.getElementById("photoInput").files[0];
    const text = document.getElementById("postText").value;

    if (!file) {
        alert("Please select a photo!");
        return;
    }

    const storageRef = ref(storage, "posts/" + Date.now() + "_" + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
        "state_changed",
        null,
        (error) => console.error("Upload Error:", error),
        async () => {
            try {
                const url = await getDownloadURL(uploadTask.snapshot.ref);
                await addDoc(collection(db, "posts"), {
                    type: "image",
                    text: text,
                    mediaURL: url,
                    user: auth.currentUser ? auth.currentUser.displayName || auth.currentUser.email : "Admin",
                    time: serverTimestamp()
                });
                alert("Photo Uploaded Successfully!");
                document.getElementById("photoInput").value = "";
                document.getElementById("postText").value = "";
            } catch (err) {
                console.error("Firestore Error:", err);
            }
        }
    );
}

window.uploadPhoto = uploadPhoto; // HTML থেকে কল করার জন্য
