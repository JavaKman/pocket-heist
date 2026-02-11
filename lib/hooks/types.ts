import { Heist } from "@/types/firestore";

export type HeistFilterType = "active" | "assigned" | "expired";

export interface UseHeistsReturn {
  heists: Heist[];
  loading: boolean;
}
