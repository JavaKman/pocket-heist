# Spec for Signup Codename Generation

branch: claude/feature/signup-codename-generation

## Summary

Enhance the signup flow to automatically generate a unique, fun codename for each new user and store it in both Firebase Auth (as displayName) and Firestore (in the users collection). This happens immediately after successful user creation but before redirecting to the heists page.

## Functional Requirements

- After `createUserWithEmailAndPassword` resolves successfully in `SignupForm.tsx`, capture the returned user object
- Generate a random PascalCase codename by concatenating 3 unique words from separate word sets
  - Format: `<Adjective><Noun><Verb>` (e.g., "SneakyPandaJumps", "QuickFoxRuns")
  - Each word should come from a different predefined list to ensure variety
  - Words should be randomly selected from their respective lists
  - The three words must be unique (no word used twice in the same codename)
  - Document ID matching the Firebase Auth user ID
  - Email should NOT be stored in Firestore
- Update the user's Firebase Auth profile using `updateProfile(user, { displayName: codename })`
- Create a Firestore document at `users/{uid}` with the following structure:
  ```
  {
    id: uid,
    codename: codename
  }
  ```
- All Firebase operations must use exports from `@/lib/firebase` only
- Only use the Firebase Web SDK (no admin SDK or other Firebase SDKs)
- Complete all operations before calling `router.push("/heists")`
- Handle errors gracefully and display appropriate error messages if profile update or Firestore write fails

## Possible Edge Cases

- Firebase Auth succeeds but `updateProfile` fails - user is created without a displayName
- Firebase Auth and `updateProfile` succeed but Firestore write fails - user profile has displayName but no Firestore document
- Network issues during any of the operations
- Firestore permissions may not be configured yet (development consideration)
- Random word selection could theoretically generate the same word twice if lists overlap
- Codename generation could produce inappropriate combinations (low risk with curated word lists)

## Acceptance Criteria

- User signup creates a Firebase Auth account with email/password
- User's `displayName` in Firebase Auth is set to the generated codename
- A Firestore document exists at `users/{user.uid}` containing `{ id, codename }`
- The codename is in PascalCase format with exactly 3 words concatenated
- All three words in the codename are unique (no duplicates)
- User is redirected to `/heists` only after all operations complete successfully
- Appropriate error messages are shown if any operation fails
- Existing signup form validation and behavior remains unchanged
- Loading state continues to show during the entire signup process including codename generation

## Open Questions

- Should we store additional user metadata in the Firestore document (e.g., email, createdAt timestamp)? No.
- Should the word sets for codename generation be stored in a separate file? yes.
- Should we validate that the generated codename is unique in Firestore before assign it? No.
- What should happen if profile update succeeds but Firestore write fails - should we rollback or continue? log the error.
- Should we allow users to regenerate or customize their codename later? No.

## Testing Guidelines

Create a test file in the ./tests folder for the new feature, and create meaningful tests for the following cases:

- Codename generation produces a valid PascalCase string with 3 words
- All three words in a generated codename are unique
- SignupForm integration test that mocks Firebase calls and verifies:
  - `createUserWithEmailAndPassword` is called with correct parameters
  - `updateProfile` is called with user object and displayName
  - Firestore `setDoc` is called with correct path and data structure
  - Router navigation occurs after all Firebase operations complete
- Error handling when `updateProfile` fails
- Error handling when Firestore write fails
