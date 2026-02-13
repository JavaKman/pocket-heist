# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Pocket Heist** is a web application for creating and managing office missions/pranks with teammates. The app is a starter project for the Claude Code Masterclass.

**Tagline**: "Tiny missions. Big office mischief."

## Commands

```bash
# Development
npm install      # Install dependencies
npm run dev      # Start dev server (localhost:3000)

# Production
npm run build    # Build for production
npm start        # Start production server

# Quality Assurance
npm run lint     # Run ESLint
npm test         # Run vitest tests
```

## Tech Stack

### Core Framework

- **Next.js 16.0.7** - React framework with App Router (file-based routing)
- **React 19.2.0** - UI library
- **TypeScript 5** - Strict mode enabled, target: ES2017

### Styling

- **Tailwind CSS 4** - Utility-first CSS framework
- **PostCSS** - CSS processing via `@tailwindcss/postcss`
- **CSS Modules** - Component-scoped styles (`.module.css` files)
- **Google Fonts** - Inter font family

### Testing

- **Vitest 4.0.15** - Unit test framework with jsdom environment
- **React Testing Library** - Component testing utilities
- **@testing-library/jest-dom** - Custom matchers for DOM assertions
- **@testing-library/user-event** - User interaction simulation

### UI Libraries

- **lucide-react 0.556.0** - Icon library (Clock8 icon used for branding)

### Development Tools

- **ESLint 9** - Linting with Next.js config (core-web-vitals + typescript)
- **Vite** - Used via vitest for test running
- **vite-tsconfig-paths** - Resolve TypeScript path aliases in tests

## Architecture

### Next.js App Router Structure

The project uses Next.js 16's App Router with **route groups** for logical separation without affecting URLs:

```
app/
├── layout.tsx                    # Root layout (html, body, metadata)
├── globals.css                   # Global styles, theme, typography
├── (public)/                     # Route group: unauthenticated pages
│   ├── layout.tsx               # Wrapper with .public class
│   ├── page.tsx                 # Home/splash page (/)
│   ├── login/page.tsx           # Login page (/login)
│   ├── signup/page.tsx          # Signup page (/signup)
│   └── preview/page.tsx         # UI preview page (/preview)
└── (dashboard)/                  # Route group: authenticated pages
    ├── layout.tsx               # Includes Navbar component
    └── heists/
        ├── page.tsx             # Heists list (/heists)
        ├── create/page.tsx      # Create heist form (/heists/create)
        └── [id]/page.tsx        # Heist details (/heists/[id])
```

**Key Concepts:**

- **Route Groups**: `(public)` and `(dashboard)` organize routes without affecting URLs
- **Nested Layouts**: Root layout → route group layout → page
- **Dynamic Routes**: `[id]` parameter for individual heist details
- Each route has a `page.tsx` file as the UI entry point

### Page Implementations

#### Public Pages (Unauthenticated)

**Home Page** (`app/(public)/page.tsx`)

- Splash page with app branding and Clock8 icon
- Shows tagline and description
- Should route to `/heists` if logged in, `/login` if not (logic to be implemented)

**Login Page** (`app/(public)/login/page.tsx`)

- Renders `LoginForm` component with email and password fields
- Uses `.center-content` and `.form-title` classes

**Signup Page** (`app/(public)/signup/page.tsx`)

- Renders `SignupForm` component with email and password fields
- Uses `.center-content` and `.form-title` classes

**Preview Page** (`app/(public)/preview/page.tsx`)

- Page for previewing newly created UI components
- Developer tool for testing components in isolation

#### Dashboard Pages (Authenticated)

**Heists List** (`app/(dashboard)/heists/page.tsx`)

- Main dashboard with three sections:
  - Your Active Heists
  - Heists You've Assigned
  - All Expired Heists
- Uses `.page-content` wrapper

**Create Heist** (`app/(dashboard)/heists/create/page.tsx`)

- Form for creating new heists
- Centered layout with `.center-content` and `.form-title`

**Heist Details** (`app/(dashboard)/heists/[id]/page.tsx`)

- View individual heist details by ID
- Uses `.page-content` wrapper

### Components

**Component Structure Pattern:**

