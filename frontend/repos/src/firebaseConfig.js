// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCMD_OniTMiPzBL-CDCpuuVGvL-vXCxnPY",
  authDomain: "autenticador-2fa-62026.firebaseapp.com",
  projectId: "autenticador-2fa-62026",
  storageBucket: "autenticador-2fa-62026.firebasestorage.app",
  messagingSenderId: "679998211138",
  appId: "1:679998211138:web:2782e9d01d5720b24899db",
  measurementId: "G-3CZJVFX2H7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);