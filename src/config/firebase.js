// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyA3tQEZ2nvREC1e3MathA-Ibe6BskM_vLM",
//   authDomain: "wavy-a60a0.firebaseapp.com",
//   projectId: "wavy-a60a0",
//   storageBucket: "wavy-a60a0.appspot.com",
//   messagingSenderId: "1026470245480",
//   appId: "1:1026470245480:web:85ce69880007b20218f7dd",
// };

const firebaseConfig = {
  apiKey: "AIzaSyAvuT83aa5GEgkos9NO5Bi2t1QB0tVBI3s",
  authDomain: "wavy-5725a.firebaseapp.com",
  projectId: "wavy-5725a",
  storageBucket: "wavy-5725a.appspot.com",
  messagingSenderId: "522335934826",
  appId: "1:522335934826:web:dab7a0d55c7289188d6d13",
  measurementId: "G-ZSYY6K8C1R",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const firebaseConnection = getFirestore(app);