```
components/ComponentName/
├── ComponentName.tsx           # Component implementation
├── ComponentName.module.css    # Scoped styles
└── index.ts                    # Barrel export: export { default } from './ComponentName'
```

#### UI Components

**Button** (`components/Button/`)

- Reusable button with loading state support
- Props: `type`, `loading`, `disabled`, `onClick`
- Displays children content; disables interaction when loading

**Input** (`components/Input/`)

- Text input field with label and error display
- Props: `id`, `name`, `type` (text/email), `label`, `value`, `onChange`, `error`, `placeholder`, `required`, `disabled`, `autoComplete`
- Shows error message below input when `error` prop is provided

**PasswordInput** (`components/PasswordInput/`)

- Password input with show/hide toggle functionality
- Similar props to Input component
- Includes eye icon to toggle password visibility

**Avatar** (`components/Avatar/`)

- User avatar component for displaying profile pictures

**Skeleton** (`components/Skeleton/`)

- Loading skeleton placeholder for content

#### Navigation

**Navbar** (`components/Navbar/`)

- Navigation component used in dashboard layout
- Shows site logo with Clock8 icon and tagline
- "Create Heist" link to `/heists/create`
- Logo links to `/heists`

#### Form Components

**LoginForm** (`components/LoginForm/`)

- Client component ("use client") with form state management
- Fields: email, password
- Email validation: required, valid email format
- Password validation: required
- Simulates API call with 1-second delay (to be replaced with actual auth)
- Includes link to signup page
- Uses `Input`, `PasswordInput`, and `Button` components

**SignupForm** (`components/SignupForm/`)

- Client component with form state management
- Fields: email, password
- Email validation: required, valid email format
- Password validation: required, minimum 6 characters
- Simulates API call with 1-second delay (to be replaced with actual auth)
- Includes link to login page
- Uses `Input`, `PasswordInput`, and `Button` components

## Styling System

### Theme Colors (defined in `app/globals.css`)

```css
--color-primary: #c27aff (purple) --color-secondary: #fb64b6 (pink) --color-dark: #030712 (near black) --color-light: #0a101d (dark blue)
  --color-lighter: #101828 (lighter dark blue) --color-success: #05df72 (green) --color-error: #ff6467 (red) --color-heading: white --color-body: #99a1af (gray);
```

### Global CSS Classes

```css
.page-content      # Standard page wrapper: mx-auto, w-6xl, max-w-full
.center-content    # Vertically centered: flex, justify-center, min-h-lvh
.form-title        # Form headings: text-center, text-xl, font-bold
.public h1         # Large headings in public pages: text-4xl
svg.logo           # Inline block for logo icons
```

### Styling Approach

1. **Tailwind Utilities** - Primary styling method using Tailwind classes
2. **CSS Modules** - Component-scoped styles with `@apply` directives
3. **Global Styles** - Theme colors and reusable classes in `globals.css`

**Example from Navbar.module.css:**

```css
@reference "../../app/globals.css";

.siteNav {
  @apply bg-light px-2 py-4;
}
```

## Testing

### Test Setup

- **Framework**: Vitest with jsdom environment
- **Config**: `vitest.config.mts` enables React plugin and tsconfig paths
- **Setup File**: `vitest.setup.ts` imports `@testing-library/jest-dom`
- **Global Utilities**: `describe`, `it`, `expect` available without imports

### Test Structure

Tests mirror component structure in `tests/` directory:

```
tests/
└── components/
    ├── Avatar.test.tsx
    ├── Button.test.tsx
    ├── Input.test.tsx
    ├── LoginForm.test.tsx
    ├── Navbar.test.tsx
    ├── PasswordInput.test.tsx
    ├── SignupForm.test.tsx
    └── Skeleton.test.tsx
```

### Test Patterns

**Example from `Navbar.test.tsx`:**

```typescript
import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import Navbar from "@/components/Navbar"

describe("Navbar", () => {
  it("renders the main heading", () => {
    render(<Navbar />)
    const heading = screen.getByRole("heading", { level: 1 })
    expect(heading).toBeInTheDocument()
  })

  it("renders the Create Heist link", () => {
    render(<Navbar />)
    const createLink = screen.getByRole("link", { name: /create heist/i })
    expect(createLink).toBeInTheDocument()
    expect(createLink).toHaveAttribute("href", "/heists/create")
  })
})
```

