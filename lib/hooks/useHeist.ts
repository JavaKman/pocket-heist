"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { COLLECTIONS, Heist, heistConverter } from "@/types/firestore";

interface UseHeistReturn {
  heist: Heist | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Custom hook to fetch a single heist from Firestore with real-time updates
 *
 * @param heistId - The ID of the heist to fetch
 * @returns Object containing heist, loading state, and error
 *
 * @example
 * ```tsx
 * const { heist, loading, error } = useHeist('abc123');
 *
 * if (loading) return <Spinner />;
 * if (error) return <div>Error: {error.message}</div>;
 * if (!heist) return <div>Heist not found</div>;
 *
 * return <div>{heist.title}</div>;
 * ```
 */
export function useHeist(heistId: string | null | undefined): UseHeistReturn {
  const [heist, setHeist] = useState<Heist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Reset state when heistId changes
    setHeist(null);
    setLoading(true);
    setError(null);

    // Early return if no heistId provided
    if (!heistId) {
      setLoading(false);
      return;
    }

    // Use a flag to track if component is still mounted
    let isMounted = true;

    // Set up document reference with converter
    const heistRef = doc(db, COLLECTIONS.HEISTS, heistId).withConverter(
      heistConverter
    );

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(
      heistRef,
      (snapshot) => {
        if (!isMounted) return;

        if (snapshot.exists()) {
          setHeist(snapshot.data());
          setError(null);
        } else {
          setHeist(null);
          setError(null);
        }
        setLoading(false);
      },
      (err) => {
        if (!isMounted) return;
        console.error(`Failed to fetch heist ${heistId}:`, err);
        setError(err as Error);
        setHeist(null);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount or when heistId changes
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [heistId]);

  return { heist, loading, error };
}
