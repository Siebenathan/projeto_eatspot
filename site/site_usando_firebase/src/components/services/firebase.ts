import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getAuth,
} from "firebase/auth";
import {
  collection,
  getFirestore,
  getDocs,
  addDoc,
  doc,
  setDoc,
} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDIxf_VgVaTT4LoqzcQ0QRHOq48-B7HEVA",
  authDomain: "projetoeatspot.firebaseapp.com",
  projectId: "projetoeatspot",
  storageBucket: "projetoeatspot.appspot.com",
  messagingSenderId: "618315571139",
  appId: "1:618315571139:web:c0d47f6238608b47a52776",
  measurementId: "G-JE1ZVL22K9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const firestoreDB = getFirestore(app);

export async function getUsuarios() {
  const userCollectionRef = collection(firestoreDB, "users");
  var data = await getDocs(userCollectionRef);
  return data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
}

interface User {
  userId?: string;
  name: string;
  password: string;
  email: string;
}

export async function postUser(usuario: User) {
  try {
    const docId = await createAuthUser(usuario);
    const userRef = collection(firestoreDB, "users");
    const addUserFirestore = await addDoc(userRef, usuario);
    console.log("Documento escrito com o id:", addUserFirestore.id);
  } catch (e: any) {
    console.log("Erro ao adicionar o documento:", e);
  }
}

async function createAuthUser(usuario: User) {
  const createUserAuth = await createUserWithEmailAndPassword(
    auth,
    usuario.email,
    usuario.name
  );
  const docId = createUserAuth.user.uid;
  return docId;
}
