// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD-9736PkmyOyPDR7UJnq6ptoSWf7BBOzw",
  authDomain: "bet7-62061.firebaseapp.com",
  projectId: "bet7-62061",
  storageBucket: "bet7-62061.firebasestorage.app",
  messagingSenderId: "575363429896",
  appId: "1:575363429896:web:6ce1c874880c11f4bf43bd",
  measurementId: "G-DR5FRNSM58"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);