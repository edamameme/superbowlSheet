import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, onSnapshot, updateDoc, arrayUnion, getDoc } from "firebase/firestore";

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
  console.log('Subscribing to Firestore document:', STATE_DOC.path);
  return onSnapshot(STATE_DOC, (snapshot) => {
    console.log('Firestore snapshot received, exists:', snapshot.exists());
    if (snapshot.exists()) {
      console.log('Firestore data:', snapshot.data());
      callback(snapshot.data());
    } else {
      console.log('No data in Firestore yet');
    }
  }, (error) => {
    console.error('Firestore subscription error:', error);
  });
}

export async function saveState(state) {
  try {
    console.log('Saving to Firestore:', state);
    await setDoc(STATE_DOC, state, { merge: true });
    console.log('Successfully saved to Firestore');
  } catch (error) {
    console.error('Error saving to Firestore:', error);
    throw error;
  }
}

export { db };
