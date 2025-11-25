

import { db, storage, auth, collection, addDoc, getDocs, ref, uploadBytes, getDownloadURL, onAuthStateChanged } from "./Firebase.js";

// ---------- Shop Item Upload ----------
const shopForm = document.getElementById("shopForm");

shopForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    let name = document.getElementById("itemName").value;
    let price = document.getElementById("itemPrice").value;
    let desc = document.getElementById("itemDesc").value;
    let file = document.getElementById("itemImage").files[0];

    if (!file) {
        alert("Upload an image!");
        return;
    }

    const storageRef = ref(storage, "shopImages/" + file.name);
    await uploadBytes(storageRef, file);
    const imageURL = await getDownloadURL(storageRef);

    await addDoc(collection(db, "shopItems"), {
        name: name,
        price: price,
        desc: desc,
        image: imageURL,
        user: auth.currentUser.uid,
        date: Date.now()
    });

    alert("Item Added!");
    shopForm.reset();
    loadShopItems();
});

// ---------- Load Shop Items ----------
async function loadShopItems() {
    const shopDiv = document.getElementById("shopItems");
    shopDiv.innerHTML = "";
    
    const querySnapshot = await getDocs(collection(db, "shopItems"));
    querySnapshot.forEach((doc) => {
        let item = doc.data();

        shopDiv.innerHTML += `
            <div class="shop-card">
                <img src="${item.image}" />
                <h3>${item.name}</h3>
                <p>${item.desc}</p>
                <strong>${item.price} ₹</strong>
            </div>
        `;
    });
}

loadShopItems();
