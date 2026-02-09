"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/auth/useUser";
import Spinner from "@/components/Spinner";

export default function DashboardGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  // Show spinner while loading
  if (loading) {
    return <Spinner />;
  }

  // Show spinner while redirecting unauthenticated users
  if (!user) {
    return <Spinner />;
  }

  // Render children for authenticated users
  return <>{children}</>;
}
