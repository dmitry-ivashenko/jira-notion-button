# 🌿 Branch Copy Button - New in v1.3

## Overview

The new **🌿 Copy Branch** button provides a quick way to copy just the branch name for Git operations, without the full Notion-formatted text.

## Visual Design

- **Color**: Green (`#36b37e`) to distinguish from the blue Notion button
- **Icon**: 🌿 (branch/plant emoji) to represent Git branches
- **Text**: "Copy Branch"
- **Placement**: Right next to the "📋 Copy to Notion" button

## What It Copies

### Bug Tickets:
```
bugfix/COLLAB-8986-fix-symlink-related-issues
```

### Feature/Task Tickets:
```
feature/COLLAB-8264-select-syncing-root-action
```

## Use Cases

### 1. **Quick Git Branch Creation**
```bash
# Click 🌿 Copy Branch button, then:
git checkout -b [Ctrl+V]

# Example result:
git checkout -b feature/COLLAB-8264-select-syncing-root-action
```

### 2. **Pull Request Creation**
```bash
# Create and push branch
git checkout -b [branch-name]
git push -u origin [branch-name]

# Then create PR with same branch name
```

### 3. **Code Review Commands**
```bash
# Check out colleague's branch for review
git fetch origin
git checkout [branch-name]
```

### 4. **Branch Management**
```bash
# Delete merged branches
git branch -d [branch-name]
git push origin --delete [branch-name]
```

## Benefits Over Full Copy

1. **Speed**: One click → immediate Git command
2. **Clean**: No markdown formatting to clean up
3. **Consistent**: Always uses the same branch naming convention
4. **Workflow**: Optimized for developer Git workflow

## Button Behavior

### States:
- **Default**: `🌿 Copy Branch` (green)
- **Loading**: `⏳ Copying...` (disabled)
- **Success**: `✅ Copied!` (2 second timeout)
- **Error**: `❌ Error` (2 second timeout)

### Error Handling:
- Shows error if ticket info can't be extracted
- Graceful fallback to generic branch name if title is missing
- Console logging for debugging

## Technical Implementation

### Branch Name Generation:
1. **Extract ticket type** → determine prefix (`bugfix/` or `feature/`)
2. **Clean ticket title** → remove special chars, replace spaces with `-`
3. **Limit length** → max 50 characters for branch suffix
4. **Combine** → `prefix/TICKET-ID-cleaned-title`

### Integration:
- Uses same `extractTicketInfo()` function as Notion button
- Shares CSS classes for consistent styling
- Grouped in button container for proper layout

## Examples by Ticket Type

| Ticket Type | Example Input | Branch Output |
|-------------|---------------|---------------|
| Bug | "Fix login error" | `bugfix/BUG-123-fix-login-error` |
| Task | "Add user dashboard" | `feature/TASK-456-add-user-dashboard` |
| Story | "User can view profile" | `feature/STORY-789-user-can-view-profile` |
| Epic | "Implement payment system" | `feature/EPIC-101-implement-payment-system` |

## Developer Workflow Integration

### Typical Flow:
1. **Open Jira ticket** 
2. **Click 🌿 Copy Branch**
3. **Switch to terminal**
4. **Create branch**: `git checkout -b [Ctrl+V]`
5. **Start coding** with proper branch name
6. **Later**: Use 📋 Copy to Notion for status updates

This creates a seamless flow from Jira ticket → Git branch → development → Notion tracking.