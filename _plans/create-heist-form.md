# Implementation Plan: Create Heist Form

## Context

This feature implements the create heist form at `/heists/create` to allow authenticated users to create mission assignments for other team members. Currently, the page is just a stub with a title. This implementation will:

- Enable users to create heist missions with title, description, and assignee selection
- Store heists in Firestore "heists" collection following the `CreateHeistInput` interface
- Auto-save form drafts to localStorage for data preservation
- Filter out the current user from the assignee dropdown (per spec requirement)
- Handle edge cases like no available users and Firestore failures
- Follow existing form patterns established by LoginForm and SignupForm components

The feature enables the core functionality of the app: creating collaborative office missions.

## Implementation Approach

### Phase 1: Create Foundation Components

**1. Create Select Component** (`components/Select/`)

New reusable dropdown component (doesn't exist in codebase). Will be used for user selection.

- Structure: `Select.tsx`, `Select.module.css`, `index.ts` (barrel export)
- Props: `id`, `name`, `label`, `value`, `onChange`, `options: Array<{value, label}>`, `error`, `placeholder`, `required`, `disabled`
- Styling: Match Input component pattern with CSS modules using `@apply` directives
- Pattern: Similar to existing Input component for consistency

**2. Create Textarea Component** (`components/Textarea/`)

New textarea component for description field with character counter.

- Structure: `Textarea.tsx`, `Textarea.module.css`, `index.ts`
- Props: `id`, `name`, `label`, `value`, `onChange`, `error`, `placeholder`, `required`, `disabled`, `rows`, `maxLength`, `showCounter`
- Features: Display character counter (e.g., "245/500"), highlight when near limit
- Styling: Match Input component pattern

### Phase 2: Create Main Form Component

**3. Create CreateHeistForm Component** (`components/CreateHeistForm/`)

Main form following LoginForm/SignupForm pattern.

**State Management:**
```typescript
// Form data
interface FormData {
  title: string;
  description: string;
  assignedTo: string;        // user ID
  assignedToCodename: string; // user codename
}

// Error state
interface FormErrors {
  title: string;
  description: string;
  assignedTo: string;
  general?: string; // Firestore errors
}

// Additional state
- loading: boolean
- users: Array<{id: string, codename: string}>
- usersLoading: boolean
- usersError: string
```

**User Fetching (useEffect on mount):**
- Import: `collection`, `getDocs` from "firebase/firestore"
- Query: `getDocs(collection(db, COLLECTIONS.USERS))`
- Filter: Remove current user (`userId !== user.id`)
- Transform: Map to `{value: id, label: codename}` for Select component
- Handle: Loading state and errors

**Form Validation:**
- Title: Required, min 3 chars, max 100 chars
- Description: Required, min 10 chars, max 500 chars
- AssignedTo: Required (must select a user)
- Trigger: On form submit (following existing pattern)

**Form Submission:**
1. Validate all fields
2. Construct `CreateHeistInput`:
   - `title`, `description` from form
   - `createdBy: user.id` (from useUser hook)
   - `createdByCodename: user.displayName` (from useUser hook)
   - `assignedTo`, `assignedToCodename` from form
   - `createdAt: serverTimestamp()`
   - `deadline: Timestamp.fromMillis(Date.now() + 48 * 60 * 60 * 1000)` (48 hours)
   - `finalStatus: null`
3. Call: `addDoc(collection(db, COLLECTIONS.HEISTS), heistData)`
4. On success: Clear localStorage draft, redirect to `/heists`
5. On error: Display error, keep form data, allow retry

**Auto-save to localStorage:**
- On mount: Load from `localStorage.getItem("heist-draft")`
- On change: Debounced save (1 second) to localStorage
- On success: Clear localStorage

**Edge Cases:**
- No users available: Show message "No users available to assign this heist to" instead of form
- Firestore write fails: Show error message, keep form data
- Form disabled during submission to prevent double-submit

**Imports:**
```typescript
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs, addDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useUser } from "@/lib/auth/useUser";
import { COLLECTIONS } from "@/types/firestore";
import Input from "@/components/Input";
import Textarea from "@/components/Textarea";
import Select from "@/components/Select";
import Button from "@/components/Button";
```

### Phase 3: Integration

**4. Update Create Page** (`app/(dashboard)/heists/create/page.tsx`)

Replace placeholder with CreateHeistForm component:
```typescript
import CreateHeistForm from "@/components/CreateHeistForm";

export default function CreateHeistPage() {
  return (
    <div className="center-content">
      <div className="page-content">
        <h2 className="form-title">Create a New Heist</h2>
        <CreateHeistForm />
      </div>
    </div>
  );
}
```

### Phase 4: Testing

**5. Create Test Files**

Following existing test patterns from `tests/components/`:

- `tests/components/Select.test.tsx`
  - Renders with options
  - Handles selection change
  - Shows error messages
  - Respects disabled state

- `tests/components/Textarea.test.tsx`
  - Renders with character counter
  - Enforces maxLength
  - Shows error messages

- `tests/components/CreateHeistForm.test.tsx`
  - Mock Firestore (`getDocs`, `addDoc`)
  - Mock `useUser` hook
  - Mock Next.js router
  - Test: Form renders all fields
  - Test: Users fetched and displayed (current user filtered)
  - Test: Validation errors for empty/too-short fields
  - Test: Button disabled during submission
  - Test: Calls Firestore with correct data structure
  - Test: Redirects to /heists on success
  - Test: Shows error on Firestore failure
  - Test: Auto-save to localStorage

## Critical Files

**To Create:**
1. `components/Select/Select.tsx` - Dropdown component
2. `components/Textarea/Textarea.tsx` - Textarea with counter
3. `components/CreateHeistForm/CreateHeistForm.tsx` - Main form with Firestore integration
4. `tests/components/Select.test.tsx`
5. `tests/components/Textarea.test.tsx`
6. `tests/components/CreateHeistForm.test.tsx`

**To Modify:**
7. `app/(dashboard)/heists/create/page.tsx` - Import and render CreateHeistForm

**To Reference (Existing Patterns):**
- `components/SignupForm/SignupForm.tsx` - Form pattern with Firestore operations
- `components/Input/Input.tsx` - Input component structure and styling
- `components/Button/Button.tsx` - Button with loading state
- `types/firestore/heist.ts` - `CreateHeistInput` interface
- `types/firestore/index.ts` - `COLLECTIONS` constants
- `lib/auth/useUser.ts` - `useUser()` hook for current user

## Key Technical Details

**Deadline Calculation:**
```typescript
const FORTY_EIGHT_HOURS_MS = 48 * 60 * 60 * 1000;
const deadline = Timestamp.fromMillis(Date.now() + FORTY_EIGHT_HOURS_MS);
```

**User Filtering:**
```typescript
const filteredUsers = allUsers.filter(u => u.id !== user.id);
```

**Auto-save Debounce:**
```typescript
useEffect(() => {
  const timeoutId = setTimeout(() => {
    localStorage.setItem("heist-draft", JSON.stringify(formData));
  }, 1000);
  return () => clearTimeout(timeoutId);
}, [formData]);
```

## Implementation Order

1. **Select component** - Foundation, no dependencies
2. **Textarea component** - Foundation, no dependencies
3. **CreateHeistForm component** - Uses Select and Textarea
4. **Update create page** - Integrates CreateHeistForm
5. **Write tests** - Verify all functionality

## Verification

**Manual Testing:**
1. Start dev server: `npm run dev`
2. Navigate to `http://localhost:3000/heists/create`
3. Verify form loads with all fields
4. Verify dropdown shows users (excluding current user)
5. Test validation errors by submitting empty form
6. Create a test heist and verify:
   - Redirect to `/heists` occurs
   - Check Firestore console for new heist document with correct fields
7. Test auto-save by typing, refreshing page, verify data restored
8. Test edge case: Create heist when no other users exist

**Automated Testing:**
```bash
npm test CreateHeistForm
npm test Select
npm test Textarea
```

**Firestore Verification:**
- Check Firebase console for "heists" collection
- Verify document contains all required fields from `CreateHeistInput`
- Verify `createdAt` is a Firestore Timestamp
- Verify `deadline` is ~48 hours after `createdAt`
- Verify `finalStatus` is null
