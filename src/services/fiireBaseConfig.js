// services/firebaseConfig.ts
import { initializeApp, getApps } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
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


const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];


const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});


const firestore = getFirestore(app);
const storage = getStorage(app); 

export { auth, firestore, storage }; 

