import React from 'react';

const WeeklyReport = ({ dailyData, weeklyData }) => {
  const calculateWeeklyStats = () => {
    let totalProductive = 0;
    let totalUnproductive = 0;
    let totalNeutral = 0;
    let totalTime = 0;

    weeklyData.forEach(item => {
      const timeInMinutes = Math.floor(item.totalTime / (1000 * 60));
      totalTime += timeInMinutes;
      
      switch (item._id.category) {
        case 'productive':
          totalProductive += timeInMinutes;
          break;
        case 'unproductive':
          totalUnproductive += timeInMinutes;
          break;
        default:
          totalNeutral += timeInMinutes;
      }
    });

    const productivityScore = totalTime > 0 ? Math.round((totalProductive / totalTime) * 100) : 0;
    
    return {
      totalProductive,
      totalUnproductive,
      totalNeutral,
      totalTime,
      productivityScore
    };
  };

  const getTopWebsites = () => {
    const websiteMap = {};
    
    dailyData.forEach(item => {
      const domain = item._id.domain;
      const timeInMinutes = Math.floor(item.totalTime / (1000 * 60));
      
      if (!websiteMap[domain]) {
        websiteMap[domain] = {
          domain,
          time: 0,
          category: item._id.category
        };
      }
      
      websiteMap[domain].time += timeInMinutes;
    });

    return Object.values(websiteMap)
      .sort((a, b) => b.time - a.time)
      .slice(0, 5);
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getProductivityGrade = (score) => {
    if (score >= 80) return { grade: 'A', color: 'text-green-600', bg: 'bg-green-100' };
    if (score >= 60) return { grade: 'B', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (score >= 40) return { grade: 'C', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (score >= 20) return { grade: 'D', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { grade: 'F', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const stats = calculateWeeklyStats();
  const topWebsites = getTopWebsites();
  const grade = getProductivityGrade(stats.productivityScore);

  return (
    <div className="space-y-6">
      {/* Weekly Summary Card */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Weekly Productivity Report</h2>
            <p className="text-blue-100">
              {new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString()} - {new Date().toLocaleDateString()}
            </p>
          </div>
          <div className={`${grade.bg} ${grade.color} rounded-full w-16 h-16 flex items-center justify-center`}>
            <span className="text-2xl font-bold">{grade.grade}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <div className="w-6 h-6 bg-green-500 rounded"></div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Productive Time</p>
              <p className="text-2xl font-semibold text-gray-900">{formatTime(stats.totalProductive)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <div className="w-6 h-6 bg-red-500 rounded"></div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Unproductive Time</p>
              <p className="text-2xl font-semibold text-gray-900">{formatTime(stats.totalUnproductive)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <div className="w-6 h-6 bg-blue-500 rounded"></div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Time</p>
              <p className="text-2xl font-semibold text-gray-900">{formatTime(stats.totalTime)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <div className="w-6 h-6 bg-purple-500 rounded"></div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Productivity Score</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.productivityScore}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Websites */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Top Websites This Week</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {topWebsites.map((website, index) => (
              <div key={website.domain} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">{index + 1}</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">{website.domain}</p>
                    <p className={`text-xs ${
                      website.category === 'productive' ? 'text-green-600' :
                      website.category === 'unproductive' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {website.category}
                    </p>
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {formatTime(website.time)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recommendations</h3>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {stats.productivityScore < 50 && (
              <div className="flex items-start">
                <div className="flex-shrink-0 w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                <p className="ml-3 text-sm text-gray-700">
                  Your productivity score is below 50%. Consider using website blockers during work hours.
                </p>
              </div>
            )}
            
            {stats.totalUnproductive > stats.totalProductive && (
              <div className="flex items-start">
                <div className="flex-shrink-0 w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                <p className="ml-3 text-sm text-gray-700">
                  You spent more time on unproductive websites. Try setting specific times for social media.
                </p>
              </div>
            )}
            
            {stats.productivityScore >= 70 && (
              <div className="flex items-start">
                <div className="flex-shrink-0 w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                <p className="ml-3 text-sm text-gray-700">
                  Great job! You're maintaining good productivity habits. Keep it up!
                </p>
              </div>
            )}
            
            <div className="flex items-start">
              <div className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
              <p className="ml-3 text-sm text-gray-700">
                Consider taking regular breaks every 25-30 minutes to maintain focus and productivity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyReport;