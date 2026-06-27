import {
  GoogleAuthProvider,
  getRedirectResult,
  signInWithPopup,
  signInWithRedirect,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { getFirebaseAuth } from "./firebase";

const googleProvider = new GoogleAuthProvider();

function shouldUseRedirect(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  const isMobile = /iPhone|iPad|iPod|Android|Mobile/i.test(ua);
  const isSafari = /Safari/i.test(ua) && !/Chrome|CriOS|FxiOS/i.test(ua);
  return isMobile || isSafari;
}

export async function signInWithGoogle(): Promise<User | null> {
  const auth = getFirebaseAuth();

  if (shouldUseRedirect()) {
    await signInWithRedirect(auth, googleProvider);
    return null;
  }

  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function completeGoogleRedirect(): Promise<User | null> {
  const auth = getFirebaseAuth();
  const result = await getRedirectResult(auth);
  return result?.user ?? null;
}

export async function signOut() {
  await firebaseSignOut(getFirebaseAuth());
}
