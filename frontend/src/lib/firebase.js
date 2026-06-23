// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBH1ynHYQ8iw-M7fb1vLUk0zaTvnY0_VvY",
  authDomain: "exams-7f8c9.firebaseapp.com",
  projectId: "exams-7f8c9",
  storageBucket: "exams-7f8c9.firebasestorage.app",
  messagingSenderId: "1043236739411",
  appId: "1:1043236739411:web:7b7b70b454ae83b3a0e9a6",
  measurementId: "G-0W0CMJVDCE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};