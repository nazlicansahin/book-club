"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase";
import { getUserProfile, type UserProfile } from "@/lib/users";
import { signInWithGoogle, signOut as authSignOut } from "@/lib/auth-actions";
import { setStoredCharacter } from "@/lib/player-store";

type AuthContextValue = {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  configured: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const configured = isFirebaseConfigured();

  const refreshProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      return;
    }
    const next = await getUserProfile(user.uid);
    setProfile(next);
  }, [user]);

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      return;
    }

    const auth = getFirebaseAuth();
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      if (nextUser) {
        const nextProfile = await getUserProfile(nextUser.uid);
        setProfile(nextProfile);
        if (nextProfile?.characterId) {
          setStoredCharacter(nextProfile.characterId);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [configured]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      loading,
      configured,
      signInWithGoogle: async () => {
        const nextUser = await signInWithGoogle();
        const nextProfile = await getUserProfile(nextUser.uid);
        setUser(nextUser);
        setProfile(nextProfile);
      },
      signOut: async () => {
        await authSignOut();
        setUser(null);
        setProfile(null);
      },
      refreshProfile,
    }),
    [user, profile, loading, configured, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
