import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { createUserFirestore } from "./firebaseFirestore";
import { createUserAuth } from "./firebaseAuth";

const firebaseConfig = {
  apiKey: "AIzaSyDIxf_VgVaTT4LoqzcQ0QRHOq48-B7HEVA",
  authDomain: "projetoeatspot.firebaseapp.com",
  projectId: "projetoeatspot",
  storageBucket: "projetoeatspot.appspot.com",
  messagingSenderId: "618315571139",
  appId: "1:618315571139:web:c0d47f6238608b47a52776",
  measurementId: "G-JE1ZVL22K9",
};

export const app = initializeApp(firebaseConfig);
// export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const firestoreDB = getFirestore(app);

export interface User {
  userId?: string;
  roles?: Roles;
  name: string;
  password: string;
  email: string;
  nacionality: string;
  bornDate: string;
  createAccountDate?: string;
}

export interface Roles {
  user: boolean;
  admin: boolean;
}

export async function postUser(usuario: User): Promise<string> {
  const addUserAuth = await createUserAuth(usuario);
  if (addUserAuth.code === "auth/email-already-in-use") {
    return "Erro: Já existe uma conta criada com esse email!";
  }
  const docId = addUserAuth.user.uid;

  usuario.userId = docId;
  usuario.createAccountDate = new Date().toLocaleDateString();
  usuario.roles = { user: true, admin: false };

  const addUserFirestore = await createUserFirestore(usuario);
  if(addUserFirestore === "Erro: Já existe um usuário com esse nome!") {
    return addUserFirestore;
  }
  console.log("Documento escrito com o id:", addUserFirestore.id);
  return "Registro realizado com sucesso!";
}

