// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDIgtpe1_Vl1NOg0W9QmkeiMtE3ES-rlkM",
  authDomain: "picme-62a25.firebaseapp.com",
  projectId: "picme-62a25",
  storageBucket: "picme-62a25.appspot.com",
  messagingSenderId: "796008364700",
  appId: "1:796008364700:web:4f1cbcc066f450296bcb59"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore(app);
export const storage = getStorage();