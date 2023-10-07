// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAln1kouI6lt9epkvH0u2D5qVo9_3WTVck",
    authDomain: "my-app-6dc9a.firebaseapp.com",
    projectId: "my-app-6dc9a",
    storageBucket: "my-app-6dc9a.appspot.com",
    messagingSenderId: "255755298376",
    appId: "1:255755298376:web:aa1e96660fbf64a4fc5a7d",
    measurementId: "G-THQZG4DX3V"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);