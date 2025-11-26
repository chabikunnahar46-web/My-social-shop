import { db, storage, auth } from './firebase.js';
import { collection, addDoc, Timestamp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js";

const productForm = document.getElementById('productForm');

productForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('itemName').value;
  const price = document.getElementById('itemPrice').value;
  const desc = document.getElementById('itemDesc').value;

  const files = [
    document.getElementById('itemImage1').files[0],
    document.getElementById('itemImage2').files[0],
    document.getElementById('itemImage3').files[0]
  ];

  const imageUrls = [];

  for(let i=0;i<files.length;i++){
    const fileRef = ref(storage, `products/${Date.now()}_${files[i].name}`);
    await uploadBytes(fileRef, files[i]);
    const url = await getDownloadURL(fileRef);
    imageUrls.push(url);
  }

  const user = auth.currentUser;

  await addDoc(collection(db, 'products'), {
    name,
    price,
    desc,
    images: imageUrls,
    sellerId: user.uid,
    sellerEmail: user.email,
    contact: {
      whatsapp: "seller whatsapp",
      phone: "seller phone",
      messenger: "seller messenger",
      email: user.email
    },
    createdAt: Timestamp.now()
  });

  alert('Product uploaded successfully!');
  productForm.reset();
});
