import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import defaultUserImage from "../../../img/EatSpot-semfundo.png";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {
  createUserFirestore,
  deleteDocument,
  getDataFromCollection,
} from "./firebaseFirestore";
import { addItemToStorage, deleteFile } from "./firebaseStorage";
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
export const storage = getStorage(app, "gs://projetoeatspot.appspot.com");

export interface User {
  userId?: string;
  roles?: Roles;
  name?: string;
  password?: string;
  email?: string;
  nacionality?: string;
  bornDate?: string;
  createAccountDate?: string;
  recipesILiked?: [];
  userPhotoUrl?: string;
  registerType?: string[];
}

export interface Roles {
  user: boolean;
  admin: boolean;
}

export async function postUser(usuario: User): Promise<string> {
  let docId: string = "";
  try {
    const addUserAuth = await createUserAuth(usuario);
    docId = addUserAuth.user.uid;
  } catch (err) {
    return "Erro: Já existe uma conta criada com esse email!";
  }

  // if (addUserAuth.code === "auth/email-already-in-use") {
  //   return "Erro: Já existe uma conta criada com esse email!";
  // }

  usuario.userId = docId;
  usuario.createAccountDate = new Date().toLocaleDateString();
  usuario.roles = { user: true, admin: false };
  usuario.recipesILiked = [];
  usuario.userPhotoUrl = `images/perfil/${usuario.name}/fotoDePerfil`;

  const addUserFirestore = await createUserFirestore(usuario);
  if (addUserFirestore === "Erro: Já existe um usuário com esse nome!") {
    return addUserFirestore;
  }
  return "Registro realizado com sucesso!";
}

export async function postUserWhithUserAuthCreated(
  usuario: User
): Promise<string> {
  usuario.createAccountDate = new Date().toLocaleDateString();
  usuario.roles = { user: true, admin: false };
  usuario.recipesILiked = [];
  usuario.userPhotoUrl = `images/perfil/${usuario.name}/fotoDePerfil`;

  const addUserFirestore = await createUserFirestore(usuario);
  if (addUserFirestore.path) {
    return "Registro realizado com sucesso!";
  }
  return addUserFirestore;
}


export async function deleteAccount(
  user: any,
  userData: any,
  userDocId: string
) {
  const recipesData = await getDataFromCollection(
    "recipes",
    "userId",
    userData.userId
  );
  const imagesUrls: string[] = [];

  if (!recipesData.empty) {
    await recipesData.docs.map(async (doc) => {
      const recipeData = doc.data();
      imagesUrls.push(recipeData.imagePath);
      await deleteDocument("recipes", doc.id);
    });
  }

  if (imagesUrls) {
    imagesUrls.forEach(async (url: string) => {
      await deleteFile(url);
    });
  }

  await deleteFile(userData.userPhotoUrl);

  await deleteDocument("users", userDocId);
  user.user.delete();
}
