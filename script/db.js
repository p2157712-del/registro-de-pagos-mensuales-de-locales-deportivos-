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
       



        


