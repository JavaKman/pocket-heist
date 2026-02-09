# Implementation Plan: Add Logout Button to Navbar

## Context

The application currently has a complete Firebase authentication system with login and signup functionality,
but users have no way to log out. This plan implements a logout button in the Navbar component that appears
when a user is authenticated and triggers Firebase sign-out when clicked.

**User Requirements** (from `_specs/navbar-logout-button.md`):

- Add logout button to Navbar, positioned left of "Create Heist" button
- Only show when user is logged in
- Use Firebase signOut on click
- Button should be disabled during logout (no loading spinner needed)
- No confirmation dialog required
- Match Figma design specifications (gradient purple-to-pink button with icon)

**Current State**:

- Authentication infrastructure fully functional (`lib/auth/` with AuthContext, useUser hook)
- Navbar is static component with no auth state integration
- Gradient button styling (`.btn` class) already exists and matches Figma spec perfectly
- No signOut function exported from auth module

## Files to Modify

### 1. `lib/auth/index.ts`

**Purpose**: Add and export signOut function

**Changes**:

- Import `signOut as firebaseSignOut` from `firebase/auth`
- Import `auth` instance from `@/lib/firebase`
- Create async signOut wrapper function: `export async function signOut(): Promise<void> { await firebaseSignOut(auth); }`
- Add to barrel exports

**Why**: Centralizes Firebase auth operations following existing auth module pattern

### 2. `components/Navbar/Navbar.tsx`

**Purpose**: Add logout button with conditional rendering

**Changes**:

1. Add `"use client"` directive at top (required for React hooks)
2. Import `useState` from `react`
3. Import `LogOut` icon from `lucide-react`
4. Import `useUser` and `signOut` from `@/lib/auth`
5. Add auth state: `const { user } = useUser()`
6. Add local state: `const [isLoggingOut, setIsLoggingOut] = useState(false)`
7. Create handleLogout function:
   ```typescript
   const handleLogout = async () => {
     setIsLoggingOut(true);
     try {
       await signOut();
     } finally {
       setIsLoggingOut(false);
     }
   };
   ```
8. Add logout button JSX inside `<ul>` before existing "Create Heist" li:
   ```tsx
   {
     user && (
       <li>
         <button className={styles.btn} onClick={handleLogout} disabled={isLoggingOut} aria-label="Log out">
           <LogOut size={20} strokeWidth={2} />
           Log Out
         </button>
       </li>
     );
   }
   ```

**Why**: Reuses existing `.btn` class, follows conditional rendering pattern, handles disabled state per spec

### 3. `components/Navbar/Navbar.module.css`

**Purpose**: Make buttons display horizontally

**Changes**:

- Add new rule for `.siteNav ul`:
  ```css
  .siteNav ul {
    @apply flex items-center gap-2;
  }
  ```

**Why**: By default, `<ul>` stacks `<li>` vertically. This makes logout and create buttons sit side-by-side with 8px gap.

### 4. `tests/components/Navbar.test.tsx`

No need for mocks

**Purpose**: Add test coverage for logout functionality

**Changes**:

2. Import `userEvent` from `@testing-library/user-event`

3. Add 5 new test cases:
   - "renders logout button when user is authenticated"
   - "does not render logout button when user is not authenticated"
   - "calls signOut when logout button is clicked"
   - "logout button has correct styling and text content"
   - "logout button appears left of create button"

**Why**: Covers authenticated/unauthenticated states, interaction behavior, positioning, and styling per spec testing guidelines

## Implementation Steps

### Step 1: Add signOut to Auth Module

1. Open `lib/auth/index.ts`
2. Add imports for Firebase signOut and auth instance
3. Create signOut wrapper function
4. Export function
5. Verify no TypeScript errors

### Step 2: Update Navbar Component

1. Open `components/Navbar/Navbar.tsx`
2. Add `"use client"` directive at line 1
3. Add all required imports (useState, LogOut, useUser, signOut)
4. Add auth state and isLoggingOut state inside component
5. Create handleLogout async function
6. Insert logout button JSX in `<ul>` before existing `<li>` (after line 18)
7. Verify TypeScript types are correct

### Step 3: Update Navbar Styles

1. Open `components/Navbar/Navbar.module.css`
2. Add `.siteNav ul` rule with flex styling
3. Verify gradient button styling still works

### Step 4: Add Tests

1. Open `tests/components/Navbar.test.tsx`
2. Write 5 test cases covering all spec requirements
3. Run `npm test` to verify tests pass
4. Verify existing tests still pass

### Step 5: Manual Verification

1. Run `npm run dev`
2. Navigate to `/login` - verify no logout button (not authenticated)
3. Log in with test credentials
4. Navigate to `/heists` - verify logout button appears left of Create button
5. Verify button matches Figma design (gradient, icon, text)
6. Click logout button - verify it disables during logout
7. Verify successful logout and auth state update
8. Run `npm run lint` to verify no linting errors

## Reusable Patterns & Components

**Existing patterns to leverage**:

- `.btn` class in `Navbar.module.css` (lines 19-27) - already matches Figma spec perfectly
  - Gradient: `linear-gradient(90deg, #9810fa 0%, #e60076 100%)`
  - Height: 40px, padding: 16px horizontal
  - Rounded corners: 10px
  - Hover opacity: 0.9
- `useUser()` hook from `lib/auth/useUser.ts` - returns `{ user, loading }`
- Auth state pattern used in LoginForm/SignupForm components
- Icon sizing convention: 20px for navbar buttons (see Plus icon)

**Files providing reference patterns**:

- `components/LoginForm/LoginForm.tsx` - async auth operations with loading state
- `components/Button/Button.tsx` - disabled state handling

## Verification Steps

### Automated Testing

```bash
npm test                    # All tests pass including 5 new Navbar tests
npm run lint                # No linting errors
```

### Manual Testing Checklist

- [ ] Logout button visible in navbar when authenticated
- [ ] Logout button NOT visible when not authenticated
- [ ] Button positioned left of "Create Heist" button
- [ ] Button has gradient background (purple to pink)
- [ ] LogOut icon displays correctly (20px)
- [ ] Button text reads "Log Out"
- [ ] Hover state works (opacity: 0.9)
- [ ] Clicking button disables it immediately
- [ ] Sign-out completes successfully
- [ ] Auth state updates (useUser returns null)
- [ ] No console errors during logout
- [ ] Button is keyboard accessible (tab + enter)
- [ ] Aria-label works for screen readers

### Edge Cases to Verify

- Rapid clicking logout button - should be prevented by disabled state
- Auth state changes (Firebase listener updates context automatically)
- Component behavior when auth is loading - button doesn't show until user is confirmed

## Open Questions

None - spec has been clarified by user:

- No loading state needed on button (just disabled) ✓
- No confirmation dialog ✓
- Button position: left of create button ✓
- Firebase signOut method to be used ✓
