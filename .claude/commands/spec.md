---
description: Create a feature spec file and branch from a short idea
argument-hint: Short feature description
allowed-tools: Read, Write, Glob, Bash(git switch:*)
---

Assist with drafting a new feature specification for this application using the short idea provided in the user input. Always follow all rules and requirements defined in any CLAUDE.md files.

User input: $ARGUMENTS

## High level behavior

Transform the user input above into the following output:

- Output a human-readable kebab-case feature title (e.g., new-heist-form).
- Output a non-colliding Git branch name (e.g., claude/feature/new-heist-form).
- Output a detailed Markdown spec at \_specs/<feature-name>.md.

Write the spec file to disk and print a short summary of what was done.

## Step 1. Check the current branch

Check the current Git branch, and abort this entire process if there are any uncommitted, unstaged, or untracked files in the working directory. Tell the user to commit or stash changes before proceeding, and DO NOT GO ANY FURTHER.

## Step 2. Parse the arguments

From `$ARGUMENTS`, extract:

1. `feature_title`
   - A short, human readable title in Title Case.
   - Example: "Card Component for Dashboard Stats".

2. `feature_slug`
   - A git safe slug.
   - Rules:
     - Lowercase
     - Kebab-case
     - Only `a-z`, `0-9` and `-`
     - Replace spaces and punctuation with `-`
     - Collapse multiple `-` into one
     - Trim `-` from start and end
     - Maximum length 40 characters
   - Example: `card-component` or `card-component-dashboard`.

3. `branch_name`
   - Format: `claude/feature/<feature_slug>`
   - Example: `claude/feature/card-component`.

If you cannot infer a sensible `feature_title` and `feature_slug`, ask the user to clarify instead of guessing.

## Step 3. Switch to a new Git branch

Before making any content, switch to a new Git branch using the `branch_name` derived from the `$ARGUMENTS`. If the branch name is already taken, then append a version number to it: e.g. `claude/feature/card-component-01`

## Step 4. Draft the spec content

Create a markdown spec document that Plan Mode can use directly and save it in the \_specs folder using the `feature_slug`. Use the exact structure as defined in the spec template file here: @\_specs/template.md. Do not add technical implementation details such as code examples.

## Step 5. Final output to the user

After the file is saved, respond to the user with a short summary in this exact format:

Branch: <branch_name>
Spec file: specs/<feature_slug>.md
Title: <feature_title>

Do not output the full spec in the chat unless the user specifically requests it. Goal: save the spec file, and report only its location and the Git branch name to use.
