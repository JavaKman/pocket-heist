# Implementation Plan: useHeists Hook for Real-Time Firestore Data

## Context

The heists page (`app/(dashboard)/heists/page.tsx`) currently shows three empty placeholder sections: "Your Active Heists", "Heists You've Assigned", and "All Expired Heists". This implementation will create a custom React hook `useHeists` that fetches real-time heist data from Firestore and updates the page to display actual heist titles in each section.

The hook will use Firestore's `onSnapshot` for live data synchronization, applying different filters based on the section type. This enables users to see their active missions, track missions they've assigned to others, and review completed missions in real-time.

## Implementation Approach

### 1. Create useHeists Hook (`lib/hooks/useHeists.ts`)

**New directory**: `lib/hooks/` (doesn't exist yet)

**Hook signature**:

```typescript
export function useHeists(filterType: "active" | "assigned" | "expired"): {
  heists: Heist[];
  loading: boolean;
};
```

**Implementation details**:

- Import and use `useUser()` from `lib/auth/useUser.ts` to get current user ID
- Use `useState` for `heists: Heist[]` and `loading: boolean` state
- Use `useEffect` with dependencies `[user, authLoading, filterType]` to set up Firestore subscription
- Build Firestore queries using imports from `firebase/firestore`:
  - `collection`, `query`, `where`, `onSnapshot`, `Timestamp`
- Apply `heistConverter` from `types/firestore/heist.ts` for type conversion
- Use `COLLECTIONS.HEISTS` constant from `types/firestore/index.ts`
- Use `db` from `lib/firebase.ts`

**Query logic by filter type**:

1. **'active'**: Heists assigned TO current user, not expired
   - `where('assignedTo', '==', user.id)`
   - `where('deadline', '>', Timestamp.now())`

2. **'assigned'**: Heists created BY current user, not expired
   - `where('createdBy', '==', user.id)`
   - `where('deadline', '>', Timestamp.now())`

3. **'expired'**: All heists past deadline with final status set
   - `where('deadline', '<=', Timestamp.now())`
   - `where('finalStatus', '!=', null)`

**State management pattern**:

- Return empty array while auth is loading (prevents flash of "no heists")
- Set `loading: true` before establishing subscription
- Set `loading: false` in both success and error callbacks
- Log errors to console (per spec: handle internally)
- Return unsubscribe function from `useEffect` for cleanup

**Reference existing pattern**: Follow `useUser` hook structure from `lib/auth/useUser.ts` for:

- Client component marking with `"use client"`
- Error throwing for context usage
- TypeScript return type definition

### 2. Update Heists Page (`app/(dashboard)/heists/page.tsx`)

**Changes required**:

1. Add `"use client"` directive at top (required for hooks)
2. Import `useHeists` from `@/lib/hooks/useHeists`
3. Import `Skeleton` from `@/components/Skeleton` for loading states
4. Call `useHeists` three times with different filters:

   ```typescript
   const { heists: activeHeists, loading: activeLoading } = useHeists("active");
   const { heists: assignedHeists, loading: assignedLoading } = useHeists("assigned");
   const { heists: expiredHeists, loading: expiredLoading } = useHeists("expired");
   ```

5. For each section, render:
   - **Loading state**: Show `<Skeleton />` components (3 skeletons per section)
   - **Empty state**: Show "No available heists." when `heists.length === 0`
   - **Data state**: Map over heists array and display titles in a list

**Section structure**:

```typescript
<div className="active-heists">
  <h2>Your Active Heists</h2>
  {activeLoading ? (
    // 3 Skeleton components
  ) : activeHeists.length === 0 ? (
    <p>No available heists.</p>
  ) : (
    <ul>
      {activeHeists.map(heist => (
        <li key={heist.id}>{heist.title}</li>
      ))}
    </ul>
  )}
</div>
```

Repeat this pattern for all three sections.

### 3. Firestore Index Requirements

The Firestore queries require composite indexes. On first run, Firestore will throw errors with auto-creation links. Click the links to create:

- **Index 1**: Collection `heists`, Fields: `assignedTo ASC, deadline ASC`
- **Index 2**: Collection `heists`, Fields: `createdBy ASC, deadline ASC`
- **Index 3**: Collection `heists`, Fields: `deadline ASC, finalStatus ASC`

Index creation takes 5-15 minutes. The app will work once indexes are ready.

## Critical Files

**Files to create**:

- `lib/hooks/useHeists.ts` - New hook implementation
- `lib/hooks/types.ts` - Typescript interface
- `lib/hooks/index.ts` - Barrel export

**Files to modify**:

- `app/(dashboard)/heists/page.tsx` - Update to use hook and display data

**Files to reference** (existing utilities/patterns):

- `lib/firebase.ts` - Import `db` instance
- `lib/auth/useUser.ts` - Import `useUser()` hook, follow hook structure pattern
- `types/firestore/heist.ts` - Import `Heist` interface and `heistConverter`
- `types/firestore/index.ts` - Import `COLLECTIONS` constant
- `components/Skeleton/Skeleton.tsx` - Use for loading indicators

## Verification Steps

### Manual Testing

1. **Start dev server**: `npm run dev`
2. **Navigate to**: `http://localhost:3000/heists` (must be logged in)
3. **Expected behavior**:
   - Initially see skeleton loading indicators in all three sections
   - After loading, see either "No available heists." or list of heist titles
   - Each section shows different heists based on filter

4. **Test real-time updates**:
   - Open Firebase Console
   - Create a new heist document manually
   - Verify it appears in the appropriate section without page refresh
   - Update a heist's deadline to past date
   - Verify it moves from active/assigned to expired section

5. **Test each filter**:
   - Create heists assigned TO your user (should appear in "Active")
   - Create heists created BY your user (should appear in "Assigned")
   - Create expired heists with finalStatus set (should appear in "Expired")

### Handle Index Errors

On first run, you'll see Firestore index errors in console. Each error includes a URL to create the required index. Click each URL and wait for index creation to complete (5-15 minutes).

### TypeScript Verification

- Run `npm run lint` - should pass with no errors
- Verify IDE shows no TypeScript errors in hook or page files

### Testing

Create test file `tests/hooks/useHeists.test.tsx`:

- Mock `useUser` hook
- Mock Firestore `onSnapshot`
- Test: returns empty array when user is null
- Test: calls Firestore with correct query for each filter type
- Test: updates heists array when snapshot changes
- Test: cleans up subscription on unmount

Run tests with `npm test`.

## Notes

- The hook assumes user is authenticated (per spec)
- Errors are logged to console but not exposed to UI (per spec)
- No pagination for expired heists (per spec)
- Loading states are exposed and shown with skeleton components (per spec)
- Three concurrent subscriptions are acceptable for v1; optimize later if needed
- Server/client time drift may cause brief inconsistencies at deadline boundaries (acceptable)
