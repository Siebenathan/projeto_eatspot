// import initializeApp from "./node_modules/firebase/firebase-app";
// import { getAnalytics } from "firebase/analytics";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDIxf_VgVaTT4LoqzcQ0QRHOq48-B7HEVA",
  authDomain: "projetoeatspot.firebaseapp.com",
  projectId: "projetoeatspot",
  storageBucket: "projetoeatspot.appspot.com",
  messagingSenderId: "618315571139",
  appId: "1:618315571139:web:c0d47f6238608b47a52776",
  measurementId: "G-JE1ZVL22K9",
};

// export const app = initializeApp(firebaseConfig);
// export const analytics = getAnalytics(app);
// export const auth = getAuth(app);
// export const firestoreDB = getFirestore(app);
// export const storage = getStorage(app, "gs://projetoeatspot.appspot.com");

async function teste() {
  const data = await fetch(
    "http://localhost/phpProjects/eatspot_admins/index.php",
    { method: "POST", mode: "cors", body: { abacate: "abacate" } }
  );
  console.log(data);
}

teste();
