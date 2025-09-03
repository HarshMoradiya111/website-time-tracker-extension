let currentTab = null;
let startTime = null;
let timeData = {};

// Website categories
const productiveWebsites = [
  'github.com', 'stackoverflow.com', 'leetcode.com', 'codepen.io',
  'developer.mozilla.org', 'w3schools.com', 'freecodecamp.org',
  'coursera.org', 'udemy.com', 'edx.org', 'khanacademy.org'
];

const unproductiveWebsites = [
  'facebook.com', 'instagram.com', 'youtube.com', 'twitter.com',
  'tiktok.com', 'reddit.com', 'netflix.com', 'twitch.tv',
  'snapchat.com', 'pinterest.com'
];

function getDomain(url) {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return 'unknown';
  }
}

function categorizeWebsite(domain) {
  if (productiveWebsites.some(site => domain.includes(site))) {
    return 'productive';
  }
  if (unproductiveWebsites.some(site => domain.includes(site))) {
    return 'unproductive';
  }
  return 'neutral';
}

function saveTimeData(domain, timeSpent, category) {
  const today = new Date().toDateString();
  
  chrome.storage.local.get([today], (result) => {
    const todayData = result[today] || {};
    
    if (!todayData[domain]) {
      todayData[domain] = {
        time: 0,
        category: category
      };
    }
    
    todayData[domain].time += timeSpent;
    
    chrome.storage.local.set({
      [today]: todayData
    });
    
    // Also send to backend
    sendToBackend(domain, timeSpent, category);
  });
}

async function sendToBackend(domain, timeSpent, category) {
  try {
    const response = await fetch('http://localhost:3001/api/time-tracking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        domain,
        timeSpent,
        category,
        timestamp: new Date().toISOString()
      })
    });
  } catch (error) {
    console.log('Backend not available, storing locally only');
  }
}

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (currentTab && startTime) {
      const timeSpent = Date.now() - startTime;
      const domain = getDomain(currentTab.url);
      const category = categorizeWebsite(domain);
      saveTimeData(domain, timeSpent, category);
    }
    
    currentTab = tab;
    startTime = Date.now();
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active) {
    if (currentTab && startTime && currentTab.id === tabId) {
      const timeSpent = Date.now() - startTime;
      const domain = getDomain(currentTab.url);
      const category = categorizeWebsite(domain);
      saveTimeData(domain, timeSpent, category);
    }
    
    currentTab = tab;
    startTime = Date.now();
  }
});

chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    // Browser lost focus
    if (currentTab && startTime) {
      const timeSpent = Date.now() - startTime;
      const domain = getDomain(currentTab.url);
      const category = categorizeWebsite(domain);
      saveTimeData(domain, timeSpent, category);
      startTime = null;
    }
  } else {
    // Browser gained focus
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs[0]) {
        currentTab = tabs[0];
        startTime = Date.now();
      }
    });
  }
});