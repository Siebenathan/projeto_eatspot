import { firestoreDB } from "./firebase";
import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  limit,
  orderBy,
  doc,
  updateDoc,
  startAfter,
  startAt,
  getDoc,
  getCountFromServer,
} from "firebase/firestore";
import { User } from "./firebase";
import { start } from "repl";
import { StringMappingType } from "typescript";

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
    userId: usuario.userId,
    recipesILiked: usuario.recipesILiked,
    userPhotoUrl: usuario.userPhotoUrl,
    recipeComments: [],
    numberOfRecipes: 0,
  });

  return addUserFirestore;
}

export async function updateDocFirestore(
  collectionString: string,
  reference: string,
  data: any
) {
  const docRef = doc(firestoreDB, collectionString, reference);
  try {
    const updateInfo = await updateDoc(docRef, data);
    return updateInfo;
  } catch (err) {
    console.log(err);
  }
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

export async function addDocument(collectionrRef: string, docContent: any) {
  const docRef = collection(firestoreDB, collectionrRef);
  const addDocument = await addDoc(docRef, docContent);
  return addDocument;
}

export async function getDataWithOrderLimitAndStartAfter(
  collectionString: string,
  limitNumber: number,
  orderByField: string,
  orderByMode: "desc" | "asc",
  latestDoc?: any
) {
  const collectionRef = collection(firestoreDB, collectionString);
  if (!latestDoc) {
    let queryName = query(
      collectionRef,
      orderBy(orderByField, orderByMode),
      limit(limitNumber)
    );
    try {
      const response = await getDocs(queryName);
      return response;
    } catch (err) {
      return err;
    }
  }
  let queryName = query(
    collectionRef,
    orderBy(orderByField, orderByMode),
    startAfter(latestDoc),
    limit(limitNumber)
  );
  try {
    const response = await getDocs(queryName);
    return response;
  } catch (err) {
    console.log(err);
    return err;
  }
}

export async function getDataWithWhereOrderLimitAndStartAfter(
  collectionString: string,
  limitNumber: number,
  orderByField: string,
  orderByMode: "desc" | "asc",
  key: string,
  search: string,
  latestDoc?: any
) {
  const collectionRef = collection(firestoreDB, collectionString);
  if (!latestDoc) {
    let queryName = query(
      collectionRef,
      where(key, "==", search),
      orderBy(orderByField, orderByMode),
      limit(limitNumber)
    );
    try {
      const response = await getDocs(queryName);
      return response;
    } catch (err) {
      return err;
    }
  }
  let queryName = query(
    collectionRef,
    where(key, "==", search),
    orderBy(orderByField, orderByMode),
    startAfter(latestDoc),
    limit(limitNumber)
  );
  try {
    const response = await getDocs(queryName);
    return response;
  } catch (err) {
    console.log(err);
    return err;
  }
}

export async function getCollectionSize(collectionString: string) {
  const collectionRef = collection(firestoreDB, collectionString);
  return await getCountFromServer(collectionRef);
}

export async function getDataWithOrderLimitAndStartAt(
  collectionString: string,
  limitNumber: number,
  orderByField: string,
  orderByMode: "desc" | "asc",
  latestDoc?: any
) {
  const collectionRef = collection(firestoreDB, collectionString);
  if (!latestDoc) {
    let queryName = query(
      collectionRef,
      orderBy(orderByField, orderByMode),
      limit(limitNumber)
    );
    try {
      const response = await getDocs(queryName);
      return response;
    } catch (err) {
      return err;
    }
  }
  let queryName = query(
    collectionRef,
    orderBy(orderByField, orderByMode),
    startAt(latestDoc),
    limit(limitNumber)
  );
  try {
    const response = await getDocs(queryName);
    return response;
  } catch (err) {
    console.log(err);
    return err;
  }
}

export async function setDocAlreadyCreated(
  collectionString: string,
  docReferenceString: string,
  newData: unknown
) {
  const docRef = doc(firestoreDB, collectionString, docReferenceString);
  const response = await setDoc(docRef, newData);
  return response;
}
