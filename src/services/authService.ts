
import { auth } from './fiireBaseConfig'; 
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";


const db = getFirestore();

export class AuthService {


  async register(email: string, password: string, name: string, profilePicURL: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

     
      const userRef = doc(db, "users", user.uid);  
      await setDoc(userRef, {
        name: name,
        profilePic: profilePicURL,
      });

      console.log('Usuário registrado com sucesso e dados salvos no Firestore');
      return userCredential;
    } catch (error) {
      console.error('Erro ao registrar usuário', error);
      throw new Error('Erro ao tentar registrar o usuário. Verifique os dados e tente novamente.');
    }
  }


  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      
      const userRef = doc(db, "users", user.uid); 
      const docSnap = await getDoc(userRef);
      
      if (docSnap.exists()) {
        const userData = docSnap.data();
        console.log('Dados do usuário recuperados:', userData);
       
      } else {
        console.log('Nenhum dado encontrado para o usuário');
      }

      return userCredential;
    } catch (error) {
      console.error('Erro ao fazer login', error);
      throw new Error('Erro ao tentar fazer login. Verifique suas credenciais e tente novamente.');
    }
  }
}