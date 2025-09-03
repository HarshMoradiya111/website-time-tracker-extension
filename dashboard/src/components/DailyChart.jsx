import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DailyChart = ({ data }) => {
  const formatTime = (milliseconds) => {
    const minutes = Math.floor(milliseconds / (1000 * 60));
    return `${minutes}m`;
  };

  const chartData = data.map(item => ({
    domain: item._id.domain,
    time: Math.floor(item.totalTime / (1000 * 60)), // Convert to minutes
    category: item._id.category,
    timeFormatted: formatTime(item.totalTime)
  })).slice(0, 10); // Show top 10 websites

  const getBarColor = (category) => {
    switch (category) {
      case 'productive': return '#10B981';
      case 'unproductive': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Today's Website Usage</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="domain" 
            angle={-45}
            textAnchor="end"
            height={80}
            fontSize={12}
          />
          <YAxis 
            label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            formatter={(value, name) => [`${value} minutes`, 'Time Spent']}
            labelFormatter={(label) => `Website: ${label}`}
          />
          <Bar 
            dataKey="time" 
            fill={(entry) => getBarColor(entry.category)}
            name="Time Spent"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailyChart;