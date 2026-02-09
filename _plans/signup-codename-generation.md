# Implementation Plan: Signup Codename Generation

## Context

Enhance the signup flow to automatically generate a unique, fun codename for each new user. After successful account creation, the system will:

1. Generate a random PascalCase codename from 3 unique words (Adjective + Noun + Verb)
2. Store it as the user's `displayName` in Firebase Auth
3. Create a Firestore document at `users/{uid}` with the codename
4. Handle Firestore failures gracefully (log error but don't block signup)
5. Redirect to heists page only after all operations complete

## Implementation Approach

No need for mocks.

### Phase 1: Create Codename Generator (Foundation)

**Create `lib/auth/codename/words.ts`**

- Export three arrays: `ADJECTIVES`, `NOUNS`, `VERBS`
- Each array should contain 50+ words for variety
- Words should be fun, spy/heist-themed, short (3-10 characters)
- Example words:
  - ADJECTIVES: "Swift", "Silent", "Clever", "Bold", "Shadow", "Mystic", "Crafty", "Sly", "Nimble", "Stealthy"
  - NOUNS: "Phantom", "Viper", "Raven", "Fox", "Wolf", "Tiger", "Cobra", "Hawk", "Panther", "Falcon"
  - VERBS: "Strikes", "Prowls", "Dances", "Whispers", "Glides", "Leaps", "Vanishes", "Soars", "Hunts", "Creeps"

**Create `lib/auth/codename/generator.ts`**

- Export `generateCodename()` function that:
  - Randomly selects one word from each array
  - Ensures all 3 words are unique (no duplicates within a single codename)
  - Concatenates them in PascalCase format
  - Returns string like "SwiftPhantomStrikes"
- Use `Math.random()` for selection
- Use a Set to track used words and retry if duplicate selected
- Does NOT check Firestore for uniqueness (per spec requirements)

**Create `lib/auth/codename/index.ts`**

- Barrel export: `export { generateCodename } from './generator'`

### Phase 2: Update SignupForm Component

**File: `components/SignupForm/SignupForm.tsx`**

**Add imports:**

```typescript
import { updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { generateCodename } from "@/lib/auth/codename";
```

**Modify handleSubmit (lines 53-85):**

Current code (line 63):

```typescript
await createUserWithEmailAndPassword(auth, formData.email, formData.password);
router.push("/heists");
```

Replace with:

```typescript
// Step 1: Create Firebase Auth account
const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);

// Step 2: Generate codename
const codename = generateCodename();

// Step 3: Update Firebase Auth profile with codename
await updateProfile(userCredential.user, {
  displayName: codename,
});

// Step 4: Create Firestore user document (fail gracefully)
try {
  await setDoc(doc(db, "users", userCredential.user.uid), {
    id: userCredential.user.uid,
    codename: codename,
  });
} catch (firestoreError) {
  // Log error but don't block signup flow
  console.error("Failed to create Firestore user document:", firestoreError);
}

// Step 5: Redirect to heists page
router.push("/heists");
```

**Error handling:**

- Firestore write is wrapped in try-catch
- updateProfile failures will be caught by outer catch block
- Existing Firebase Auth error handling remains unchanged

### Phase 3: Create Tests

**Create `tests/lib/auth/codename/generator.test.ts`**

Test cases:

- Generates a valid string codename
- Codename is in PascalCase format (starts with uppercase, no spaces/hyphens)
- Multiple calls generate different codenames (test randomness)
- Codename has reasonable length (9-50 characters)
- Codename contains 3 uppercase letters (3 word boundaries)

### Phase 4: Update Firebase Exports (Optional)

**File: `lib/firebase.ts`**

The component can import directly from `firebase/auth` and `firebase/firestore`, but for consistency, could update imports:

```typescript
import { getAuth, updateProfile } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
```

Then optionally re-export:

```typescript
export { updateProfile } from "firebase/auth";
export { doc, setDoc } from "firebase/firestore";
```

**Note:** This step is optional since SignupForm can import directly from Firebase packages.

## Critical Files

| File                                        | Purpose                            |
| ------------------------------------------- | ---------------------------------- |
| `lib/auth/codename/words.ts`                | Word lists for codename generation |
| `lib/auth/codename/generator.ts`            | Core generation logic              |
| `lib/auth/codename/index.ts`                | Barrel export                      |
| `components/SignupForm/SignupForm.tsx`      | Integration point - lines 63-65    |
| `tests/lib/auth/codename/generator.test.ts` | Unit tests for generator           |

## Implementation Sequence

1. **Create word lists** (`lib/auth/codename/words.ts`)
2. **Create generator** (`lib/auth/codename/generator.ts` and `index.ts`)
3. **Write generator tests** (`tests/lib/auth/codename/generator.test.ts`)
4. **Run generator tests** to validate: `npm test generator.test.ts`
5. **Update SignupForm** (`components/SignupForm/SignupForm.tsx`)
6. **Run all tests**: `npm test`
7. **Manual testing** in dev environment

## Verification

### Automated Testing

```bash
npm test
```

All tests should pass:

- Generator unit tests (5 tests)

### Manual Testing

```bash
npm run dev
```

1. Navigate to http://localhost:3000/signup
2. Create a new account with email/password
3. Verify:
   - Loading state shows during signup
   - Redirect to /heists occurs
   - Check Firebase Console:
     - Auth user has `displayName` set to codename
     - Firestore `users` collection has document with `{id, codename}`
   - Codename is in PascalCase format with 3 words
4. Test Firestore failure scenario (if possible):
   - Check browser console for error log
   - Verify signup still succeeds

### Expected Behavior

✅ User can successfully sign up with email/password
✅ Codename is generated in format like "SwiftPhantomStrikes"
✅ Firebase Auth profile displayName is set to codename
✅ Firestore document created at `users/{uid}` with `{id, codename}`
✅ User redirected to /heists after all operations
✅ If Firestore fails, error logged but signup completes
✅ Existing form validation and error handling unchanged
✅ Loading state persists through entire flow

## Notes

- **No uniqueness validation**: Per spec, don't check if codename already exists in Firestore. With 50+ words per category, collision risk is minimal (125,000+ combinations)
- **Email not stored**: Firestore document only contains `{id, codename}`, not email (per spec)
- **Graceful degradation**: Firestore write wrapped in try-catch so profile update succeeds even if Firestore fails
- **Future enhancement**: Could add retry logic for Firestore writes or allow users to regenerate codenames later
