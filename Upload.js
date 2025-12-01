document.getElementById("uploadBtn").addEventListener("click", async () => {

    let file = document.getElementById("imageFile").files[0];
    if (!file) return alert("Select an image first!");

    let formData = new FormData();
    formData.append("file", file); 
    formData.append("upload_preset", "My upload"); // আপনার preset name

    let response = await fetch("https://api.cloudinary.com/v1_1/dj1wdote4/image/upload", {
        method: "POST",
        body: formData
    });

    let data = await response.json();
    console.log(data);

    let url = data.secure_url;

    document.getElementById("preview").innerHTML = `
        <img src="${url}" width="200">
        <p>Image uploaded!</p>
    `;

    alert("Upload Successful!");
});
