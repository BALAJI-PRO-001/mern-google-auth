// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries



// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "mern--auth-v1-bf322.firebaseapp.com",
  projectId: "mern--auth-v1-bf322",
  storageBucket: "mern--auth-v1-bf322.appspot.com",
  messagingSenderId: "1052317673131",
  appId: "1:1052317673131:web:74dbfa2a65bf3512a2b9ee"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;