import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { User } from "./firebase";

export async function createUserAuth(usuario: User): Promise<any> {
  try {
    const createUserAuth = await createUserWithEmailAndPassword(
      auth,
      usuario.email,
      usuario.password
    );
    return createUserAuth;
  } catch (e: any) {
    return e;
  }
}

export function signOutUser() {
  signOut(auth);
  localStorage.clear();
  console.log("Logout realizado com sucesso!");
}

export let userAuth: any = null;

export async function signIn(password: string, email: string) {
  const singInUser = await signInWithEmailAndPassword(auth, email, password);
  return singInUser.user.uid;
}
