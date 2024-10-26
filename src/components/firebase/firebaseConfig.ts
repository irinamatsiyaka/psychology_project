import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
   apiKey: "AIzaSyChVmeoLeNxbwHI46h7_-95M9-CgBFCmQY",
   authDomain: "psychologist-eff12.firebaseapp.com",
   projectId: "psychologist-eff12",
   storageBucket: "psychologist-eff12.appspot.com",
   messagingSenderId: "569821173006",
   appId: "1:569821173006:web:9e7cc0ac7587202498b35f",
   measurementId: "G-X48LC7HH3K",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
