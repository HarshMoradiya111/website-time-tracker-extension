import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DailyChart from './DailyChart';
import WeeklyChart from './WeeklyChart';
import ProductivityPieChart from './ProductivityPieChart';
import WeeklyReport from './WeeklyReport';

const Dashboard = ({ onLogout }) => {
  const [dailyData, setDailyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('daily');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [dailyResponse, weeklyResponse] = await Promise.all([
        axios.get('/api/analytics/daily'),
        axios.get('/api/analytics/weekly')
      ]);
      
      setDailyData(dailyResponse.data);
      setWeeklyData(weeklyResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (milliseconds) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const calculateProductivityStats = () => {
    let productiveTime = 0;
    let unproductiveTime = 0;
    let totalTime = 0;

    dailyData.forEach(item => {
      const time = item.totalTime;
      totalTime += time;
      
      if (item._id.category === 'productive') {
        productiveTime += time;
      } else if (item._id.category === 'unproductive') {
        unproductiveTime += time;
      }
    });

    const productivityScore = totalTime > 0 ? Math.round((productiveTime / totalTime) * 100) : 0;

    return {
      productiveTime,
      unproductiveTime,
      totalTime,
      productivityScore
    };
  };

  const stats = calculateProductivityStats();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Productivity Dashboard</h1>
              <p className="text-gray-600">Track your browsing habits and productivity</p>
            </div>
            <button
              onClick={onLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">P</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Productive Time
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {formatTime(stats.productiveTime)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">U</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Unproductive Time
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {formatTime(stats.unproductiveTime)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">T</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Time
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {formatTime(stats.totalTime)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">%</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Productivity Score
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.productivityScore}%
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('daily')}
                className={`${
                  activeTab === 'daily'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-4 border-b-2 font-medium text-sm`}
              >
                Daily View
              </button>
              <button
                onClick={() => setActiveTab('weekly')}
                className={`${
                  activeTab === 'weekly'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-4 border-b-2 font-medium text-sm`}
              >
                Weekly View
              </button>
              <button
                onClick={() => setActiveTab('report')}
                className={`${
                  activeTab === 'report'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-4 border-b-2 font-medium text-sm`}
              >
                Weekly Report
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'daily' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <DailyChart data={dailyData} />
                <ProductivityPieChart data={dailyData} />
              </div>
            )}
            
            {activeTab === 'weekly' && (
              <WeeklyChart data={weeklyData} />
            )}
            
            {activeTab === 'report' && (
              <WeeklyReport dailyData={dailyData} weeklyData={weeklyData} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;