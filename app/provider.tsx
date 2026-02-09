"use client";

import { AuthProvider } from "@/lib/auth";

/**
 * Client-side providers wrapper
 * Consolidates all context providers in one place
 *
 * This pattern allows the root layout to remain a server component
 * while still providing client-side context to the app
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
