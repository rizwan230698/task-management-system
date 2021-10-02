import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCLfJd0j-JqjGkvcXJ-zxVzmXRf5_nIk5w",
  authDomain: "task-management-system-4c0ad.firebaseapp.com",
  projectId: "task-management-system-4c0ad",
  storageBucket: "task-management-system-4c0ad.appspot.com",
  messagingSenderId: "1026045614318",
  appId: "1:1026045614318:web:d2804190081ea4ac35bbff",
  measurementId: "G-39ZGDB2GJX",
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

export const signInWithGoogle = () => firebase.auth().signInWithPopup(provider);

export const firestore = firebase.firestore;

export default firebase;
