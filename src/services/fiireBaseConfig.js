import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; 
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCFAiDFTp8Z3l7r5-Iv0CznqxxjAz8cy8Q",
  authDomain: "alguelquadra.firebaseapp.com",
  projectId: "alguelquadra",
  storageBucket: "alguelquadra.appspot.com", 
  messagingSenderId: "521543367379",
  appId: "1:521543367379:web:dc0ec1cf903f0604d53226",
};


const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
