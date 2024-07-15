import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDtXBRBxyxIhg2mBB2t7BBv79oHg18OVIg",
  authDomain: "electric-vehicle-recharg-76c8b.firebaseapp.com",
  projectId: "electric-vehicle-recharg-76c8b",
  storageBucket: "electric-vehicle-recharg-76c8b.appspot.com",
  messagingSenderId: "542319602682",
  appId: "1:542319602682:web:ed8d5a3c80dbfa0722d243",
  measurementId: "G-5V7ZMQRXT2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logInWithEmailAndPassword = async (email, password, userType) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    const user = res.user;

    if (userType === "admin") {
      const q = query(collection(db, "admins"), where("uid", "==", user.uid));
      const docs = await getDocs(q);
      if (docs.empty) {
        throw new Error("Unauthorized access: Admin credentials required.");
      }
    } else {
      const q = query(collection(db, "users"), where("uid", "==", user.uid));
      const docs = await getDocs(q);
      if (docs.empty) {
        throw new Error("Unauthorized access: User credentials required.");
      }
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const registerWithEmailAndPassword = async (name, email, password, userType) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;

    if (userType === "admin") {
      await addDoc(collection(db, "admins"), {
        uid: user.uid,
        name,
        authProvider: "local",
        email,
        role: "admins"
      });
    } else {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name,
        authProvider: "local",
        email,
        role: "users"
      });
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logout = () => {
  signOut(auth);
};

export {
  auth,
  db,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
};
