# Implementation Plan: Authentication Forms

## Overview

Implement login and signup forms with email/password fields, password visibility toggle, light validation, loading states, and console logging. Create reusable form components following the established component patterns.

## Component Architecture

Create 5 new components following the existing pattern (ComponentName.tsx, ComponentName.module.css, index.ts):

### 1. Button Component (`components/Button/`)

**Responsibility:** Reusable button with loading state

**Props:**

```typescript
interface ButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}
```

**Key Features:**

- Extends `.btn` class from globals.css using `@apply btn`
- Shows loading state (disabled + opacity-75)
- Disables interaction during loading

**Files:**

- `components/Button/Button.tsx` - Component with loading state logic
- `components/Button/Button.module.css` - Extends .btn with loading styles
- `components/Button/index.ts` - Barrel export

### 2. Input Component (`components/Input/`)

**Responsibility:** Text/email input with label and error display

**Props:**

```typescript
interface InputProps {
  id: string;
  name: string;
  type?: "text" | "email";
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
}
```

**Key Features:**

- Label with htmlFor accessibility
- Error message displayed below input when error prop exists
- Border changes to --color-error when hasError
- Uses bg-lighter, focus:border-primary

**Files:**

- `components/Input/Input.tsx` - Input with error handling
- `components/Input/Input.module.css` - Input, label, error styles
- `components/Input/index.ts` - Barrel export

### 3. PasswordInput Component (`components/PasswordInput/`)

**Responsibility:** Password field with visibility toggle using Eye/EyeOff icons

**Props:** Same as Input but without type prop

**Key Features:**

- Internal state: `const [showPassword, setShowPassword] = useState(false)`
- Toggle button with Eye (hidden) / EyeOff (shown) icons from lucide-react
- Input type switches between "password" and "text"
- Toggle button positioned absolute right-3 inside input wrapper
- aria-label on toggle button for accessibility

**Icons to import:**

```typescript
import { Eye, EyeOff } from "lucide-react";
```

**Files:**

- `components/PasswordInput/PasswordInput.tsx` - Password with toggle
- `components/PasswordInput/PasswordInput.module.css` - Input wrapper with absolute positioned toggle
- `components/PasswordInput/index.ts` - Barrel export

### 4. LoginForm Component (`components/LoginForm/`)

**Responsibility:** Login form composition with validation and submission

**Client Component:** Add `"use client"` directive

**State:**

```typescript
const [formData, setFormData] = useState({ email: "", password: "" });
const [errors, setErrors] = useState({ email: "", password: "" });
const [loading, setLoading] = useState(false);
```

**Validation (light):**

- Email: required + basic regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Password: required only
- Validate on submit, not on blur

**Submit Handler:**

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validateForm()) return;

  setLoading(true);
  setTimeout(() => {
    console.log("Login submitted:", formData);
    setLoading(false);
  }, 1000);
};
```

**Structure:**

- Input component for email
- PasswordInput component for password
- Button component with type="submit" and loading state
- Footer with Link to /signup: "Don't have an account? Sign up"

**Files:**

- `components/LoginForm/LoginForm.tsx` - Form with validation logic
- `components/LoginForm/LoginForm.module.css` - Form layout and link styles
- `components/LoginForm/index.ts` - Barrel export

### 5. SignupForm Component (`components/SignupForm/`)

**Responsibility:** Signup form composition with validation and submission

**Same structure as LoginForm with differences:**

- Button text: "Sign Up"
- Password validation adds minimum 6 characters check
- Console log: "Signup submitted:"
- Footer links to /login: "Already have an account? Log in"

**Files:**

- `components/SignupForm/SignupForm.tsx` - Form with signup validation
- `components/SignupForm/SignupForm.module.css` - Same as LoginForm styles
- `components/SignupForm/index.ts` - Barrel export

## Page Updates

### Login Page (`app/(public)/login/page.tsx`)

Replace placeholder with:

```typescript
import LoginForm from "@/components/LoginForm"

export default function LoginPage() {
  return (
    <div className="center-content">
      <div className="page-content">
        <h2 className="form-title">Log in to Your Account</h2>
        <LoginForm />
      </div>
    </div>
  )
}
```

### Signup Page (`app/(public)/signup/page.tsx`)

Replace placeholder with:

```typescript
import SignupForm from "@/components/SignupForm"

