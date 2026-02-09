import { User as FirebaseUser } from "firebase/auth";

/**
 * Application user interface derived from Firebase User
 * Contains essential user properties needed throughout the app
 */
export interface User {
  /** Firebase user ID */
  id: string;

  /** User email address */
  email: string;

  /** User display name (optional, may be null) */
  displayName: string | null;
}

/**
 * Auth context value provided to consuming components
 * Contains current user state and loading indicator
 */
export interface AuthContextValue {
  /** Current authenticated user or null if logged out */
  user: User | null;

  /** Loading indicator - true during initial auth state check */
  loading: boolean;
}

/**
 * Transform Firebase User to application User interface
 * @param firebaseUser - Firebase user object
 * @returns Application user object
 */
export function transformFirebaseUser(firebaseUser: FirebaseUser): User {
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || "",
    displayName: firebaseUser.displayName,
  };
}
