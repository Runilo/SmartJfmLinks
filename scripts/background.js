// background.js
chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ['scripts/content.js']
    });

    chrome.scripting.insertCSS({
        target: {
            tabId: tab.id,
        },
        files: ["smart-link.css"],
    });
});