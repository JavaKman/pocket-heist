# Spec for useHeists Hook for Firestore Data

branch: claude/feature/useheists-hook-firestore-data

## Summary

Create a custom React hook called `useHeists` that provides real-time access to heist data from the Firestore collection. The hook should accept a filter type ('active', 'assigned', or 'expired') and return an array of heist objects that match the specified criteria. The hook should utilize Firestore's real-time listeners to automatically update when data changes.

## Functional Requirements

- Create a custom `useHeists` hook in `./lib/hooks/useHeists.ts`
- Hook accepts a single argument of type `'active' | 'assigned' | 'expired'`
- Hook returns an array of `Heist` objects based on the filter type:
  - **'active'**: All heists assigned TO the current user where the deadline has not passed
  - **'assigned'**: All heists assigned BY the current user (created by) where the deadline has not passed
  - **'expired'**: All heists where the deadline has passed AND `finalStatus` is NOT null, regardless of user
- Use Firestore's real-time listeners (`onSnapshot`) to keep data synchronized
- Filter logic should query:
  - For 'active': `assignedTo === currentUserId` AND `deadline > now()`
  - For 'assigned': `createdBy === currentUserId` AND `deadline > now()`
  - For 'expired': `deadline <= now()` AND `finalStatus !== null`
- Hook should use the `heistConverter` for proper Firestore data conversion
- Hook should handle loading and error states appropriately
- Update `app/(dashboard)/heists/page.tsx` to use the hook three times (once for each filter type) and display the titles of heists in each category

## Possible Edge Cases

- User is not authenticated (handle gracefully, return empty array)
- Firestore query fails or times out
- No heists match the filter criteria (return empty array)
- Deadline dates that are exactly equal to the current time
- Real-time updates arriving while component is unmounting
- Multiple instances of the hook running simultaneously with different filters
- Heists with missing or invalid deadline dates
- Heists with missing or invalid `finalStatus` values for expired heists

## Acceptance Criteria

- `useHeists` hook is created in `./lib/hooks/useHeists.ts`
- Hook properly implements real-time Firestore subscriptions using `onSnapshot`
- Hook correctly filters heists based on the filter type argument
- Hook returns properly typed `Heist[]` arrays
- Hook cleans up Firestore listeners on component unmount
- `app/(dashboard)/heists/page.tsx` displays three sections:
  - "Your Active Heists" showing titles from `useHeists('active')`
  - "Heists You've Assigned" showing titles from `useHeists('assigned')`
  - "All Expired Heists" showing titles from `useHeists('expired')`
- Each section displays only the heist titles, no other information
- Heist titles are rendered as list items or similar structured elements
- The page properly handles empty states for each category
- No TypeScript errors or warnings
- Hook uses the existing `heistConverter` from `types/firestore/heist.ts`
- Hook uses the `COLLECTIONS.HEISTS` constant from `types/firestore/index.ts`

## Open Questions

- Should the hook expose loading and error states, or handle them internally?
- Should there be a loading indicator on the page while heists are being fetched? Yes.
- What should be displayed when a category has no heists (empty state message)? Available heist.
- Should the hook handle authentication internally or assume the user is authenticated? Assume authenticated.
- Do we need pagination for the expired heists list, or should all expired heists be loaded? No pagination, load them all.

## Testing Guidelines

Create a test file in the `./tests` folder for the new feature, with meaningful tests for the following cases:

- Hook returns empty array when user is not authenticated
- Hook properly filters heists for 'active' type (assigned to current user, not expired)
- Hook properly filters heists for 'assigned' type (created by current user, not expired)
- Hook properly filters heists for 'expired' type (deadline passed, finalStatus not null)
- Hook sets up and cleans up Firestore listener correctly
- Hook handles Firestore query errors gracefully
- Component using the hook displays heist titles correctly
- Component handles empty states for each category
- Real-time updates trigger re-renders with new data
