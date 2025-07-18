import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

function Analytics() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/api/analytics/').then(response => setAnalytics(response.data));
  }, []);

  if (!analytics) return null;

  const chartData = {
    labels: ['Completed', 'Remaining'],
    datasets: [{
      label: 'Tasks',
      data: [
        analytics.daily_report.completed_tasks,
        analytics.daily_report.total_tasks - analytics.daily_report.completed_tasks
      ],
      backgroundColor: ['#10B981', '#EF4444']
    }]
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-semibold mb-4">Daily Report</h2>
      <Bar data={chartData} options={{ scales: { y: { beginAtZero: true } } }} />
      <p className="mt-4">Completion Rate: {analytics.daily_report.completion_rate.toFixed(2)}%</p>
      <h3 className="text-xl font-semibold mt-4 mb-2">Smart Suggestions</h3>
      <ul>
        {analytics.suggestions.map((suggestion, index) => (
          <li key={index} className="border p-2 mb-2">
            {suggestion.title} ({suggestion.energy_level})
          </li>
        ))}
      </ul>
      <h3 className="text-xl font-semibold mt-4 mb-2">Mood Analysis</h3>
      <ul>
        {analytics.mood_analysis.map((mood, index) => (
          <li key={index} className="border p-2 mb-2">
            {mood.mood}: {mood.count} times
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Analytics;