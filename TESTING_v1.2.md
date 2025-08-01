# Testing Guide for v1.2 - Improved Type Detection

## How to Test the Fix

### Step 1: Update Plugin
1. Go to `chrome://extensions/`
2. Find "Jira to Notion Copier" 
3. Click **"Reload"** button (🔄)
4. Plugin is now updated to v1.2

### Step 2: Test on Bug Ticket
1. **Open a Bug ticket** in Jira (like COLLAB-8986)
2. **Open Browser Console** (F12 → Console tab)
3. **Click "📋 Copy to Notion" button**
4. **Check Console Logs** - you should see:
   ```
   Jira to Notion: Found ticket type: Bug - Change work type -> cleaned to: Bug
   ```
5. **Check copied text** - should start with:
   ```
   **Branch**: `bugfix/COLLAB-8986-fix-symlink-related-issues`
   ```

### Step 3: Test on Feature/Task Ticket  
1. **Open a Task/Story ticket** in Jira
2. **Check console logs** - should see the detected type
3. **Verify branch prefix** - should be `feature/`

### Step 4: Check Popup Status
1. **Click plugin icon** in Chrome toolbar
2. **Should show**: `✅ Found ticket: TICKET-ID (Bug)` or `(Task)`

## Expected Behavior

### ✅ Success Cases:
- Console shows: `"Found ticket type: [Type] -> cleaned to: [Type]"`
- Bug tickets → `bugfix/` prefix
- Other tickets → `feature/` prefix  
- Popup shows ticket type in parentheses

### ❌ If Still Not Working:
- Console shows: `"No ticket type found, will use default 'feature' prefix"`
- **Action**: Copy the console output and page HTML structure
- **Report**: Create GitHub issue with the information

## Debug Information to Collect

If type detection still fails:

1. **Console Output**:
   ```javascript
   // Open console and run:
   console.log('Change type button:', document.querySelector('[data-testid="issue.views.issue-base.foundation.change-issue-type.button"]'));
   ```

2. **Page Structure**:
   ```javascript
   // Check breadcrumbs:
   console.log('Breadcrumbs:', document.querySelector('nav[aria-label="Work item breadcrumbs"]'));
   ```

3. **Full Detection Log**:
   - All `"Jira to Notion:"` messages from console
   - Any error messages

## What Changed in v1.2

- **Primary Detection**: Now targets the exact button from your HTML snippet
- **Selector**: `[data-testid="issue.views.issue-base.foundation.change-issue-type.button"]`
- **Extraction**: From `aria-label="Bug - Change work type"` → `"Bug"`
- **Fallback**: Multiple backup methods if primary fails
- **Debugging**: Console logs show detection process

The plugin should now correctly detect "Bug" from your Jira page structure!