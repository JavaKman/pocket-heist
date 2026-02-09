"use client";

import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { AuthContextValue } from "./types";

/**
 * Hook to access current authentication state
 *
 * @returns Object containing user and loading state
 * @throws Error if used outside AuthProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { user, loading } = useUser();
 *
 *   if (loading) return <div>Loading...</div>;
 *   if (!user) return <div>Please log in</div>;
 *   return <div>Welcome, {user.email}</div>;
 * }
 * ```
 */
export function useUser(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useUser must be used within an AuthProvider");
  }

  return context;
}
