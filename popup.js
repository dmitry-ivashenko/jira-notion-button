// Popup script for Jira to Notion Copier

document.addEventListener('DOMContentLoaded', async function() {
    const statusElement = document.getElementById('status');
    
    try {
        // Get information about current tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        if (!tab || !tab.url) {
            updateStatus('inactive', 'Failed to get information about current tab');
            return;
        }
        
        // Check if current page is a Jira page
        const isJiraPage = isJiraSite(tab.url);
        const isTicketPage = isJiraTicketPage(tab.url);
        
        if (!isJiraPage) {
            updateStatus('inactive', 'Open a Jira page to use the plugin');
        } else if (!isTicketPage) {
            updateStatus('inactive', 'Open a ticket in Jira to see the copy button');
        } else {
            updateStatus('active', '✅ Plugin is active! Button should be visible on page');
            
            // Try to get ticket information
            try {
                const results = await chrome.tabs.sendMessage(tab.id, { action: 'getTicketInfo' });
                if (results && results.id) {
                    let statusMessage = `✅ Found ticket: ${results.id}`;
                    if (results.type) {
                        statusMessage += ` (${results.type})`;
                    }
                    updateStatus('active', statusMessage);
                }
            } catch (error) {
                // If we can't communicate with content script, it's normal
                console.log('Content script not responding, probably still loading');
            }
        }
        
    } catch (error) {
        console.error('Error in popup:', error);
        updateStatus('inactive', 'An error occurred while checking status');
    }
});

function updateStatus(type, message) {
    const statusElement = document.getElementById('status');
    statusElement.className = `status ${type}`;
    statusElement.textContent = message;
}

function isJiraSite(url) {
    return url.includes('atlassian.net') || 
           url.includes('jira.') || 
           url.includes('.jira.') ||
           /jira/i.test(url);
}

function isJiraTicketPage(url) {
    const urlPattern = /\/browse\/[A-Z]+-\d+/;
    return urlPattern.test(url);
}

// Handle messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'updateStatus') {
        updateStatus(message.type, message.message);
    }
});