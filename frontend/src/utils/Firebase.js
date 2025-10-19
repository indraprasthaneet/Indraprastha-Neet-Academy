import {getAuth, GoogleAuthProvider} from "firebase/auth"
import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY ,
  authDomain: "indraprashta-f779f.firebaseapp.com",
  projectId: "indraprashta-f779f",
   storageBucket: "indraprashta-f779f.firebasestorage.app",
  messagingSenderId: "554805016845",
  appId: "1:554805016845:web:2417cf7fc15cd86c565844",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider()
export {auth,provider}