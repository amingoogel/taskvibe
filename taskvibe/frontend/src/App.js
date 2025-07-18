import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Auth from './components/Auth';
import TaskManager from './components/TaskManager';
import DailyPhoto from './components/DailyPhoto';
import MoodTracker from './components/MoodTracker';
import GroupChallenge from './components/GroupChallenge';
import Analytics from './components/Analytics';
import './App.css';

ChartJS.register(BarElement, CategoryScale, LinearScale);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">TaskVibe</h1>
        <Auth setIsAuthenticated={setIsAuthenticated} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">TaskVibe</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TaskManager />
        <DailyPhoto />
        <MoodTracker />
        <GroupChallenge />
        <Analytics />
      </div>
    </div>
  );
}

export default App;