function formatTime(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  return `${minutes}m ${seconds % 60}s`;
}

function loadTodayData() {
  const today = new Date().toDateString();
  
  chrome.storage.local.get([today], (result) => {
    const todayData = result[today] || {};
    
    let productiveTime = 0;
    let unproductiveTime = 0;
    let totalTime = 0;
    
    const websites = Object.entries(todayData)
      .map(([domain, data]) => ({
        domain,
        time: data.time,
        category: data.category
      }))
      .sort((a, b) => b.time - a.time)
      .slice(0, 5);
    
    // Calculate totals
    websites.forEach(site => {
      totalTime += site.time;
      if (site.category === 'productive') {
        productiveTime += site.time;
      } else if (site.category === 'unproductive') {
        unproductiveTime += site.time;
      }
    });
    
    // Update summary
    document.getElementById('productive-time').textContent = 
      `Productive: ${formatTime(productiveTime)}`;
    document.getElementById('unproductive-time').textContent = 
      `Unproductive: ${formatTime(unproductiveTime)}`;
    
    const score = totalTime > 0 ? Math.round((productiveTime / totalTime) * 100) : 0;
    document.getElementById('productivity-score').textContent = `Score: ${score}%`;
    
    // Update website list
    const websiteList = document.getElementById('website-list');
    websiteList.innerHTML = '';
    
    websites.forEach(site => {
      const div = document.createElement('div');
      div.className = `stat-item ${site.category}`;
      div.innerHTML = `
        <span>${site.domain}</span>
        <span class="time">${formatTime(site.time)}</span>
      `;
      websiteList.appendChild(div);
    });
  });
}

document.getElementById('view-dashboard').addEventListener('click', () => {
  chrome.tabs.create({ url: 'http://localhost:3000' });
});

document.getElementById('clear-data').addEventListener('click', () => {
  const today = new Date().toDateString();
  chrome.storage.local.remove([today], () => {
    loadTodayData();
  });
});

// Load data when popup opens
document.addEventListener('DOMContentLoaded', loadTodayData);