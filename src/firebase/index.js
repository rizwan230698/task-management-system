import firebase from "firebase/app";
import "firebase/auth";

const config = {
  apiKey: "AIzaSyBnXAaOYioD2t-3hx9LfRZWlyPdRfj5LBI",
  authDomain: "punk-beer-d4df8.firebaseapp.com",
  databaseURL: "https://punk-beer-d4df8.firebaseio.com",
  projectId: "punk-beer-d4df8",
  storageBucket: "punk-beer-d4df8.appspot.com",
  messagingSenderId: "1037812390279",
  appId: "1:1037812390279:web:b078132ec9c8e4fa67db22",
  measurementId: "G-5E8EWS5F94",
};

firebase.initializeApp(config);

export const auth = firebase.auth();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

export const signInWithGoogle = () => firebase.auth().signInWithPopup(provider);

export default firebase;
