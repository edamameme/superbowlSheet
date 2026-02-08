import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, onSnapshot } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCpd7nkEJQ_t_kbrBCkC03xiK_U66u7QPI",
  authDomain: "superbowl-98001.firebaseapp.com",
  projectId: "superbowl-98001",
  storageBucket: "superbowl-98001.firebasestorage.app",
  messagingSenderId: "358953933817",
  appId: "1:358953933817:web:5ba659e59b28b6a5ce7b28"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const STATE_DOC = doc(db, "app", "state");

export function subscribeToState(callback) {
  return onSnapshot(STATE_DOC, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data());
    }
  });
}

export async function saveState(state) {
  await setDoc(STATE_DOC, state);
}

export { db };
