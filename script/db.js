import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDh91TvqhSFgxRzFz1fsYhKpuyot5frpP0",
  authDomain: "pagosdeportivos.firebaseapp.com",
  projectId: "pagosdeportivos",
  storageBucket: "pagosdeportivos.firebasestorage.app",
  messagingSenderId: "873416848905",
  appId: "1:873416848905:web:47b88fd58e49b5434caad8",
  measurementId: "G-N46ZN36L2M"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Esto hace que tus otros archivos lo puedan usar
window.firebaseDB = db;
window.firebaseCollection = collection;
window.firebaseAddDoc = addDoc;
window.firebaseGetDocs = getDocs;
window.firebaseQuery = query;
window.firebaseWhere = where;

console.log("Firebase conectado correctamente!");
