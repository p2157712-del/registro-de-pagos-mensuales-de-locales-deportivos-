import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

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

        window.firebaseDB = db;
        window.firebaseCollection = collection;
        window.firebaseAddDoc = addDoc;
 // ====== CÓDIGO AUMENTADO: FILTROS SEGURADOS POR USUARIO PARA NUBE ======
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase"; // Asegúrate de que esta ruta apunte a tu configuración de Firebase

const adminConectado = localStorage.getItem('apex_admin') || "Invitado";

export const getAtletas = async () => {
  const q = query(collection(db, "atletas"), where("usuarioOwner", "==", adminConectado));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getDeportes = async () => {
  const q = query(collection(db, "deportes"), where("usuarioOwner", "==", adminConectado));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getEntrenadores = async () => {
  const q = query(collection(db, "entrenadores"), where("usuarioOwner", "==", adminConectado));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getPagos = async () => {
  const q = query(collection(db, "pagos"), where("usuarioOwner", "==", adminConectado));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getAsignaciones = async () => {
  const q = query(collection(db, "asignaciones"), where("usuarioOwner", "==", adminConectado));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Publicamos las funciones en el entorno global para que 'libreria compartida.js' pueda verlas
window.getEntrenadores = getEntrenadores;
window.getAsignaciones = getAsignaciones;
window.getDeportes = getDeportes;
window.getAtletas = getAtletas;
window.getPagos = getPagos;
      



        


