# Implementation Plan: Heist Card Component

## Context

The `/heists` page currently displays heists as simple list items (`<li>{heist.title}</li>`). This implementation will create a rich card component to display heist information in a visually appealing 3-column responsive grid layout. The cards will show title (as a clickable link), description, assignee info with avatar, deadline, and optional status badges.

**Key Requirements:**

- HeistCard component with all heist details
- HeistCardSkeleton component for loading states
- 3-column grid (desktop) → 2-column (tablet) → 1-column (mobile)
- Cards only for "active" and "assigned" sections (NOT expired)
- Title links to `/heists/:id` route
- No action buttons or hover animations (per spec clarifications)

## Implementation Steps

### 1. Create HeistCard Component

**Files to create:**

- `components/HeistCard/HeistCard.tsx`
- `components/HeistCard/HeistCard.module.css`
- `components/HeistCard/index.ts`

**HeistCard.tsx structure:**

```typescript
interface HeistCardProps {
  heist: Heist;
  variant: "active" | "assigned";
}
```

**Component sections:**

1. **Header**: Title as `<Link>` to `/heists/${heist.id}` (import from `next/link`)
2. **Description**: Text with 2-line clamping using `-webkit-line-clamp: 2`
3. **By**: Avatar component + createdByToCodename display
4. **To**: Avatar component + assignedToCodename display
5. **Deadline**: Clock icon (from `lucide-react`) + formatted date using `toLocaleDateString()`
6. **Status Badge** (conditional): Only show if `finalStatus` is not null - success (green) or failure (red)

**Styling approach:**

- Use `<article>` element for semantic HTML
- Background: `var(--color-lighter)` or `@apply bg-lighter`
- Text colors: `--color-heading` for titles, `--color-body` for description
- Border radius, padding, subtle shadow for card elevation
- Title link: hover with `--color-secondary`
- Status badges: `--color-success` and `--color-error`
- Text truncation: `text-overflow: ellipsis` for title, `-webkit-line-clamp: 2` for description

**Date formatting utility:**

```typescript
function formatDeadline(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
```

**Key imports:**

```typescript
import Link from "next/link";
import { Clock } from "lucide-react";
import Avatar from "@/components/Avatar";
import { Heist } from "@/types/firestore";
import styles from "./HeistCard.module.css";
```

### 2. Create HeistCardSkeleton Component

**Files to create:**

- `components/HeistCardSkeleton/HeistCardSkeleton.tsx`
- `components/HeistCardSkeleton/HeistCardSkeleton.module.css`
- `components/HeistCardSkeleton/index.ts`

**Structure:**

- Mirror HeistCard layout exactly
- Use existing `Skeleton` component multiple times:
  - Title: `variant="rectangular"` (width: 70%, height: 1.5rem)
  - Description: Two `variant="text"` skeletons
  - Avatar: `variant="circular"` (40px)
  - Created by: `variant="rectangular"` (width: 100px, height: 1rem)
  - Assignee name: `variant="rectangular"` (width: 100px, height: 1rem)
  - Deadline: `variant="rectangular"` (width: 120px, height: 1rem)

- Same background, padding, border as HeistCard
- No props needed (static loading state)

### 3. Update Heists Page

**File to modify:** `app/(dashboard)/heists/page.tsx`

**Changes to HeistSection component:**

1. Add `sectionType` prop:

```typescript
function HeistSection({
  title,
  heists,
  loading,
  sectionType, // NEW
}: {
  title: string;
  heists: Heist[];
  loading: boolean;
  sectionType: "active" | "assigned" | "expired"; // NEW
}) {
```

2. Replace skeleton loading with grid + HeistCardSkeleton:

```tsx
{loading ? (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
    <HeistCardSkeleton />
    <HeistCardSkeleton />
    <HeistCardSkeleton />
  </div>
) : // ...
```

3. Replace `<ul>` list with grid + HeistCard (for active/assigned only):

```tsx
{
  heists.length === 0 ? (
    <p>No available heists.</p>
  ) : sectionType !== "expired" ? (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {heists.map((heist) => (
        <HeistCard key={heist.id} heist={heist} variant={sectionType} />
      ))}
    </div>
  ) : (
    <ul>
      {heists.map((heist) => (
        <li key={heist.id}>{heist.title}</li>
      ))}
    </ul>
  );
}
```

