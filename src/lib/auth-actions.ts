import { GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, type User } from "firebase/auth";
import { getFirebaseAuth } from "./firebase";

const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(getFirebaseAuth(), googleProvider);
  return result.user;
}

export async function signOut() {
  await firebaseSignOut(getFirebaseAuth());
}
