// Jira to Notion Copier Content Script

// Function to determine if we are on a Jira ticket page
function isJiraTicketPage() {
    // Check URL for /browse/ which is characteristic of ticket pages
    const urlPattern = /\/browse\/[A-Z]+-\d+/;
    return urlPattern.test(window.location.pathname);
}

// Function to extract ticket information
function extractTicketInfo() {
    try {
        // Extract ticket ID from URL
        const ticketIdMatch = window.location.pathname.match(/\/browse\/([A-Z]+-\d+)/);
        const ticketId = ticketIdMatch ? ticketIdMatch[1] : '';
        
        // Extract ticket title
        const titleElement = document.querySelector('[data-test-id="issue.views.issue-base.foundation.summary.heading"]') ||
                           document.querySelector('h1[id*="summary-val"]') ||
                           document.querySelector('h1[data-testid*="summary"]') ||
                           document.querySelector('#summary-val') ||
                           document.querySelector('[data-testid="issue.views.issue-base.foundation.summary.heading"]');
        
        let title = '';
        if (titleElement) {
            title = titleElement.textContent.trim();
        } else {
            // Alternative way to find title
            const possibleTitles = document.querySelectorAll('h1');
            for (let h1 of possibleTitles) {
                if (h1.textContent && h1.textContent.length > 10) {
                    title = h1.textContent.trim();
                    break;
                }
            }
        }
        
        // Extract ticket type (Bug, Task, Story, etc.)
        let ticketType = '';
        
        // Method 1: Look for the change issue type button in breadcrumbs (most reliable)
        const changeTypeButton = document.querySelector('[data-testid="issue.views.issue-base.foundation.change-issue-type.button"]');
        if (changeTypeButton) {
            // Try to get type from aria-label like "Bug - Change work type"
            const ariaLabel = changeTypeButton.getAttribute('aria-label');
            if (ariaLabel) {
                const typeMatch = ariaLabel.match(/^([^-]+)/);
                if (typeMatch) {
                    ticketType = typeMatch[1].trim();
                }
            }
            
            // If not found in aria-label, try to get from img alt attribute inside button
            if (!ticketType) {
                const imgElement = changeTypeButton.querySelector('img[alt]');
                if (imgElement) {
                    ticketType = imgElement.getAttribute('alt')?.trim() || '';
                }
            }
        }
        
        // Method 2: Look for other issue type selectors
        if (!ticketType) {
            const typeSelectors = [
                '[data-testid*="issue-type"]',
                '[data-test-id*="issue-type"]',
                '[data-testid*="issuetype"]',
                '[aria-label*="Issue Type"]',
                '[title*="Issue Type"]',
                '.issue-type',
                '[data-field-id="issuetype"]'
            ];
            
            for (const selector of typeSelectors) {
                const typeElement = document.querySelector(selector);
                if (typeElement) {
                    // Try different ways to get the type text
                    ticketType = typeElement.textContent?.trim() || 
                               typeElement.getAttribute('aria-label')?.trim() || 
                               typeElement.getAttribute('title')?.trim() || 
                               '';
                    if (ticketType) break;
                }
            }
        }
        
        // Method 3: Look for type in breadcrumbs navigation
        if (!ticketType) {
            const breadcrumbElements = document.querySelectorAll('[role="navigation"] [aria-label*="Change work type"], [role="navigation"] img[alt]');
            for (const element of breadcrumbElements) {
                const ariaLabel = element.getAttribute('aria-label');
                const altText = element.getAttribute('alt');
                
                if (ariaLabel) {
                    const typeMatch = ariaLabel.match(/^([^-]+)/);
                    if (typeMatch) {
                        const type = typeMatch[1].trim();
                        if (['Bug', 'Task', 'Story', 'Epic', 'Sub-task', 'Initiative', 'Deliverable'].includes(type)) {
                            ticketType = type;
                            break;
                        }
                    }
                }
                
                if (!ticketType && altText) {
                    const type = altText.trim();
                    if (['Bug', 'Task', 'Story', 'Epic', 'Sub-task', 'Initiative', 'Deliverable'].includes(type)) {
                        ticketType = type;
                        break;
                    }
                }
            }
        }
        
        // Method 4: Fallback - look for type in any navigation elements
        if (!ticketType) {
            const allNavElements = document.querySelectorAll('nav span, nav button, nav img, [role="navigation"] span, [role="navigation"] button, [role="navigation"] img');
            for (const element of allNavElements) {
                const text = element.textContent?.trim() || element.getAttribute('alt')?.trim() || element.getAttribute('aria-label')?.trim();
                if (text && ['Bug', 'Task', 'Story', 'Epic', 'Sub-task', 'Initiative', 'Deliverable'].includes(text)) {
                    ticketType = text;
                    break;
                }
            }
        }
        
        // Clean up type text (remove extra words like "Issue Type: Bug" -> "Bug" or "Bug - Change work type" -> "Bug")
        if (ticketType) {
            const originalType = ticketType;
            ticketType = ticketType.replace(/^(Issue Type:?\s*)/i, '').replace(/\s*-\s*.*$/i, '').trim();
            console.log('Jira to Notion: Found ticket type:', originalType, '-> cleaned to:', ticketType);
        } else {
            console.log('Jira to Notion: No ticket type found, will use default "feature" prefix');
        }
        
        // Full ticket URL
        const ticketUrl = window.location.href.split('?')[0]; // remove query parameters
        
        return {
            id: ticketId,
            title: title,
            type: ticketType,
            url: ticketUrl
        };
    } catch (error) {
        console.error('Error extracting ticket information:', error);
        return null;
    }
}

