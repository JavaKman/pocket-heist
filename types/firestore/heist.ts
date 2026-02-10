import { FieldValue, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";

// Document - what you read from Firestore (after conversion)
export interface Heist {
  id: string;
  createdAt: Date;
  title: string;
  description: string;
  createdBy: string; // uid
  createdByCodename: string;
  assignedTo: string; // uid
  assignedToCodename: string;
  deadline: Date; // 48 hours from creation
  finalStatus: null | "success" | "failure";
}

// Create Input - what you pass to addDoc
export interface CreateHeistInput {
  createdAt: FieldValue; // serverTimestamp()
  title: string;
  description: string;
  createdBy: string;
  createdByCodename: string;
  assignedTo: string;
  assignedToCodename: string;
  deadline: FieldValue; // serverTimestamp() + 48 hours from creation
  finalStatus: null;
}

// Update Input - partial fields for updateDoc (no createdAt)
export interface UpdateHeistInput {
  title?: string;
  description?: string;
  createdBy?: string;
  createdByCodename?: string;
  assignedTo?: string;
  assignedToCodename?: string;
  deadline?: Date;
  finalStatus?: null | "success" | "failure";
}

// Converter for Firestore
export const heistConverter = {
  toFirestore: (data: Partial<Heist>): DocumentData => data,

  fromFirestore: (snapshot: QueryDocumentSnapshot): Heist =>
    ({
      id: snapshot.id,
      ...snapshot.data(),
      createdAt: snapshot.data().createdAt?.toDate(),
      deadline: snapshot.data().deadline?.toDate(),
    }) as Heist,
};
