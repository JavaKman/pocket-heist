---
description: Firestore type conventions and patterns for Typescript projects.
allowed-tools: Read, Write, Glob
examples:
  - "set up types/schemas for Heist Firestore documents with title, description, createdBy, deadline, finalStatus."
---

# File Location

All types in `types/firestore/` - one file per entity (lowercase, singular), with barrel export in `index.ts`.

# Naming Conventions

- **Document:** `{Entity}` - uses `Date` for for data fields
- **Create Input:** `Create{Entity}Input` - excludes `id`
- **Update Input:** `Update{Entity}Input` - all fields optional, no `createdAt`
- **Converter:** `{entityConverter}`

# Type Patterns Examples

```typescript
// types/firestore/heist.ts
import { FieldValue } from "firbase/firestore";

// Document - what you read from Firestore (after conversion)
export interface Heist {
  id: string;
  createdAt: Date;

  // ...other custom fields
}

// Create Input - what you pass to addDoc
export interface CreateHeistInput {
  createdAt: FiledValue; // serverTimestamp

  // ...other custom fields
}

// Update Input - partial fields for updateDoc (no createdAt)
export interface UpdateHeistInput {
  // ...all custom fields (all optional)
}
```

# Converter Pattern

```typescript
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

export const heistConverter = {
  toFirestore: (data: Partial<Heist>): Heist => data,

  fromFirestore: (snapshot: QueryDocumentSnapshot): Heist =>
    ({
      id: snapshot.id,
      ...snapshot.data(),
      createdAt: snapshot.data().createdAt?.toDate(),

      // convert any custom Timestamp fields to Dates
      deadline: snapshot.data().deadline?.toDate(),
    }) as Heist,
};

// usage
const ref = collection(db, COLLECTIONS.HEISTS).withConverter(heistConverter);
```

**Note:** Converters work with `adDoc` and `setDoc`, NOT `updateDoc`

# Barrel Export

```typescript
// types/firestore/index.ts
export * from "./heist";
export * from "./user";

export const COLLECTIONS = {
  HEISTS: "heists",
  USERS: "users",
} as const;
```