// Function to create text in Notion format
function formatNotionText(ticketInfo) {
    // Determine branch prefix based on ticket type
    let branchPrefix = 'feature';
    if (ticketInfo.type && ticketInfo.type.toLowerCase() === 'bug') {
        branchPrefix = 'bugfix';
    }
    
    // Generate branch name from ticket title (simplified)
    let branchSuffix = 'branch-name';
    if (ticketInfo.title) {
        branchSuffix = ticketInfo.title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-') // Replace multiple hyphens with single
            .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
            .substring(0, 50); // Limit length
        
        if (!branchSuffix) {
            branchSuffix = 'branch-name';
        }
    }
    
    const template = `- [ ]  [${ticketInfo.id}](${ticketInfo.url}) - **${ticketInfo.title}**
    
    **Branch**: \`${branchPrefix}/${ticketInfo.id}-${branchSuffix}\` from \`master\` 
    
    **PR**: [paste link here]
    
    - Checklist
        - [ ]  code complete
        - [ ]  jira fields
        - [ ]  nice PR
        - [ ]  code coverage
        - [ ]  reviewed
        - [ ]  merged`;
    
    return template;
}

// Function to copy text to clipboard
async function copyToClipboard(text) {
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
            return true;
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.select();
            const success = document.execCommand('copy');
            document.body.removeChild(textArea);
            return success;
        }
    } catch (error) {
        console.error('Error copying to clipboard:', error);
        return false;
    }
}

// Function to create button
function createCopyButton() {
    const button = document.createElement('button');
    button.id = 'jira-notion-copy-btn';
    button.textContent = '📋 Copy to Notion';
    button.className = 'jira-notion-copy-button';
    
    button.addEventListener('click', async () => {
        try {
            button.textContent = '⏳ Copying...';
            button.disabled = true;
            
            const ticketInfo = extractTicketInfo();
            if (!ticketInfo || !ticketInfo.id) {
                alert('Failed to extract ticket information');
                return;
            }
            
            const notionText = formatNotionText(ticketInfo);
            const success = await copyToClipboard(notionText);
            
            if (success) {
                button.textContent = '✅ Copied!';
                setTimeout(() => {
                    button.textContent = '📋 Copy to Notion';
                    button.disabled = false;
                }, 2000);
            } else {
                button.textContent = '❌ Error';
                setTimeout(() => {
                    button.textContent = '📋 Copy to Notion';
                    button.disabled = false;
                }, 2000);
            }
        } catch (error) {
            console.error('Error while copying:', error);
            button.textContent = '❌ Error';
            setTimeout(() => {
                button.textContent = '📋 Copy to Notion';
                button.disabled = false;
            }, 2000);
        }
    });
    
    return button;
}

