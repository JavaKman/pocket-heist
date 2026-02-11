---
description: Create a figma feature
argument-hint: "figma: <component-link>"
allowed-tools: Read, Write, Glob
---

Assist with drafting a new feature specification for this application using the short idea provided in the user input. Always follow all rules and requirements defined in any CLAUDE.md files.

User input: $ARGUMENTS

## High level behavior

Transform the user input above into the following output:

- A detailed Markdown file under the \_specs/ directory.
- A figma design note

Write the spec file to disk and print a short summary of what was done.

## Step 1. Parse the arguments

From `$ARGUMENTS`, extract:

1. `feature_title`
   - A short, human-readable title in Title Case
   - Example: "Card Component for Dashboard Stats"

2. `feature_slug` — A git-safe slug derived from the title
   - Rules:
     - Lowercase
     - Kebab-case
     - Only `a-z`, `0-9` and `-`
     - Replace spaces and punctuation with `-`
     - Collapse multiple `-` into one
     - Trim `-` from start and end
     - Maximum length 40 characters
   - Example: `card-component` or `card-component-dashboard`

3. `figma_hint` — The Figma component link (if present)
   - If `$ARGUMENTS` contains the substring `figma:`
   - Then the text after `figma:` is the component link
   - Trim whitespace
   - Example input:
     - `/spec Card component, figma: https://www.figma.com/design/some-link`
     - `figma_hint` becomes `https://www.figma.com/design/some-link`

## Step 2. Pull Figma context when needed

If `figma_hint` is present and Figma MCP tools are available:

Use the **figma-design-extractor** subagent to provide a design guide for the future, citing the `figma_hint` and tell it to:

1. Use the Figma MCP tools to locate the component, layer or frame.
2. Extract only information that is useful for implementation, such as:
   - Dimensions and layout (grid, spacing, alignment)
   - Key typography tokens (font family, size, weight)
   - Color tokens and semantic usage (primary, surface, border, error, etc.)
   - Border radius, shadows, and any notable visual detail
   - Icons, buttons, links or other UI elements
3. Summarise this as 3 to 8 concise bullet points and also leave a link to the figma component for future lookups.
4. If lookup fails or the tools are not available, record a note like:
   - `"Design reference could not be retrieved. See Figma manually for details."`

Always summarise into human-friendly notes.

## Step 3. Draft the spec content

Create a markdown spec document that Plan Mode can use directly and save it in the \_specs folder using the `feature_slug`. Use the exact structure as defined in the spec template file here: @\_specs/template.md. Do not add technical implementation details such as code examples.

## Step 4. Final output to the user

After the file is saved, respond to the user with a short summary in this exact format:

Spec file: \_specs/<feature_slug>.md
Title: <feature_title>

Do not output the full spec in the chat unless the user specifically requests it. Goal: save the spec file, and report only its location.
