# Spec for Route Protection with useUser Hook

branch: claude/feature/route-protection-with-useuser-hook

## Summary

Implement route protection for the Pocket Heist application using the existing `useUser` hook from Firebase authentication.
Public routes (login, signup, home) should only be accessible to unauthenticated users and redirect authenticated users to `/heists`.
Dashboard routes groups should only be accessible to authenticated users and redirect
unauthenticated users to `/login`. Both route groups should display a loading state while Firebase determines the authentication status.

## Functional Requirements

- **Public Route Protection ((public) group)**
  - Pages: home (`/`), login (`/login`), signup (`/signup`)
  - Only accessible when user is NOT authenticated
  - Redirect authenticated users to `/heists`
  - Show loading indicator until auth state is determined

- **Dashboard Route Protection ((dashboard) group)**
  - Pages: heists list (`/heists`), create heist (`/heists/create`), heist details (`/heists/[id]`)
  - Only accessible when user IS authenticated
  - Redirect unauthenticated users to `/login`
  - Show loading indicator until auth state is determined

- **Loading State**
  - Display a simple, centered loader component while Firebase checks authentication status
  - Loader should be shown in the respective route group layouts
  - Prevent content flash by waiting for auth state to be determined before rendering protected content

- **Auth State Detection**
  - Use the existing `useUser` hook to get current authentication state
  - Hook should provide: user object (or null), loading state
  - Wait for loading to complete before making redirect decisions

- **Redirect Behavior**
  - Redirects should happen immediately after auth state is determined
  - Use Next.js navigation methods for client-side redirects
  - Preserve a clean user experience without content flashing

## Figma Design Reference

Not applicable - this is a logic/functionality feature.

## Possible Edge Cases

- User signs out while on a dashboard page - should immediately redirect to `/login`
- User signs in while on a public page - should immediately redirect to `/heists`
- Slow network connection causing extended loading states - loader should remain visible until definitive auth state is known
- User navigates directly to a protected route via URL - should respect protection rules
- Multiple tabs open with different auth states - Firebase should sync auth state across tabs
- User token expires while using the app - should detect and redirect appropriately

## Acceptance Criteria

- Authenticated users cannot access `/`, `/login`, or `/signup` - they are redirected to `/heists`
- Unauthenticated users cannot access `/heists`, `/heists/create`, or `/heists/[id]` - they are redirected to `/login`
- Loading indicator displays in both (public) and (dashboard) layouts while auth state is being determined
- No content flashing occurs - protected content only renders after auth check completes
- Redirects work correctly regardless of how the route was accessed (direct URL, navigation, browser back/forward)
- The `useUser` hook is properly utilized in both layout components
- Route protection works immediately after sign in/sign out actions
- Preview page is accessible according to decided behavior (public route rules or unrestricted)

## Open Questions

- What should the loading indicator look like? Simple spinner, skeleton, or branded loader? Spinner using this clock from the title (from lucid react icon package).
- Should there be any visual feedback during the redirect (flash message, transition)?
- Should the app remember the intended destination and redirect there after login (e.g., user tries to access `/heists/create`, gets redirected to `/login`, then after login goes to `/heists/create`)? No.

## Testing Guidelines

Create test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases:

- **Public Layout Tests**
  - Renders loading state when auth state is loading
  - Redirects authenticated users to `/heists`
  - Renders children when user is unauthenticated and not loading
  - Does not render children during loading or when redirecting

- **Dashboard Layout Tests**
  - Renders loading state when auth state is loading
  - Redirects unauthenticated users to `/login`
  - Renders children when user is authenticated and not loading
  - Does not render children during loading or when redirecting

- **Integration Tests (if possible)**
  - Verify actual redirect behavior for both route groups
  - Test auth state changes triggering redirects
  - Verify no content flashing occurs
