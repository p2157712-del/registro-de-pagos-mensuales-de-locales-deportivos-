

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
       
import { collection, addDoc, getDocs, query, where } from "https://gstatic.com";

window.firebaseGetDocs = getDocs;
window.firebaseQuery = query;
window.firebaseWhere = where;
