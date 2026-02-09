"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/auth/useUser";
import Spinner from "@/components/Spinner";

export default function PublicGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/heists");
    }
  }, [loading, user, router]);

  // Show spinner while loading
  if (loading) {
    return <Spinner />;
  }

  // Show spinner while redirecting authenticated users
  if (user) {
    return <Spinner />;
  }

  // Render children for unauthenticated users
  return <>{children}</>;
}
