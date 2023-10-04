import { firestoreDB } from "./firebase";
import { addDoc, collection, query, where, getDocs, setDoc, DocumentReference } from "firebase/firestore";
import { User } from "./firebase";

export async function createUserFirestore(usuario: User): Promise<any> {
  const userRef = collection(firestoreDB, "users");

  const queryName = query(userRef, where("name", "==", usuario.name));
  const ifNameExist = await getDocs(queryName);

  if (ifNameExist.docs.length !== 0) {
    return "Erro: Já existe um usuário com esse nome!";
  }
  
  const addUserFirestore = await addDoc(userRef, {
    bornDate: usuario.bornDate,
    createAccountDate: usuario.createAccountDate,
    nacionality: usuario.nacionality,
    name: usuario.name,
    roles: usuario.roles,
    userId: usuario.userId
  });

  return addUserFirestore;
}

export async function updateDocFirestore() {
  //TODO:
}

export async function getDataFromCollection(
  collectionString: string,
  key: string,
  search: string
) {
  const collectionRef = collection(firestoreDB, collectionString);

  const queryName = query(collectionRef, where(key, "==", search));
  const data = await getDocs(queryName);
  return data;
}

// --- Método de adição geral ---
// export async function addDocument(docContent: any, collectionrRef: string) {
//     const userRef = collection(firestoreDB, collectionrRef);
//     const addUserFirestore = await addDoc(userRef, docContent);
//     return addUserFirestore;
// }
