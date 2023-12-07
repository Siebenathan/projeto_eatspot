import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
} from "firebase/auth";
import { User } from "./firebase";

export async function createUserAuth(usuario: User): Promise<any> {
  try {
    const createUserAuth = await createUserWithEmailAndPassword(
      auth,
      usuario.email ? usuario.email : "",
      usuario.password ? usuario.password : ""
    );
    return createUserAuth;
  } catch (e: any) {
    return e;
  }
}

export async function signOutUser() {
  signOut(auth);
  await localStorage.clear();
  console.log("Logout realizado com sucesso!");
}

export let userAuth: any = null;

export async function signIn(password: string, email: string) {
  try {
    const singInUser = await signInWithEmailAndPassword(auth, email, password);
    return singInUser;
  } catch(err) {
    return "erro";
  }
}

export async function recoverPassword(email: string) {
  try {
    const recoverPasswordResult = await sendPasswordResetEmail(auth, email);
    return recoverPasswordResult;
  } catch(err) {
    return err;
  }
}
