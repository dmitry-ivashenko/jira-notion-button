# Features Overview

## Smart Branch Naming Based on Ticket Type (v1.1+)

### Improved Type Detection (v1.2)

The plugin now automatically detects the Jira ticket type and generates appropriate branch names.

### How it works:

1. **Ticket Type Detection**: Plugin extracts ticket type from Jira page (Bug, Task, Story, Epic, etc.)
2. **Smart Prefix Selection**: 
   - Bug tickets → `bugfix/` prefix
   - All other tickets → `feature/` prefix
3. **Auto-generated Branch Names**: Creates clean branch names from ticket titles

### Examples:

#### Bug Ticket:
- **Ticket**: `COLLAB-8986 - Fix Symlink-Related Issues`
- **Type**: Bug
- **Generated Branch**: `bugfix/COLLAB-8986-fix-symlink-related-issues`

#### Feature Ticket:
- **Ticket**: `COLLAB-8264 - Select Syncing Root Action`  
- **Type**: Task
- **Generated Branch**: `feature/COLLAB-8264-select-syncing-root-action`

### Supported Ticket Types:

- ✅ **Bug** → `bugfix/` prefix
- ✅ **Task** → `feature/` prefix  
- ✅ **Story** → `feature/` prefix
- ✅ **Epic** → `feature/` prefix
- ✅ **Sub-task** → `feature/` prefix
- ✅ **Initiative** → `feature/` prefix
- ✅ **Deliverable** → `feature/` prefix

### Branch Name Generation Rules:

1. Convert to lowercase
2. Remove special characters
3. Replace spaces with hyphens
4. Remove multiple consecutive hyphens
5. Limit to 50 characters
6. Remove leading/trailing hyphens

### Popup Enhancement:

The popup now shows the detected ticket type:
- `✅ Found ticket: COLLAB-8986 (Bug)`
- `✅ Found ticket: COLLAB-8264 (Task)`

### v1.2 Improvements - Enhanced Type Detection:

The plugin now uses **4 different detection methods** to find ticket type:

1. **Method 1 (Primary)**: Breadcrumb change type button
   - Selector: `[data-testid="issue.views.issue-base.foundation.change-issue-type.button"]`
   - Extracts from `aria-label`: `"Bug - Change work type"` → `"Bug"`
   - Fallback to `img[alt]` attribute inside button

2. **Method 2**: Traditional issue type selectors
   - Various `data-testid` and `aria-label` combinations

3. **Method 3**: Breadcrumb navigation elements
   - Searches `[role="navigation"]` for type information

4. **Method 4**: General navigation fallback
   - Broad search in all navigation elements

### Troubleshooting Type Detection:

If ticket type is not detected properly:

1. **Open Browser Console** (F12 → Console tab)
2. **Look for logs** starting with `"Jira to Notion:"`
3. **Check what was found**:
   - `"Found ticket type: Bug - Change work type -> cleaned to: Bug"` ✅ Success
   - `"No ticket type found, will use default 'feature' prefix"` ❌ Issue

### Common Issues:

- **New Jira UI changes**: Plugin adapts to multiple selector patterns
- **Different Jira configurations**: Fallback methods handle variations
- **Custom ticket types**: Add your types to the supported list

### Debugging Steps:

1. Refresh the Jira page
2. Check console for detection logs
3. If type not found, report the page structure via GitHub issues

### Fallback Behavior:

- If ticket type cannot be detected → defaults to `feature/` prefix
- If title is empty or invalid → uses `branch-name` as suffix
- Plugin works gracefully even if type detection fails
- Console logging helps identify detection issues