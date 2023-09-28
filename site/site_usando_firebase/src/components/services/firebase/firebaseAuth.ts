import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "firebase/auth";
import { User } from "./firebase";
import { useState, useEffect } from "react";

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

export function GetUserAuth() {
  const [userAuth, setUserAuth] = useState<any>();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserAuth(user);
      } else {
        setUserAuth(null);
      }
    });
  }, []);

  return userAuth;
}

export function singOut() {
  signOut(auth);
  console.log("Logout realizado com sucesso!");
}

export let userAuth: any = null;

export async function signIn(password: string, email: string) {
  const singInUser = await signInWithEmailAndPassword(auth, email, password);
  return singInUser.user.uid;
}
