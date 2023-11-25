// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "jvb-estate.firebaseapp.com",
  projectId: "jvb-estate",
  storageBucket: "jvb-estate.appspot.com",
  messagingSenderId: "708424978401",
  appId: "1:708424978401:web:b10a63178c0207eaec8ca0",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
