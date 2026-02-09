# Implementation Plan: Auth State Management with useUser Hook

## Context

The Pocket Heist app currently has Firebase authentication set up with working login and signup forms. However, there's no global state management for authentication. This means:

- Components can't check if a user is logged in without directly querying Firebase
- The home page (`app/(public)/page.tsx`) can't redirect based on auth status (commented in code: "should redirect to /heists when logged in, /login when not")
- Dashboard routes aren't protected from unauthenticated access

**What exists today:**

- `lib/firebase.ts` - Firebase initialized, exports `auth` object
- `LoginForm` - Uses `signInWithEmailAndPassword`, redirects to `/heists`
- `SignupForm` - Uses `createUserWithEmailAndPassword`, redirects to `/heists`

**What's missing:**

- Global React Context for auth state
- `useUser` hook to access auth state from any component
- Provider wrapper in the app root layout
- Firebase `onAuthStateChanged` listener for real-time updates

This feature will enable the entire app to react to authentication changes in real-time, implementing the routing logic already specified in the home page comments.

---

## File Structure

```
lib/
└── auth/
    ├── types.ts           # User interface and AuthContextValue types
    ├── AuthContext.tsx    # React Context provider with Firebase listener
    ├── useUser.ts         # Hook for accessing auth state
    └── index.ts           # Barrel exports

app/
└── provider.tsx          # Client component wrapper for AuthProvider

```

### User Object Shape

```typescript
interface User {
  id: string;
  email: string;
  displayName: string | null;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
}
```

## Implementation Approach

### Phase 1: Create Auth State Infrastructure

**1. Create type definitions** (`lib/auth/types.ts`)

- `User` interface with `id`, `email`, `displayName` properties
- `AuthContextValue` interface with `user` and `loading` properties
- `transformFirebaseUser` utility to convert Firebase User to app User

**2. Create AuthContext and Provider** (`lib/auth/AuthContext.tsx`)

- Mark as client component with `"use client"`
- Create React Context with default value `{ user: null, loading: true }`
- `AuthProvider` component that:
  - Uses `useState` to track `user` (User | null) and `loading` (boolean)
  - Sets up Firebase `onAuthStateChanged` listener in `useEffect`
  - Updates state when Firebase auth changes (login, logout, session restore)
  - Cleans up listener on unmount
  - Provides context value to children

**3. Create useUser hook** (`lib/auth/useUser.ts`)

- Mark as client component with `"use client"`
- Consume AuthContext with `useContext`
- Throw error if used outside AuthProvider
- Return `{ user, loading }` from context

**4. Create barrel exports** (`lib/auth/index.ts`)

- Export types: `User`, `AuthContextValue`
- Export components: `AuthProvider`, `AuthContext`
- Export hook: `useUser`

### Phase 2: Integrate with Next.js App

**5. Create Providers wrapper** (`app/provider.tsx`)

- Mark as client component with `"use client"`
- Import `AuthProvider` from `@/lib/auth`
- Create `Providers` component that wraps children with `<AuthProvider>`
- Allows root layout to remain a server component

**6. Update root layout** (`app/layout.tsx`)

- Import `Providers` from `./provider`
- Wrap `{children}` with `<Providers>` component
- Keep as server component (no "use client" directive)

### Phase 3: Implement Auth-Based Routing

**7. Update home page** (`app/(public)/page.tsx`)

- Add `"use client"` directive
- Import `useUser` hook and `useRouter`
- Use `useEffect` to redirect based on auth state:
  - If `loading`, don't redirect yet
  - If `user` exists, redirect to `/heists`
  - If no user, redirect to `/login`
- Show splash screen during redirect

**8. (Optional) Protect dashboard routes** (`app/(dashboard)/layout.tsx`)

- Add `"use client"` directive
- Use `useUser` hook to check auth state
- Redirect to `/login` if not authenticated
- Show loading state during auth check

### Phase 4: Testing

**9. Create useUser hook tests** (`tests/lib/auth/useUser.test.tsx`)

- Test hook returns user and loading from context
- Test hook returns null when not authenticated
- Test hook returns loading true during initialization
- Test hook throws error outside provider

**10. Create AuthContext tests** (`tests/lib/auth/AuthContext.test.tsx`)

- Mock Firebase `onAuthStateChanged`
- Test loading state on mount
- Test auth state updates on login/logout
- Test listener cleanup on unmount
- Test user object transformation

---

## Critical Files

### New Files to Create

1. **`lib/auth/types.ts`** - TypeScript interfaces and user transformation utility
2. **`lib/auth/AuthContext.tsx`** - Context provider with Firebase listener (core implementation)
3. **`lib/auth/useUser.ts`** - Hook for accessing auth state (main API)
4. **`lib/auth/index.ts`** - Barrel exports
5. **`app/provider.tsx`** - Client-side providers wrapper
6. **`tests/lib/auth/useUser.test.tsx`** - Hook tests
7. **`tests/lib/auth/AuthContext.test.tsx`** - Provider tests

