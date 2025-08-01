# Testing Guide for v1.3 - Branch Copy Button

## How to Test the New Feature

### Step 1: Update Plugin
1. Go to `chrome://extensions/`
2. Find "Jira to Notion Copier"
3. Click **"Reload"** button (🔄)
4. Plugin is now updated to v1.3

### Step 2: Test Both Buttons
1. **Open any Jira ticket** (Bug or Feature/Task)
2. **Look for TWO buttons** in the action button row:
   - **📋 Copy to Notion** (blue button)
   - **🌿 Copy Branch** (green button)

### Step 3: Test Branch Copy Button
1. **Click "🌿 Copy Branch"** 
2. **Open terminal/command prompt**
3. **Type**: `git checkout -b ` (with space at end)
4. **Paste**: Ctrl+V (or Cmd+V)
5. **Result should be**:
   ```bash
   # For Bug ticket:
   git checkout -b bugfix/COLLAB-8986-fix-symlink-related-issues
   
   # For Feature ticket:
   git checkout -b feature/COLLAB-8264-select-syncing-root-action
   ```

### Step 4: Test Notion Button (Still Works)
1. **Click "📋 Copy to Notion"**
2. **Paste in Notion** (Ctrl+V or Cmd+V)
3. **Should get full formatted text** with checklist

## Expected Results

### ✅ Success Indicators:
- **Two buttons visible** side by side
- **Green "🌿 Copy Branch"** button appears
- **Button states work**: ⏳ Copying... → ✅ Copied!
- **Branch name format**: `prefix/TICKET-ID-description`
- **Bug tickets** → `bugfix/` prefix
- **Other tickets** → `feature/` prefix

### 🎨 Visual Expectations:
- **Button colors**: Blue (Notion) + Green (Branch)
- **Icons**: 📋 (clipboard) + 🌿 (branch)
- **Grouped together** in same row as like/share buttons
- **Consistent sizing** with other Jira buttons

## Use Cases to Test

### 1. **Quick Git Workflow**:
```bash
# 1. Click 🌿 Copy Branch
# 2. In terminal:
git checkout -b [Ctrl+V]
# 3. Start coding
```

### 2. **Pull Request Creation**:
```bash
# 1. Copy branch name
# 2. Create branch and push:
git checkout -b [branch-name]
git push -u origin [branch-name]
# 3. Create PR with same name
```

### 3. **Both Buttons Workflow**:
```
1. 🌿 Copy Branch → Create Git branch
2. Work on feature
3. 📋 Copy to Notion → Update status
```

## Troubleshooting

### ❌ If Button Not Visible:
1. **Refresh Jira page**
2. **Check URL** contains `/browse/TICKET-ID`
3. **Open browser console** (F12) for errors
4. **Try different ticket types** (Bug vs Task)

### ❌ If Wrong Branch Format:
1. **Check console logs** for ticket type detection
2. **Expected formats**:
   - `bugfix/TICKET-123-description` (for bugs)
   - `feature/TICKET-123-description` (for others)

### ❌ If Copy Doesn't Work:
1. **Check clipboard permissions** in browser
2. **Try on different Jira ticket**
3. **Look for error messages** in console

## What's New in v1.3

- **🌿 Branch button**: Green, dedicated for Git workflow
- **Two-button interface**: Both buttons work independently  
- **Smart placement**: Buttons grouped in container
- **Enhanced UX**: Different colors to distinguish functions
- **Git-optimized**: Perfect for `git checkout -b [branch]`

The new branch button makes Git workflow much faster! 🚀