**Testing Conventions:**

- Query by role for accessibility
- Use regex for flexible text matching (`/create heist/i`)
- Test behavior, not implementation
- Use `toBeInTheDocument()` and other jest-dom matchers

## TypeScript Configuration

### Key Settings (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "strict": true, // Strict type checking
    "target": "ES2017",
    "module": "esnext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "paths": {
      "@/*": ["./*"] // Path alias for imports
    },
    "types": ["vitest/globals"] // Global test utilities
  }
}
```

### Import Aliases

Use `@/*` for all imports from project root:

```typescript
import "@/app/globals.css";
import Navbar from "@/components/Navbar";
import { Clock8 } from "lucide-react"; // External packages use standard imports
```

## File Organization

### Project Structure

```
pocket_heist/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   ├── (public)/          # Public routes
│   └── (dashboard)/       # Protected routes
├── components/            # Reusable components
│   ├── Avatar/
│   ├── Button/
│   ├── Input/
│   ├── LoginForm/
│   ├── Navbar/
│   ├── PasswordInput/
│   ├── SignupForm/
│   └── Skeleton/
├── tests/                 # Test files
│   └── components/
├── public/                # Static assets (skeleton.png)
├── info/                  # Documentation
├── Configuration files:
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.ts
│   ├── vitest.config.mts
│   ├── vitest.setup.ts
│   ├── eslint.config.mjs
│   └── postcss.config.mjs
└── README.md
```

### Naming Conventions

- **Components**: PascalCase (e.g., `Navbar.tsx`)
- **Pages**: lowercase `page.tsx` in route folders
- **Layouts**: lowercase `layout.tsx` in route folders
- **CSS Modules**: `ComponentName.module.css`
- **Tests**: `ComponentName.test.tsx`

## Configuration Details

### ESLint (`eslint.config.mjs`)

Uses flat config system with Next.js presets:

```javascript
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
```

Ignores: `.next/`, `out/`, `build/`, `next-env.d.ts`

### PostCSS (`postcss.config.mjs`)

Single plugin configuration for Tailwind:

```javascript
plugins: {
  "@tailwindcss/postcss": {}
}
```

### Vitest (`vitest.config.mts`)

```typescript
{
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',      // Browser environment simulation
    globals: true,             // Global test functions
    setupFiles: ['./vitest.setup.ts']
  }
}
```

### Next.js (`next.config.ts`)

Currently uses default configuration (empty config object).

## Development Workflow

1. **Install Dependencies**: `npm install`
2. **Start Dev Server**: `npm run dev` → http://localhost:3000
3. **Make Changes**: Files auto-reload on save
4. **Run Tests**: `npm test` (watch mode by default)
5. **Lint Code**: `npm run lint`
6. **Build**: `npm run build` before deploying

### Adding New Components

1. Create component directory in `components/`
2. Add `ComponentName.tsx` with default export
3. Add `ComponentName.module.css` for styles
4. Add `index.ts` for barrel export
5. Create test file in `tests/components/ComponentName.test.tsx`

### Adding New Routes

1. Create folder in `app/(public)/` or `app/(dashboard)/`
2. Add `page.tsx` for the route
3. Optionally add `layout.tsx` for nested layout
4. Use `[param]` syntax for dynamic routes

## Current State & Next Steps

**Completed:**

- ✅ Basic UI components (Button, Input, PasswordInput, Avatar, Skeleton)
- ✅ Login and Signup forms with client-side validation
- ✅ Form components with error handling and loading states
- ✅ Component tests for all UI components

**Key Missing Implementations:**

- **Authentication**: Forms simulate API calls; need real backend integration
- **Data Layer**: No database or API integration
- **Create Heist Form**: Form page exists but needs implementation
- **State Management**: No heist data state management
- **Heist List**: Empty placeholder sections need data
- **Authorization**: Route protection logic needed (redirect unauthenticated users)

The foundation is solid with modern tooling, testing setup, clear architecture patterns, and a growing component library.

## Checking Documentation

- **important:** When implementing any lib/framework-specific features, ALWAYS check the appropriate lib/framework documentation using the Context7 MCP server before writting any code.
