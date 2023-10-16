// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: import.meta.env.FIREBASE_KEY,
    authDomain: "my-app-6dc9a.firebaseapp.com",
    projectId: "my-app-6dc9a",
    storageBucket: "my-app-6dc9a.appspot.com",
    messagingSenderId: "255755298376",
    appId: "1:255755298376:web:aa1e96660fbf64a4fc5a7d",
    measurementId: "G-THQZG4DX3V"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);