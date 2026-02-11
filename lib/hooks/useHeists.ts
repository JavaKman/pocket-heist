"use client";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  Timestamp,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useUser } from "@/lib/auth";
import { COLLECTIONS, Heist, heistConverter } from "@/types/firestore";
import { HeistFilterType, UseHeistsReturn } from "./types";

/**
 * Custom hook to fetch heists from Firestore with real-time updates
 *
 * @param filterType - Type of heists to fetch:
 *   - 'active': Heists assigned TO the current user where deadline has not passed
 *   - 'assigned': Heists assigned BY the current user (created by) where deadline has not passed
 *   - 'expired': All heists where deadline has passed AND finalStatus is NOT null
 *
 * @returns Object containing heists array and loading state
 *
 * @example
 * ```tsx
 * const { heists, loading } = useHeists('active');
 *
 * if (loading) return <Spinner />;
 * return (
 *   <ul>
 *     {heists.map(heist => (
 *       <li key={heist.id}>{heist.title}</li>
 *     ))}
 *   </ul>
 * );
 * ```
 */
export function useHeists(filterType: HeistFilterType): UseHeistsReturn {
  const { user, loading: authLoading } = useUser();
  const [heists, setHeists] = useState<Heist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait for auth to finish loading or if no user
    if (authLoading || !user) {
      return;
    }

    // Use a flag to track if component is still mounted
    let isMounted = true;

    // Build query constraints based on filter type
    let constraints: QueryConstraint[];

    switch (filterType) {
      case "active":
        // Heists assigned TO current user, not expired
        constraints = [
          where("assignedTo", "==", user.id),
          where("deadline", ">", Timestamp.now()),
        ];
        break;

      case "assigned":
        // Heists created BY current user, not expired
        constraints = [
          where("createdBy", "==", user.id),
          where("deadline", ">", Timestamp.now()),
        ];
        break;

      case "expired":
        // All heists past deadline with final status set
        constraints = [
          where("deadline", "<=", Timestamp.now()),
          where("finalStatus", "!=", null),
        ];
        break;

      default:
        console.error(`Invalid filter type: ${filterType}`);
        return;
    }

    // Set up Firestore query with converter
    const heistsRef = collection(db, COLLECTIONS.HEISTS).withConverter(
      heistConverter
    );
    const q = query(heistsRef, ...constraints);

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!isMounted) return;
        const heistData = snapshot.docs.map((doc) => doc.data());
        setHeists(heistData);
        setLoading(false);
      },
      (error) => {
        if (!isMounted) return;
        console.error(`Failed to fetch ${filterType} heists:`, error);
        setHeists([]);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount or when dependencies change
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [user, authLoading, filterType]);

  return { heists, loading };
}
