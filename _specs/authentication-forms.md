# Spec for Authentication Forms

branch: claude/feature/authentication-forms

## Summary

Implement functional login and signup forms for the `/login` and `/signup` pages. Both forms should collect email and password with a password visibility toggle and submit functionality that logs credentials to the console. Users should be able to easily navigate between the two forms.

## Functional Requirements

- **Email field**
  - Text input with type="email"
  - Label: "Email"
  - Should accept standard email format

- **Password field**
  - Password input with type="password" by default
  - Label: "Password"
  - Should mask password characters by default

- **Password visibility toggle**
  - Icon button to show/hide password
  - Should toggle between "password" and "text" input types
  - Icon should indicate current state (e.g., eye icon vs eye-off icon)

- **Submit button**
  - Login page: Button labeled "Log In"
  - Signup page: Button labeled "Sign Up"
  - Should trigger form submission

- **Form submission**
  - Prevent default form behavior
  - Log form data to console in format: `{ email: '...', password: '...' }`
  - No actual authentication logic needed at this stage

- **Navigation between forms**
  - Both pages should have a link to switch to the other form
  - Login page: Link to signup page with text like "Don't have an account? Sign up"
  - Signup page: Link to login page with text like "Already have an account? Log in"

## Possible Edge Cases

- Empty form submission (should still log empty values for now)
- Very long email or password inputs
- Special characters in password field
- Rapid toggling of password visibility
- Copy/paste into password field when visibility is toggled

## Acceptance Criteria

- Login form renders with email field, password field, visibility toggle, and submit button
- Signup form renders with email field, password field, visibility toggle, and submit button
- Password visibility toggle switches between masked and visible password text
- Form submission logs correct email and password values to browser console
- Links between login and signup pages work correctly
- Forms follow existing styling patterns (`.center-content`, `.form-title` classes)
- Forms are visually consistent with the app's theme colors and typography

## Open Questions

- Should there be any client-side validation at this stage, or purely console logging? Light validation.
- Should the forms be separate components or inline in the page files? reusable components.
- Do we need loading states or disabled states for the submit button? Yes.

## Testing Guidelines

Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy.

- Login form renders all required fields and button
- Signup form renders all required fields and button
- Password visibility toggle changes input type between "password" and "text"
- Form submission handler is called when submit button is clicked
- Navigation links between login and signup pages have correct href attributes
- Forms use appropriate semantic HTML (form element, proper input types, labels)
