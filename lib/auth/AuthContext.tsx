"use client";

import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { User, AuthContextValue, transformFirebaseUser } from "./types";

/**
 * React Context for authentication state
 * Provides user and loading state to all descendant components
 */
export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

/**
 * Authentication Provider Component
 * Sets up Firebase auth state listener and manages global auth state
 *
 * @param children - Child components that will have access to auth state
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    /**
     * Firebase auth state listener
     * Automatically fires when:
     * - Component mounts (reads persisted session)
     * - User logs in
     * - User logs out
     * - Session expires
     * - Auth state changes in another tab (with persistence)
     */
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        setUser(transformFirebaseUser(firebaseUser));
      } else {
        // User is signed out
        setUser(null);
      }

      // Loading complete after first auth state check
      setLoading(false);
    });

    // Cleanup: Unsubscribe when component unmounts
    return () => unsubscribe();
  }, []); // Empty dependency array - listener set up once on mount

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
