# Plan: Route Protection with useUser Hook

## Context

Currently, all routes in the Pocket Heist app are accessible to everyone. The authentication infrastructure (useUser hook, AuthProvider, Firebase integration) is fully implemented and working, but there's no route protection enforcing access rules. This means:

- Authenticated users can access login/signup pages (shouldn't be able to)
- Unauthenticated users can access the heists dashboard (shouldn't be able to)
- No loading state is shown while Firebase checks authentication status, causing potential content flashing

This plan implements route protection by creating client-side "guard" components that wrap the children of both route group layouts. The guards will use the existing `useUser` hook to check authentication state and redirect users appropriately, while displaying a loading spinner until the auth state is determined.

**Design Choice:** We'll keep the layouts as server components (Next.js best practice) and create separate client guard components for the auth logic. This follows the existing pattern in `app/provider.tsx` where a client wrapper provides context.

## Implementation Steps

### 1. Create Spinner Component

**File: `components/Spinner/Spinner.tsx`**

- Client component using Clock8 icon from lucide-react (matches app branding)
- Rotates continuously with CSS animation
- Size: 48px, primary color, centered with `.center-content` class
- Includes aria-label for accessibility

**File: `components/Spinner/Spinner.module.css`**

- `@keyframes spin` animation: 0deg → 360deg
- 1s duration, linear timing, infinite
- Applied to Clock8 icon with primary color

**File: `components/Spinner/index.ts`**

- Barrel export: `export { default } from './Spinner'`

### 2. Create PublicGuard Component

**File: `app/(public)/PublicGuard.tsx`**

- Client component ("use client")
- Uses `useUser()` hook and `useRouter()` from next/navigation
- State machine:
  - `loading = true` → render `<Spinner />`
  - `loading = false && user exists` → `router.replace('/heists')` + render `<Spinner />`
  - `loading = false && user = null` → render children (allow access)
- `useEffect` with dependencies `[loading, user, router]` handles redirect
- Prevents content flashing by never rendering children when unauthorized

### 3. Create DashboardGuard Component

**File: `app/(dashboard)/DashboardGuard.tsx`**

- Client component (mirrors PublicGuard structure)
- Uses `useUser()` hook and `useRouter()` from next/navigation
- State machine:
  - `loading = true` → render `<Spinner />`
  - `loading = false && user = null` → `router.replace('/login')` + render `<Spinner />`
  - `loading = false && user exists` → render children (allow access)
- `useEffect` with dependencies `[loading, user, router]` handles redirect
- Inverted logic from PublicGuard: protects authenticated routes

### 4. Update Public Layout

**File: `app/(public)/layout.tsx`**

- Import `PublicGuard` component
- Wrap existing `<main className="public">` structure with `<PublicGuard>`
- Layout remains a server component
- Structure:
  ```tsx
  <PublicGuard>
    <main className="public">{children}</main>
  </PublicGuard>
  ```

### 5. Update Dashboard Layout

**File: `app/(dashboard)/layout.tsx`**

- Import `DashboardGuard` component
- Wrap existing Navbar + main structure with `<DashboardGuard>`
- Layout remains a server component
- Structure:
  ```tsx
  <DashboardGuard>
    <Navbar />
    <main>{children}</main>
  </DashboardGuard>
  ```

### 6. Write Tests

**File: `tests/components/Spinner.test.tsx`**

- Renders Clock8 icon
- Has spinning animation class
- Uses center-content layout
- Proper aria-label for accessibility

## Critical Files

### New Files (8 total)

1. `components/Spinner/Spinner.tsx` - Loading spinner with Clock8 icon
2. `components/Spinner/Spinner.module.css` - Rotation animation
3. `components/Spinner/index.ts` - Barrel export
4. `app/(public)/PublicGuard.tsx` - Public route protection logic
5. `app/(dashboard)/DashboardGuard.tsx` - Dashboard route protection logic
6. `tests/components/Spinner.test.tsx` - Spinner component tests
7.

### Modified Files (2 total)

1. `app/(public)/layout.tsx` - Wrap children with PublicGuard
2. `app/(dashboard)/layout.tsx` - Wrap children with DashboardGuard

## Verification

### Manual Testing Workflow

1. **Initial Load States**
   - Start dev server: `npm run dev`
   - Navigate to `/` - should see spinner briefly, then home page (if not logged in)
   - Navigate to `/heists` - should see spinner briefly, then redirect to `/login` (if not logged in)

2. **Public Route Protection**
   - Log in via `/login`
   - Try navigating to `/login` - should redirect to `/heists`
   - Try navigating to `/signup` - should redirect to `/heists`
   - Try navigating to `/` - should redirect to `/heists`
   - Verify no content flashing occurs

3. **Dashboard Route Protection**
   - Log out
   - Try navigating to `/heists` - should redirect to `/login`
   - Try navigating to `/heists/create` - should redirect to `/login`
   - Try direct URL access - protection should work
   - Verify spinner shows during loading

4. **Edge Cases**
   - Sign in while on public page → should redirect to `/heists`
   - Sign out while on dashboard page → should redirect to `/login`
   - Test browser back/forward buttons → protection should persist
   - Open multiple tabs → auth state should sync across tabs

5. **Loading States**
   - Throttle network in DevTools (Slow 3G)
   - Navigate between routes
   - Verify spinner appears during auth checks
   - Verify no content flashing occurs

### Automated Testing

Run test suite:

```bash
npm test
```

Expected results:

- All Spinner component tests pass
- All PublicGuard tests pass (5 test cases)
- All DashboardGuard tests pass (5 test cases)
- No regressions in existing tests

### Acceptance Criteria Checklist

- [ ] Authenticated users cannot access `/`, `/login`, or `/signup` (redirect to `/heists`)
- [ ] Unauthenticated users cannot access `/heists/*` routes (redirect to `/login`)
- [ ] Loading spinner displays while auth state is being determined
- [ ] No content flashing occurs (children only render after auth check passes)
- [ ] Redirects work for direct URL access, navigation, and back/forward buttons
- [ ] Route protection responds immediately to sign in/sign out actions
- [ ] All tests pass with comprehensive coverage
