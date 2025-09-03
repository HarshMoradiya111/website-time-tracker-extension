import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const ProductivityPieChart = ({ data }) => {
  const processData = () => {
    let productive = 0;
    let unproductive = 0;
    let neutral = 0;

    data.forEach(item => {
      const timeInMinutes = Math.floor(item.totalTime / (1000 * 60));
      
      switch (item._id.category) {
        case 'productive':
          productive += timeInMinutes;
          break;
        case 'unproductive':
          unproductive += timeInMinutes;
          break;
        default:
          neutral += timeInMinutes;
      }
    });

    return [
      { name: 'Productive', value: productive, color: '#10B981' },
      { name: 'Unproductive', value: unproductive, color: '#EF4444' },
      { name: 'Neutral', value: neutral, color: '#6B7280' }
    ].filter(item => item.value > 0);
  };

  const chartData = processData();

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null; // Don't show label if less than 5%
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Productivity Breakdown</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} minutes`, 'Time Spent']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      
      {chartData.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No data available for today
        </div>
      )}
    </div>
  );
};

export default ProductivityPieChart;