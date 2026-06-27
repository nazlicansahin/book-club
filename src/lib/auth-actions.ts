import {
  GoogleAuthProvider,
  getRedirectResult,
  signInWithCredential,
  signInWithPopup,
  signInWithRedirect,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { Capacitor } from "@capacitor/core";
import { getFirebaseAuth } from "./firebase";

const googleProvider = new GoogleAuthProvider();

function shouldUseRedirect(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  const isMobile = /iPhone|iPad|iPod|Android|Mobile/i.test(ua);
  const isSafari = /Safari/i.test(ua) && !/Chrome|CriOS|FxiOS/i.test(ua);
  return isMobile || isSafari;
}

async function signInWithGoogleNative(): Promise<User | null> {
  const { FirebaseAuthentication } = await import(
    "@capacitor-firebase/authentication"
  );
  const result = await FirebaseAuthentication.signInWithGoogle();
  const idToken = result.credential?.idToken;
  const accessToken = result.credential?.accessToken;
  if (!idToken && !accessToken) {
    throw new Error("Google sign-in was cancelled or did not return a credential.");
  }
  const credential = GoogleAuthProvider.credential(idToken, accessToken);
  const userCred = await signInWithCredential(getFirebaseAuth(), credential);
  return userCred.user;
}

export async function signInWithGoogle(): Promise<User | null> {
  if (Capacitor.isNativePlatform()) {
    return signInWithGoogleNative();
  }

  const auth = getFirebaseAuth();

  if (shouldUseRedirect()) {
    await signInWithRedirect(auth, googleProvider);
    return null;
  }

  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function completeGoogleRedirect(): Promise<User | null> {
  if (Capacitor.isNativePlatform()) return null;
  const auth = getFirebaseAuth();
  const result = await getRedirectResult(auth);
  return result?.user ?? null;
}

export async function signOut() {
  if (Capacitor.isNativePlatform()) {
    const { FirebaseAuthentication } = await import(
      "@capacitor-firebase/authentication"
    );
    await FirebaseAuthentication.signOut().catch(() => undefined);
  }
  await firebaseSignOut(getFirebaseAuth());
}
