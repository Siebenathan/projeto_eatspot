import { storage } from "./firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

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
    console.log(err);
  }
    
}