export default function SignupPage() {
  return (
    <div className="center-content">
      <div className="page-content">
        <h2 className="form-title">Signup for an Account</h2>
        <SignupForm />
      </div>
    </div>
  )
}
```

Note: Change h2 to h1 in signup page for consistency.

## Testing

Create test files in `tests/components/` for each component:

### Button.test.tsx

- Renders children text
- Calls onClick when clicked
- Shows loading state and is disabled
- Is disabled when disabled prop is true

### Input.test.tsx

- Renders label and input
- Displays error message when error prop provided
- Calls onChange when user types

### PasswordInput.test.tsx

- Renders password input with type="password" by default
- Toggles between password and text when button clicked
- Displays error message

### LoginForm.test.tsx

- Renders email and password fields
- Renders submit button with "Log In" text
- Shows validation errors for empty fields
- Shows error for invalid email format
- Submits form with valid data (spy on console.log)
- Disables form during submission
- Renders link to /signup

### SignupForm.test.tsx

- Same tests as LoginForm but for signup
- Additional test for minimum password length validation
- Link points to /login

Use patterns from existing tests:

- Import from `@testing-library/react` and `@testing-library/user-event`
- Use `screen.getByRole()`, `screen.getByLabelText()`, `screen.getByText()`
- Use `vi.fn()` for mocks, `vi.spyOn(console, "log")` for logging
- Use `waitFor()` for async assertions
- Use regex for flexible text matching

## Implementation Sequence

1. **Create Button component** (independent)
2. **Create Input component** (independent)
3. **Create PasswordInput component** (independent)
4. **Create LoginForm component** (uses Button, Input, PasswordInput)
5. **Create SignupForm component** (uses Button, Input, PasswordInput)
6. **Update login page** (uses LoginForm)
7. **Update signup page** (uses SignupForm)
8. **Write all tests**

## Critical Files

**Components to create:**

- `components/Button/Button.tsx` - Reusable button component
- `components/Button/Button.module.css` - Styles for the Button component
- `components/Input/Input.tsx` - Reusable text/email input component
- `components/Input/Input.module.css` - Styles for the Input component
- `components/PasswordInput/PasswordInput.tsx` - Reusable password input component
- `components/PasswordInput/PasswordInput.module.css` - Styles for the PasswordInput component
- `components/LoginForm/LoginForm.tsx` - Login form component
- `components/LoginForm/LoginForm.module.css` - Styles for the LoginForm component
- `components/SignupForm/SignupForm.tsx` - Signup form component
- `components/SignupForm/SignupForm.module.css` - Styles for the SignupForm component

**Pages to update:**

- `app/(public)/login/page.tsx` - Login page component
- `app/(public)/signup/page.tsx` - Signup page component

**Tests to create:**

- `tests/components/Button.test.tsx` - Test for the Button component
- `tests/components/Input.test.tsx` - Test for the Input component
- `tests/components/PasswordInput.test.tsx` - Test for the PasswordInput component

- `tests/components/LoginForm.test.tsx` - Test for the LoginForm component
- `tests/components/SignupForm.test.tsx` - Test for the SignupForm component

**Reference files:**

- `app/globals.css` - Theme colors and `.btn` class
- `components/Navbar/Navbar.tsx` - Component pattern reference
- `tests/components/Navbar.test.tsx` - Test for the Navbar component

## Styling Guidelines

**CSS Module Pattern:**

```css
@reference "../../app/globals.css";

.className {
  @apply tailwind-utilities;
}
```

**Theme Colors to Use:**

- Primary: `var(--color-primary)` or `@apply bg-primary / text-primary / border-primary`
- Error: `var(--color-error)` or `@apply text-error / border-error`
- Background: `@apply bg-lighter` for inputs
- Text: `@apply text-heading` for labels, `@apply text-body` for secondary text

**Button Styling:**

- Extend `.btn` from globals.css: `@apply btn`
- Loading state: `@apply opacity-75 cursor-not-allowed`

**Input Styling:**

- Base: `@apply px-4 py-2 rounded-lg bg-lighter border border-lighter text-heading`
- Focus: `@apply focus:outline-none focus:border-primary`
- Error: `@apply border-error`

**Form Layout:**

- Max width: `@apply w-full max-w-md mx-auto`
- Link colors: `@apply text-primary hover:text-secondary`

## Verification

After implementation:

1. **Visual Testing:**
   - Navigate to http://localhost:3000/login
   - Verify email and password fields render
   - Verify password toggle works (Eye/EyeOff icons)
   - Submit empty form - see validation errors
   - Submit invalid email - see email error
   - Submit valid form - check console for logged data
   - Verify loading state shows and form is disabled during submit
   - Click "Sign up" link - navigates to /signup

2. **Signup Page:**
   - Navigate to http://localhost:3000/signup
   - Same tests as login
   - Test password minimum length validation (< 6 chars)
   - Click "Log in" link - navigates to /login

3. **Run Tests:**

   ```bash
   npm test
   ```

   All component tests should pass

4. **Accessibility:**
   - Tab through form fields - proper focus order
   - Labels are associated with inputs
   - Toggle button has aria-label

5. **Styling:**
   - Forms match theme colors (purple/pink accents)
   - Buttons have hover states
   - Error messages are visible and red
   - Forms are centered on page