// Function to place button on page
function addButtonToPage() {
    // Remove existing button if it exists
    const existingButton = document.getElementById('jira-notion-copy-btn');
    if (existingButton) {
        existingButton.remove();
    }
    
    const button = createCopyButton();
    
    // Try to find row of action buttons (like, share, etc.)
    let targetContainer = null;
    
    // Option 1: Look for container with action buttons under title
    const buttonRowSelectors = [
        '[data-testid="issue.activity.comment-button"]', // comment button
        '[data-testid*="like"]', // like button
        '[data-testid*="share"]', // share button
        '[data-testid*="watch"]', // watch button
        'button[aria-label*="Like"]',
        'button[aria-label*="Share"]',
        'button[title*="Like"]',
        'button[title*="Share"]'
    ];
    
    let referenceButton = null;
    for (const selector of buttonRowSelectors) {
        referenceButton = document.querySelector(selector);
        if (referenceButton) {
            // Look for parent container that contains all buttons
            let parent = referenceButton.parentElement;
            while (parent && parent !== document.body) {
                // Check if this container has multiple buttons
                const buttonsInContainer = parent.querySelectorAll('button').length;
                if (buttonsInContainer >= 2) {
                    targetContainer = parent;
                    break;
                }
                parent = parent.parentElement;
            }
            if (targetContainer) break;
        }
    }
    
    // Option 2: Look for general action containers
    if (!targetContainer) {
        const actionContainers = [
            '[data-testid="issue.views.issue-base.foundation.summary.actions"]',
            '[data-testid*="actions"]',
            '.issue-header-actions',
            '.issue-actions'
        ];
        
        for (const selector of actionContainers) {
            targetContainer = document.querySelector(selector);
            if (targetContainer) break;
        }
    }
    
    // Option 3: Look for flex-container with buttons
    if (!targetContainer) {
        const flexContainers = document.querySelectorAll('[style*="display: flex"], [class*="flex"]');
        for (const container of flexContainers) {
            const buttonsCount = container.querySelectorAll('button').length;
            if (buttonsCount >= 2 && buttonsCount <= 10) { // reasonable number of buttons
                targetContainer = container;
                break;
            }
        }
    }
    
    // If we found container with buttons, add our button there
    if (targetContainer) {
        // Style button to match others in the row
        button.style.margin = '0 4px';
        button.style.display = 'inline-flex';
        targetContainer.appendChild(button);
        return;
    }
    
    // Option 4: Create separate container but less intrusive
    const summaryElement = document.querySelector('[data-test-id="issue.views.issue-base.foundation.summary.heading"]') ||
                          document.querySelector('h1[id*="summary"]') ||
                          document.querySelector('#summary-val') ||
                          document.querySelector('h1');
    
    if (summaryElement) {
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'jira-notion-inline-container';
        buttonContainer.style.cssText = `
            margin: 8px 0;
            display: flex;
            gap: 8px;
            align-items: center;
        `;
        
        buttonContainer.appendChild(button);
        // Insert after title
        summaryElement.parentElement.insertBefore(buttonContainer, summaryElement.nextSibling);
        return;
    }
    
    // Last resort - minimally intrusive floating
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'jira-notion-button-container';
    buttonContainer.style.cssText = `
        position: fixed;
        top: 120px;
        right: 20px;
        z-index: 1000;
        background: white;
        padding: 8px;
        border-radius: 6px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        border: 1px solid #ddd;
    `;
    
    buttonContainer.appendChild(button);
    document.body.appendChild(buttonContainer);
}

// Initialization function
function init() {
    if (!isJiraTicketPage()) {
        return;
    }
    
    // Add button with small delay to let page load
    setTimeout(addButtonToPage, 1000);
    
    // Observe DOM changes (for SPA)
    const observer = new MutationObserver((mutations) => {
        // Check if we need to add button again
        if (!document.getElementById('jira-notion-copy-btn') && isJiraTicketPage()) {
            setTimeout(addButtonToPage, 500);
        }
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// Handle messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'getTicketInfo') {
        const ticketInfo = extractTicketInfo();
        sendResponse(ticketInfo);
    }
});

// Start initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Also handle URL changes for SPA
let currentUrl = window.location.href;
setInterval(() => {
    if (window.location.href !== currentUrl) {
        currentUrl = window.location.href;
        setTimeout(init, 500);
    }
}, 1000);