<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyA33of57qBOpIUioKDQ7dMx0KZR6OXLECY",
    authDomain: "bondhotto-24.firebaseapp.com",
    projectId: "bondhotto-24",
    storageBucket: "bondhotto-24.firebasestorage.app",
    messagingSenderId: "585952718894",
    appId: "1:585952718894:web:1d9b2e9f12f617a2f2afbf",
    measurementId: "G-KJQSLPY9NQ"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>
