const user = localStorage.getItem('apex_admin');
        if (!user) { window.location.href = "../index.html"; } 
        else {
            document.getElementById('admin-name').textContent = user;
            document.getElementById('admin-initials').textContent = user.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        }

        function logout() {
            localStorage.removeItem('apex_admin');
            window.location.href = "../index.html";
        } 

             let dbEntrenadores = getEntrenadores() || [];
             let dbAsignaciones = getAsignaciones() || [];
             let dbdeportes = getDeportes() || [];
             let dbatletas = getAtletas() || [];
             let dbpagos = getPagos() || [];

            // let dbAsignaciones = JSON.parse(localStorage.getItem('apex_asignaciones')) || [];

     
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";    

export const getAtletas = async () => {
  const snapshot = await getDocs(collection(db, "atletas"));

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const getDeportes = async () => {
  const snapshot = await getDocs(collection(db, "deportes"));

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const getEntrenadores = async () => {
  const snapshot = await getDocs(collection(db, "entrenadores"));

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const getPagos = async () => {
  const snapshot = await getDocs(collection(db, "pagos"));

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const getAsignaciones = async () => {
  const snapshot = await getDocs(collection(db, "asignaciones"));

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};   
