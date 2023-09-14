// Import the functions you need from the SDKs you need
import { deleteApp, initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCHLjMFhtBEI6QsVBCTkNs-wxKJotcRkr0",
    authDomain: "retro-messenger-b6c37.firebaseapp.com",
    projectId: "retro-messenger-b6c37",
    storageBucket: "retro-messenger-b6c37.appspot.com",
    messagingSenderId: "556182584941",
    appId: "1:556182584941:web:2c455237e5e546b3cc8964"
  };

// Initialize Firebase
let firebaseApp;
if(!getApps().length){
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApp();
  deleteApp(firebaseApp);
  firebaseApp = initializeApp(firebaseConfig);
}

export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);