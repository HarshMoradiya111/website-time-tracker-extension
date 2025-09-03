import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const WeeklyChart = ({ data }) => {
  // Process data to group by date and category
  const processedData = data.reduce((acc, item) => {
    const date = item._id.date;
    const category = item._id.category;
    const timeInMinutes = Math.floor(item.totalTime / (1000 * 60));

    if (!acc[date]) {
      acc[date] = {
        date,
        productive: 0,
        unproductive: 0,
        neutral: 0
      };
    }

    acc[date][category] = timeInMinutes;
    return acc;
  }, {});

  const chartData = Object.values(processedData).sort((a, b) => 
    new Date(a.date) - new Date(b.date)
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Weekly Productivity Trend</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatDate}
          />
          <YAxis 
            label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            labelFormatter={(label) => `Date: ${formatDate(label)}`}
            formatter={(value, name) => [`${value} minutes`, name]}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="productive" 
            stroke="#10B981" 
            strokeWidth={2}
            name="Productive"
          />
          <Line 
            type="monotone" 
            dataKey="unproductive" 
            stroke="#EF4444" 
            strokeWidth={2}
            name="Unproductive"
          />
          <Line 
            type="monotone" 
            dataKey="neutral" 
            stroke="#6B7280" 
            strokeWidth={2}
            name="Neutral"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyChart;