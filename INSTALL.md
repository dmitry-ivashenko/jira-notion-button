# Quick Plugin Installation

## Installation Steps

1. **Open Chrome Extensions**
   - Go to: `chrome://extensions/`
   - Or: Chrome Menu → More Tools → Extensions

2. **Enable Developer Mode**
   - In the top right corner, enable "Developer mode" toggle

3. **Load Plugin**
   - Click "Load unpacked" button
   - Select the `jira-notion-button` folder (this folder with files)
   - Plugin will be installed

4. **Check Installation**
   - "Jira to Notion Copier" should appear in extensions list
   - Make sure it's enabled (toggle on the right)

## Testing

1. Open any ticket in Jira (e.g., `https://your-company.atlassian.net/browse/TICKET-123`)
2. The "📋 Copy to Notion" button should appear in the row with other buttons (like, share)
3. Click the button - information will be copied to clipboard
4. Paste in Notion (Ctrl+V or Cmd+V)

## Supported Domains

By default, the plugin works with:
- `*.atlassian.net` (Atlassian Cloud - e.g., `company.atlassian.net`)

### Adding Corporate Jira

If your Jira is on another domain, add it to `manifest.json`:

1. Open `manifest.json` file
2. Find the `"matches"` section
3. Add your domain:

```json
"matches": [
  "*://*.atlassian.net/*",
  "*://your-jira-domain.com/*"
]
```

4. Reload plugin in Chrome

## Troubleshooting

- **Button doesn't appear**: Refresh Jira page
- **Button placed poorly**: Plugin will automatically find the best place or use fallback
- **"Invalid host wildcard"**: Check domain correctness in manifest.json
- **Console errors**: Open DevTools (F12) → Console for diagnostics
- **Copying doesn't work**: Check plugin permissions

## What Gets Copied

### For Feature/Task tickets:
```
- [ ]  [TICKET-123](https://company.atlassian.net/browse/TICKET-123) - **Add User Dashboard**
    
    **Branch**: `feature/TICKET-123-add-user-dashboard` from `master` 
    
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
- [ ]  [BUG-456](https://company.atlassian.net/browse/BUG-456) - **Fix Login Error**
    
    **Branch**: `bugfix/BUG-456-fix-login-error` from `master` 
    
    **PR**: [paste link here]
    
    - Checklist
        - [ ]  code complete
        - [ ]  jira fields
        - [ ]  nice PR
        - [ ]  code coverage
        - [ ]  reviewed
        - [ ]  merged
```

The plugin automatically detects the ticket type and uses the appropriate branch prefix:
- **Bug** → `bugfix/` 
- **All others** (Task, Story, Epic, etc.) → `feature/`