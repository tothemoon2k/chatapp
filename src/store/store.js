import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { writable } from 'svelte/store';
import { auth, db } from '../lib/firebase/firebase';
import { browser } from "$app/environment"


export const authStore = writable(browser && localStorage.getItem("userId") || {
  user: null,
  data: {},
});

export const authHandlers = {
  register: async (screenName, password) => {
    try {
      const { user: registerUser } = await createUserWithEmailAndPassword(auth, `${screenName}@company.com`, password);

      const user = {
        uid: registerUser.uid,
        screenName: screenName,
        dateCreated: serverTimestamp(),
        lastLogin: serverTimestamp()
      };

      await setDoc(doc(db, "users", registerUser.uid), user);
      
      
      localStorage.setItem("userId", registerUser.uid);
      localStorage.setItem("screenName", screenName);


      return registerUser;
    } catch (error) {
      alert('An unexpected error. Please contact support')
      console.log(error);
    }
  },
  login: async (screenName, password) => {
    const data = await signInWithEmailAndPassword(auth, `${screenName}@company.com`, password);
    await updateDoc(doc(db, "users", data.user.uid), {
      lastLogin: serverTimestamp()
    });
    localStorage.setItem("userId", data.user.uid);
    localStorage.setItem("screenName", screenName);
  },
  logout: async () => {
    await signOut(auth);
    localStorage.removeItem("userId");
  }
};
