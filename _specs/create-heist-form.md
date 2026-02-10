# Spec for Create Heist Form

branch: claude/feature/create-heist-form
figma_component (if used): N/A

## Summary

Implement a functional create heist form at `/heists/create` that allows authenticated users to create new heist missions and assign them to other users. The form should collect heist details, save them to a Firestore `heists` collection, and redirect to the `/heists` page upon successful submission.

## Functional Requirements

- Display a form with input fields matching the `CreateHeistInput` interface:
  - **Title** (text input, required)
  - **Description** (textarea, required)
  - **Assigned To** (dropdown/select, required) - populated from users collection with user codenames

- Auto-populate fields programmatically:
  - `createdBy` - current authenticated user's UID
  - `createdByCodename` - current authenticated user's codename (fetched from users collection)
  - `assignedTo` - selected user's UID from dropdown
  - `assignedToCodename` - selected user's codename from dropdown
  - `createdAt` - Firestore serverTimestamp()
  - `deadline` - Firestore serverTimestamp() calculated as 48 hours from creation
  - `finalStatus` - set to null

- Fetch and display all users from the Firestore `users` collection to populate the "Assigned To" dropdown
  - Display user codenames in the dropdown
  - Store the selected user's UID and codename

- Form validation:
  - Title is required (minimum 3 characters)
  - Description is required (minimum 10 characters)
  - A user must be selected from the "Assigned To" dropdown
  - Display appropriate error messages for validation failures

- On form submission:
  - Validate all fields
  - Create a new document in the Firestore `heists` collection using the `CreateHeistInput` interface
  - Show loading state during submission
  - On success, redirect to `/heists` page
  - On error, display error message to user without losing form data

- Form should use existing UI components (Button, Input) for consistency with the rest of the application

- Form should be centered using the `.center-content` class and have a title using the `.form-title` class

## Possible Edge Cases

- User is not authenticated - should be redirected to login (auth guard needed)
- Users collection is empty - show message "No users available to assign"
- Firestore write fails - display error message, allow retry
- Network timeout during submission - handle gracefully with timeout message
- User navigates away during submission - no partial heist created
- Same user assigns heist to themselves - allow this behavior
- Very long title or description - enforce maximum character limits (title: 100 chars, description: 500 chars)
- User tries to submit form multiple times rapidly - disable submit button during submission

## Acceptance Criteria

- Form renders with all required fields (title, description, assigned to dropdown)
- Users from Firestore `users` collection populate the dropdown with codenames
- Current user's information is automatically determined from auth context
- Form validates all fields before submission
- Invalid submissions show clear error messages
- Valid submissions create a heist document in Firestore with all required fields
- `createdAt` uses Firestore serverTimestamp()
- `deadline` is set to 48 hours from creation using serverTimestamp()
- After successful submission, user is redirected to `/heists`
- Submit button shows loading state during submission
- Form is disabled during submission to prevent double-submission
- Error messages are displayed if Firestore write fails

## Open Questions

- Should users be able to assign heists to themselves? No. Don't show current logged in user in dropdown for this field.
- Should there be a confirmation step before creating the heist? No.
- Should the form auto-save as draft to local storage? Yes.
- What happens if a user is deleted after being assigned a heist? Show a message instead of the form.
- Should there be an option to set a custom deadline instead of the default 48 hours? No.

## Testing Guidelines

Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy.

- Form renders with all required fields
- Title input accepts and displays text
- Description textarea accepts and displays text
- Assigned To dropdown is populated (mock Firestore users collection)
- Form shows validation errors when fields are empty
- Form shows validation errors when title is too short (< 3 chars)
- Form shows validation errors when description is too short (< 10 chars)
- Form shows validation errors when no user is selected
- Submit button is disabled when form is invalid
- Submit button shows loading state during submission
- Form is disabled during submission
- Successful submission calls Firestore with correct data structure
- Form redirects to /heists after successful submission
- Error message is displayed when Firestore write fails