### Existing Files to Modify

1. **`app/layout.tsx`** - Add `<Providers>` wrapper around children
2. **`app/(public)/page.tsx`** - Add routing logic with useUser hook
3. **`app/(dashboard)/layout.tsx`** - (Optional) Add route protection

---

## Key Implementation Details

### Firebase Listener Pattern

```typescript
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      setUser(transformFirebaseUser(firebaseUser));
    } else {
      setUser(null);
    }
    setLoading(false);
  });

  return () => unsubscribe(); // Cleanup on unmount
}, []);
```

**Why this works:**

- `onAuthStateChanged` fires immediately on mount with persisted session
- Fires automatically when user logs in/out
- Handles session expiry and multi-tab sync
- Returns unsubscribe function for cleanup

### User Transformation

```typescript
function transformFirebaseUser(firebaseUser: FirebaseUser): User {
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || "",
    displayName: firebaseUser.displayName,
  };
}
```

**Why transform:** Separates Firebase types from app types, making it easier to change auth providers or add custom fields later.

### Loading State Handling

- Initial state: `loading: true, user: null`
- After first auth check: `loading: false, user: User | null`
- Components should wait for `loading: false` before redirecting

### Server vs Client Components

- **Server components:** `app/layout.tsx` (has metadata export)
- **Client components:** Anything using hooks (`useUser`, `useRouter`, `useState`)
- **Pattern:** Use `app/provider.tsx` to keep root layout as server component

---

## Reusable Utilities

### Existing Firebase Setup

- **File:** `lib/firebase.ts`
- **Exports:** `auth` (initialized Firebase Auth instance)
- **Usage:** Import in `lib/auth/AuthContext.tsx` for `onAuthStateChanged`

### Existing Form Redirects

- **Files:** `components/LoginForm/LoginForm.tsx`, `components/SignupForm/SignupForm.tsx`
- **Pattern:** Manual redirect with `router.push('/heists')` after successful auth
- **Decision:** Keep the manual redirects for immediate feedback (better UX), auth listener will also update global state

---

## Testing Strategy

### Mock Firebase Auth

```typescript
const mockOnAuthStateChanged = vi.fn();
vi.mock("firebase/auth", () => ({
  onAuthStateChanged: (...args: any[]) => mockOnAuthStateChanged(...args),
}));
```

### Test Cases

**Hook Tests:**

- Returns correct values from context
- Throws error outside provider
- Handles null user state
- Handles loading state

**Provider Tests:**

- Shows loading initially
- Updates on auth changes
- Cleans up listener
- Transforms user correctly

### Manual Testing Checklist

- [ ] User logs in → redirected to /heists
- [ ] User logs out → redirected to /login
- [ ] Page refresh → auth state persisted
- [ ] Home page → redirects based on auth
- [ ] Dashboard → protected from unauthenticated users
- [ ] Multi-tab → logout in one tab affects others

---

## Verification

### Build & Type Checking

```bash
npm run build  # Verify TypeScript compilation
```

### Testing

```bash
npm test      # Run all tests including new auth tests
npm run lint  # Check for linting issues
```

### Manual Testing

1. Start dev server: `npm run dev`
2. Navigate to `/` → should redirect to `/login`
3. Sign up new user → should redirect to `/heists`
4. Refresh page → should stay logged in
5. Open in new tab → should be logged in
6. Log out in one tab → other tab should update
7. Check console for errors/warnings

### Success Criteria

- [ ] `useUser` hook available throughout app via `import { useUser } from "@/lib/auth"`
- [ ] Hook returns `{ user: User | null, loading: boolean }`
- [ ] Home page redirects logged-in users to `/heists`
- [ ] Home page redirects logged-out users to `/login`
- [ ] Auth state persists across page refreshes
- [ ] All tests pass (`npm test`)
- [ ] No TypeScript errors (`npm run build`)
- [ ] No console warnings or errors
- [ ] No linting errors (`npm run lint`)

---

## Edge Cases Handled

1. **Loading State:** Components wait for `loading: false` before rendering auth-dependent UI
2. **Session Expiry:** Firebase listener automatically fires with null user
3. **Network Issues:** Loading state persists until Firebase resolves auth
4. **Component Unmount:** React/Firebase handle cleanup automatically
5. **Multi-tab Sync:** Firebase persistence syncs across tabs via IndexedDB
6. **Page Refresh:** Firebase reads persisted session automatically
7. **Null Display Name:** Type system allows `displayName: string | null`

---

## Out of Scope (Future Enhancements)

- Error handling for auth initialization failures (spec says "not for now")
- Sign out button/method (can use Firebase directly for now)
- User profile updates listener
- Role-based access control
- Custom error boundary for auth errors
- DO not use the hook anywhere in the application yet
