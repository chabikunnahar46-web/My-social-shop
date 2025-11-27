function uploadPhoto() {
    const file = document.getElementById("photoInput").files[0];
    const text = document.getElementById("postText").value;

    if (!file) {
        alert("Please select a photo!");
        return;
    }

    const storageRef = storage.ref("posts/" + Date.now() + "_" + file.name);
    const uploadTask = storageRef.put(file);

    uploadTask.on("state_changed",
        null,
        (error) => console.error(error),
        () => {
            uploadTask.snapshot.ref.getDownloadURL().then((url) => {
                db.collection("posts").add({
                    type: "image",
                    text: text,
                    mediaURL: url,
                    user: "Admin",
                    time: firebase.firestore.FieldValue.serverTimestamp()
                });

                alert("Photo Uploaded Successfully!");
            });
        }
    );
}
