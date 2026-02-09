import { signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

// Type exports
export type { User, AuthContextValue } from "./types";

// Component exports
export { AuthProvider, AuthContext } from "./AuthContext";

// Hook exports
export { useUser } from "./useUser";

// Auth functions
export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}
