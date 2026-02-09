# Spec for Auth State Management with useUser Hook

branch: claude/feature/auth-state-management-useuser-hook
figma_component (if used): N/A

## Summary

Implement a global authentication state management solution that provides real-time access to the current user's authentication status throughout the application. The solution centers around a `useUser` hook that returns either `null` (when logged out) or a user object (when logged in). This hook can be consumed by any page or component in the application to access the current user state. The implementation should provide a real-time global listener that automatically updates all consuming components when the user's authentication status changes.

## Functional Requirements

- Create a `useUser` hook that can be imported and used in any component or page
- The hook should return `null` when no user is authenticated
- The hook should return a user object when a user is authenticated
- The user object should contain at minimum: `id`, `email`, and any other relevant user properties
- Implement a global state provider/context that wraps the application and manages auth state
- Provide real-time synchronization of auth state across all components using the hook
- When auth state changes (user logs in or logs out), all components using `useUser` should automatically re-render with the updated state
- Integrate with Firebase Authentication (as indicated by the project's firebase setup)
- Set up a listener on Firebase auth state changes to keep the global state in sync
- Create appropriate TypeScript types/interfaces for the User object
- Export the hook from a central location for easy importing (e.g `@/lib/auth`)
- Update existing components that reference or would benefit from accessing user state to use the new `useUser` hook

## Figma Design Reference (only if referenced)

N/A - This is a state management feature with no UI components.

## Possible Edge Cases

- User session expires while the app is open - ensure the hook updates to `null` automatically
- Multiple tabs/windows open - auth state changes in one tab should potentially sync to others (if supported by Firebase)
- User refreshes the page - auth state should be restored from Firebase persistence
- Hook is called before the auth provider initializes - should handle loading state gracefully
- Network connectivity issues - Firebase may take time to determine auth state on app load
- Race conditions between login/logout actions and state updates
- Component unmounts while auth state is being updated
- User object changes (profile updates) while user is logged in - consider if hook should reflect those changes

## Acceptance Criteria

- A `useUser` hook is available for import throughout the application
- The hook returns `null` when no user is authenticated
- The hook returns a properly typed user object when a user is authenticated
- The user object includes at least `id` and `email` properties
- A provider component wraps the application and manages global auth state
- Firebase auth state listener is set up and properly cleaned up
- When Firebase auth state changes, all components using `useUser` automatically receive the updated state
- TypeScript types are defined for the User object and hook return value
- No console errors or warnings related to the auth state management
- Existing components that need user data are updated to use the `useUser` hook
- The solution does not interfere with existing login/signup flows
- Loading state is handled appropriately (optional: hook could return `{ user, loading }` or handle internally)

## Open Questions

- Should the hook also return a `loading` boolean to indicate when auth state is being initialized? yes
- What specific properties should be included in the user object beyond `id` and `email`? email, id, displayName
- Should we implement error handling for auth state initialization failures? not for now
- Do we need to support optimistic UI updates before Firebase confirms auth changes? yes
- Should the hook provide helper methods (e.g., `isAuthenticated`, `isLoading`) or just return the user? just return user
- Where should the auth context provider be placed in the component tree (root layout vs. specific layout)? lib/auth/AuthContext.tsx

## Testing Guidelines

Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy.

- Test that `useUser` returns `null` when no user is authenticated
- Test that `useUser` returns a user object when authenticated
- Test that the user object has the expected properties (`id`, `email`)
- Test that components re-render when auth state changes
- Test that multiple components using `useUser` all receive the same state
- Test that the Firebase auth listener is properly set up and cleaned up
- Mock Firebase auth state changes and verify the hook updates accordingly
- Test error boundaries or error handling if auth initialization fails
- Test that the hook can be called from different levels of the component tree
