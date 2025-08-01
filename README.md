# Jira to Notion Copier

Chrome extension for copying meta-information from Jira tickets to Notion format.

## Features

- **Two convenient buttons** on Jira ticket pages:
  - **📋 Copy to Notion**: Full formatted text with checklist
  - **🌿 Copy Branch**: Just the branch name for quick Git operations
- Extracts ticket information (ID, title, type, URL)
- Smart branch naming based on ticket type:
  - **Bug tickets**: `bugfix/TICKET-ID-description`
  - **Other tickets**: `feature/TICKET-ID-description`
- Formats text in convenient Notion format with checklist
- Intelligent button placement in existing action button rows

## Copied Text Format

### For Feature/Task tickets:
```
- [ ]  [COLLAB-8264](https://roblox.atlassian.net/browse/COLLAB-8264) - **Select Syncing Root Action**
    
    **Branch**: `feature/COLLAB-8264-select-syncing-root-action` from `master` 
    
    **PR**: [paste link here]
    
    - Checklist
        - [ ]  code complete
        - [ ]  jira fields
        - [ ]  nice PR
        - [ ]  code coverage
        - [ ]  reviewed
        - [ ]  merged
```

### For Bug tickets:
```
- [ ]  [COLLAB-8986](https://roblox.atlassian.net/browse/COLLAB-8986) - **Fix Symlink-Related Issues**
    
    **Branch**: `bugfix/COLLAB-8986-fix-symlink-related-issues` from `master` 
    
    **PR**: [paste link here]
    
    - Checklist
        - [ ]  code complete
        - [ ]  jira fields
        - [ ]  nice PR
        - [ ]  code coverage
        - [ ]  reviewed
        - [ ]  merged
```

## Installation

### Method 1: Install from source code (Developer mode)

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked extension"
5. Select the folder with plugin files
6. Plugin will be installed and ready to use

### Method 2: Install from Chrome Web Store

_Not available yet - plugin in development_

## Usage

1. Open any ticket in Jira (URL should contain `/browse/TICKET-ID`)
2. Two buttons will appear in the row with other action buttons (like, share, subscribe):
   - **📋 Copy to Notion**: Copies full formatted text with checklist
   - **🌿 Copy Branch**: Copies just the branch name (e.g., `feature/TICKET-123-add-feature`)
3. Click the desired button
4. Information will be copied to clipboard
5. Paste where needed:
   - **Notion**: Paste full text (Ctrl+V / Cmd+V)
   - **Terminal**: Create Git branch (`git checkout -b [paste branch name]`)

### Button Placement

The plugin intelligently determines where to place the button:
1. **Priority 1**: In the row with action buttons (like, share, comments)
2. **Priority 2**: In the actions area under the title
3. **Priority 3**: Separate line under the ticket title
4. **Fallback**: Minimally intrusive floating element

## Supported Sites

- `*.atlassian.net` (Atlassian Cloud)

For corporate Jira installations, add your domain to `manifest.json` - see instructions in the "Troubleshooting" section.

## File Structure

```
jira-notion-button/
├── manifest.json          # Plugin configuration
├── content.js             # Main logic (content script)
├── styles.css             # Button styles
├── popup.html             # HTML for popup window
├── popup.js               # Popup window logic
├── icons/                 # Plugin icons
└── README.md              # This documentation
```

## Development

### Local Development

1. Make changes to files
2. Reload plugin in `chrome://extensions/` ("Reload" button)
3. Refresh Jira page to apply changes

### Adding New Features

- Main logic is in `content.js`
- Button styles in `styles.css`
- Configuration in `manifest.json`

## Troubleshooting

### Button doesn't appear

1. Make sure you're on a Jira ticket page (URL contains `/browse/`)
2. Check that plugin is installed and enabled
3. Refresh the page
4. Check browser console for errors

### Adding Corporate Jira

If your Jira is not on `*.atlassian.net`, add your domain to `manifest.json`:

1. Open `manifest.json` file
2. Find the `"matches"` section in `content_scripts`
3. Add your domain:

```json
"matches": [
  "*://*.atlassian.net/*",
  "*://your-jira-domain.com/*"
]
```

4. Save the file
5. In `chrome://extensions/` click "Reload" for the plugin

### Button overlaps elements

The plugin tries to automatically find the best place to place the button. If the button is placed poorly:
1. Try refreshing the page
2. Check browser console for errors
3. The button automatically uses fallback placement if it can't find a suitable place

### Information extracted incorrectly

- Jira may change page structure
- Plugin tries to find elements in different ways
- For issues, open developer console for diagnostics

### Copying doesn't work

1. Make sure the plugin has `clipboardWrite` permission
2. Check that your browser supports Clipboard API
3. Fallback method is used for older browsers

## Changelog

### v1.3
- **🌿 New Branch Copy Button**: Added dedicated button for copying just branch names
- **Two-button interface**: "📋 Copy to Notion" + "🌿 Copy Branch" side by side
- **Improved Git workflow**: Quick branch creation with `git checkout -b [branch-name]`
- **Enhanced styling**: Green branch button to distinguish from Notion button
- **Better organization**: Buttons grouped in container for cleaner layout

### v1.2
- **Improved ticket type detection**: Added support for new Jira UI breadcrumbs
- **Multiple detection methods**: Uses 4 different methods to find ticket type
- **Better reliability**: Targets specific `data-testid` selectors from Jira breadcrumbs
- **Debug logging**: Added console logging to help troubleshoot type detection issues
- **Enhanced selectors**: Works with `aria-label` and `alt` attributes in breadcrumb buttons

### v1.1
- **Smart branch naming**: Automatic detection of ticket type
- **Bug-specific prefixes**: Bug tickets use `bugfix/` prefix instead of `feature/`
- **Improved branch names**: Auto-generated from ticket title (e.g., `feature/TICKET-123-add-user-dashboard`)
- **Enhanced popup**: Shows ticket type in status display

### v1.0
- First version of plugin
- Basic meta-information copying functionality
- Support for main Jira sites

## License

MIT License