4. Update HeistsPage component to pass `sectionType`:

```tsx
<HeistSection title="Your Active Heists" heists={activeHeists} loading={activeLoading} sectionType="active" />
// Same for assigned and expired sections
```

5. Add imports:

```typescript
import HeistCard from "@/components/HeistCard";
import HeistCardSkeleton from "@/components/HeistCardSkeleton";
```

**Grid breakpoints:**

- Mobile (default): 1 column (`grid-cols-1`)
- Tablet (768px+): 2 columns (`md:grid-cols-2`)
- Desktop (1280px+): 3 columns (`xl:grid-cols-3`)
- Gap: `gap-4` (1rem spacing)

### 4. Create Tests

**HeistCard.test.tsx** (`tests/components/HeistCard.test.tsx`):

Test cases:

- Renders title as link with correct href (`/heists/${heist.id}`)
- Displays description text
- Shows assignee avatar and codename
- Renders formatted deadline
- Shows success badge when `finalStatus === "success"`
- Shows failure badge when `finalStatus === "failure"`
- Does NOT show badge when `finalStatus === null`
- Uses article element for semantic HTML
- Link is keyboard accessible

**Mock helper:**

```typescript
function createMockHeist(overrides?: Partial<Heist>): Heist {
  return {
    id: "test-id-123",
    createdAt: new Date(),
    title: "Test Heist",
    description: "Test description",
    createdBy: "user-123",
    createdByCodename: "MasterThief",
    assignedTo: "user-456",
    assignedToCodename: "ShadowNinja",
    deadline: new Date("2026-12-31"),
    finalStatus: null,
    ...overrides,
  };
}
```

**HeistCardSkeleton.test.tsx** (`tests/components/HeistCardSkeleton.test.tsx`):

Test cases:

- Renders skeleton placeholders
- Has aria-hidden attributes (inherited from Skeleton component)
- Renders correct number of skeleton elements (5+)

## Critical Files

1. **components/HeistCard/HeistCard.tsx** - Main card component with all display logic
2. **components/HeistCard/HeistCard.module.css** - Card styling with theme colors and responsive text
3. **components/HeistCardSkeleton/HeistCardSkeleton.tsx** - Loading state component
4. **app/(dashboard)/heists/page.tsx** - Integration point for grid layout
5. **tests/components/HeistCard.test.tsx** - Comprehensive test suite

**Existing files to reference:**

- `types/firestore/heist.ts` - Heist interface (already exists)
- `components/Avatar/Avatar.tsx` - Avatar component (reuse)
- `components/Skeleton/Skeleton.tsx` - Skeleton component (reuse)
- `app/globals.css` - Theme colors and global classes

## Verification

### Manual Testing

1. **Start dev server:** `npm run dev`
2. **Navigate to** `/heists` page
3. **Verify grid layout:**
   - Desktop (1280px+): 3 columns
   - Tablet (768px): 2 columns
   - Mobile (375px): 1 column
4. **Verify HeistCard displays:**
   - Title as clickable link
   - Description (truncated if long)
   - Avatar with assignee codename
   - Formatted deadline with clock icon
   - Status badge (if finalStatus exists)
5. **Click title link** - should navigate to `/heists/:id`
6. **Check loading states** - HeistCardSkeleton appears during data fetch
7. **Verify expired section** - should NOT show HeistCard (simple list only)

### Automated Testing

1. **Run tests:** `npm test`
2. **Verify all HeistCard tests pass**
3. **Verify all HeistCardSkeleton tests pass**

### Linting

1. **Run linter:** `npm run lint`
2. **Verify no errors**

## Edge Cases Handled

- **Long titles**: Text truncation with ellipsis
- **Long descriptions**: Line clamping to 2 lines
- **Null finalStatus**: No badge displayed
- **Empty heists**: "No available heists." message (already exists)
- **Keyboard navigation**: Link elements are naturally accessible
- **Responsive breakpoints**: Tailwind grid utilities handle smoothly
