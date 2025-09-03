// Content script for additional page interaction if needed
let pageStartTime = Date.now();
let isPageActive = true;

// Track page visibility changes
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    isPageActive = false;
  } else {
    isPageActive = true;
    pageStartTime = Date.now();
  }
});

// Track mouse movement and keyboard activity
let lastActivity = Date.now();

document.addEventListener('mousemove', () => {
  lastActivity = Date.now();
});

document.addEventListener('keypress', () => {
  lastActivity = Date.now();
});

// Check for inactivity every 30 seconds
setInterval(() => {
  const now = Date.now();
  const inactiveTime = now - lastActivity;
  
  // If inactive for more than 5 minutes, don't count the time
  if (inactiveTime > 5 * 60 * 1000) {
    chrome.runtime.sendMessage({
      type: 'INACTIVE_TAB',
      domain: window.location.hostname
    });
  }
}, 30000);