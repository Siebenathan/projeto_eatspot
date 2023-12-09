import { storage } from "./firebase";
import { getDownloadURL, ref, uploadBytesResumable, deleteObject  } from "firebase/storage";

export async function addItemToStorage(url: string, file: any) {
  const storageRef = ref(storage, url);
  const uploadTask = uploadBytesResumable(storageRef, file)
    .then((result) => console.log(result))
    .catch((err) => console.log(err));
  return uploadTask;
}

export async function getImageStorage(url: string) {
  try {
    const response = await getDownloadURL(ref(storage, url));
    return response;
  } catch(err) {
    return "erro imagem nao encontrada";
  }
}

export async function deleteFile(url: string) {
  const storageRef = ref(storage, url);
  try {
    const deleteFile = await deleteObject(storageRef);
    return deleteFile;
  } catch(err) {
    return err;
  }
}
