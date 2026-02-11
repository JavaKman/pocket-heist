# Spec for Heist Card Component

branch: claude/feature/heist-card-component
figma_component: Page-Designs (node-id=21-4)

## Summary

Create a HeistCard component to display individual heist information on the /heists page. The component will show heist details in a visually appealing card format, displayed in a 3-column grid layout. Active and assigned heists will use the full HeistCard component, while a HeistCardSkeleton component will provide loading states.

## Functional Requirements

- Create a `HeistCard` component that displays:
  - Heist title (clickable link to `/heists/:id`)
  - Heist description or summary
  - Status indicator (active, assigned)
  - Due date or deadline information
  - Assigned user information (avatar, name)
  - Any relevant metadata (tags, difficulty, etc.)

- Create a `HeistCardSkeleton` component for loading states:
  - Matches the layout and dimensions of HeistCard
  - Uses the existing Skeleton component for placeholder elements
  - Shows skeleton versions of title, description, avatar, and metadata

- Update the `/heists` page (`app/(dashboard)/heists/page.tsx`) to:
  - Display heist cards in a 3-column responsive grid layout
  - Show HeistCard for "Your Active Heists" section
  - Show HeistCard for "Heists You've Assigned" section
  - Do NOT show HeistCard for "All Expired Heists" (different display pattern to be determined later)
  - Show HeistCardSkeleton components while data is loading

- Heist title must be a clickable link that navigates to `/heists/:id`
  - Link should be accessible and semantic (proper anchor tag)
  - Do NOT implement the heist details page content yet (just the routing)

- Grid layout specifications:
  - 3 columns on large screens (desktop)
  - 2 columns on medium screens (tablet)
  - 1 column on small screens (mobile)
  - Responsive breakpoints using Tailwind utilities
  - Consistent gap/spacing between cards

## Figma Design Reference

- File: https://www.figma.com/design/elHzuUQZiJXNqJft57oneh/Page-Designs?node-id=21-4&m=dev
- **Note**: The provided Figma link extracted design specifications for a "Create New Heist" gradient button rather than the heist card component. The correct node for the HeistCard component may be different within the Page-Designs file.
- **Alternative**: If design specs are unavailable, follow the existing component patterns in the project:
  - Use theme colors from `globals.css` (--color-primary, --color-secondary, etc.)
  - Match styling patterns from LoginForm, SignupForm, and Navbar components
  - Apply consistent border radius, padding, and spacing
  - Use subtle shadows or borders for card elevation

## Possible Edge Cases

- **Empty states**: What to display when there are no active or assigned heists
- **Long titles**: How to handle heist titles that exceed card width (truncate, wrap, or ellipsis)
- **Missing data**: Handle heists without descriptions, avatars, or deadlines gracefully
- **Loading states**: How long to show skeletons before timeout or error state
- **Expired heists**: Ensure HeistCard is NOT rendered for expired heists section
- **Grid layout breakpoints**: Ensure smooth responsive transitions without layout jumps
- **Link accessibility**: Ensure heist title links work with keyboard navigation and screen readers

## Acceptance Criteria

- ✅ HeistCard component created with proper TypeScript types and props
- ✅ HeistCardSkeleton component created matching HeistCard layout
- ✅ Both components follow project structure (ComponentName/ folder with .tsx, .module.css, index.ts)
- ✅ Heist title is a working link to `/heists/:id` route
- ✅ Cards displayed in 3-column grid on /heists page for active and assigned sections
- ✅ Grid is responsive (3 cols → 2 cols → 1 col based on screen size)
- ✅ HeistCard NOT displayed for "All Expired Heists" section
- ✅ CSS follows Tailwind-first approach with CSS Modules for component-scoped styles
- ✅ Components use `@apply` directives in CSS modules where appropriate
- ✅ Skeleton loading state properly mimics HeistCard structure
- ✅ All interactive elements (links) are keyboard accessible
- ✅ No changes made to heist details page (`/heists/[id]/page.tsx`) content yet

## Open Questions

- Should HeistCard include action buttons (edit, delete, mark complete)? No.
- What specific metadata should be displayed on each card (tags, difficulty, points)? Undecided for now.
- Should expired heists eventually use a different visual style of HeistCard? Maybe sligth different background color.
- What should happen when user clicks on card area outside the title link? Nothing.
- Should cards have hover states or animations? No.
- Should the grid be responsive(e.g., 2 column on tablet, 1 on mobile)? Yes.
- What determines if a heist is "assigned" vs. "active"? assigned if created by user, active if created for current user.

## Testing Guidelines

Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy.

- **HeistCard component** (`tests/components/HeistCard.test.tsx`):
  - Renders heist title as a link with correct href
  - Displays heist description or summary text
  - Shows avatar and assigned user information
  - Renders status indicator correctly
  - Handles missing optional data (description, avatar) gracefully
  - Link is keyboard accessible (tab navigation works)

- **HeistCardSkeleton component** (`tests/components/HeistCardSkeleton.test.tsx`):
  - Renders skeleton placeholders for all card elements
  - Matches approximate layout/dimensions of HeistCard
  - Uses existing Skeleton component properly

- **Heists page grid layout**:
  - Cards render in expected grid structure
  - Grid responds to viewport size changes (if feasible with testing library)
  - Active heists section shows HeistCard components
  - Assigned heists section shows HeistCard components
  - Expired heists section does NOT show HeistCard components
