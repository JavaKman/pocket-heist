# Spec for Navbar Logout Button

branch: claude/feature/navbar-logout-button
figma_component: Page-Designs / Logout Button (node-id=57-3)

## Summary

Add a logout button to the Navbar component that allows authenticated users to sign out of the application.
The button should only be visible when a user is logged in and should trigger the sign-out functionality when clicked.
This spec does not include redirect behavior after logout.

## Functional Requirements

- Add a logout button to the Navbar component that is conditionally rendered based on authentication state
- The button should only appear when a user is logged in
- Clicking the button should trigger sign-out functionality (clear auth state, tokens, etc.)
- The button should be positioned appropriately within the navbar layout
- No redirect logic is required at this stage (user remains on current page after logout)
- Button should follow the app's design system and match the Figma specifications

## Figma Design Reference

- File: https://www.figma.com/design/elHzuUQZiJXNqJft57oneh/Page-Designs?node-id=57-3&m=dev
- Component: Logout button (node-id: 57-3)
- Key visual constraints:
  - Button has a gradient background from purple (#9810fa) to pink (#e60076)
  - Contains an icon on the left side (20x20px) with logout symbol
  - Text "Logout" displayed in white, 16px font, Inter Regular
  - Button has rounded corners (10px border-radius)
  - Horizontal spacing: icon has right gap of ~8px from text
  - Internal padding: ~16px left padding
  - Total button height appears to be ~40px based on text height of 24px plus padding

## Possible Edge Cases

- User clicks logout button multiple times rapidly (debounce or disable during processing)
- Logout API call fails or times out
- User is already logged out when they click the button (stale state)
- Network is offline when attempting to logout
- Component renders before auth state is initialized (loading state)

## Acceptance Criteria

- Logout button is visible in the Navbar only when user is authenticated
- Logout button is not visible when user is not authenticated
- Clicking the logout button clears the user's authentication state
- Button styling matches the Figma design specifications (gradient, rounded corners, icon, text)
- Button has appropriate hover and active states for user feedback
- Logout action is performed successfully and updates the application's auth state
- No console errors or warnings during logout process

## Open Questions

- Should there be a loading state on the button during logout processing? No.
- Should there be a confirmation dialog before logout, or is immediate logout preferred? No.
- What should happen to the button's appearance during the logout process? disabled.
- Where should the logout API call be made (if backend integration exists)? via Firebase signout
- Position of logout button? should be just left of create button.

## Testing Guidelines

Create a test file in the ./tests folder for the updated Navbar component with the following test cases:

- Renders logout button when user is authenticated
- Does not render logout button when user is not authenticated
- Calls logout function when button is clicked
- Button has correct styling and text context
- Logout button appears in correct position., left of create button
