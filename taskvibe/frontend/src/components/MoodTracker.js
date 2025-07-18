import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MoodTracker() {
  const [mood, setMood] = useState('');
  const [moods, setMoods] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/moods/').then(response => setMoods(response.data));
  }, []);

  const handleAddMood = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/moods/', { mood });
      setMoods([...moods, response.data]);
      setMood('');
    } catch (error) {
      alert('Failed to record mood');
    }
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-semibold mb-4">Record Your Mood</h2>
      <select
        value={mood}
        onChange={e => setMood(e.target.value)}
        className="border p-2 mb-2 w-full rounded"
      >
        <option value="">Select Mood</option>
        <option value="HAPPY">Happy</option>
        <option value="TIRED">Tired</option>
        <option value="ANXIOUS">Anxious</option>
        <option value="EXCITED">Excited</option>
      </select>
      <button onClick={handleAddMood} className="bg-purple-500 text-white p-2 rounded w-full">
        Record Mood
      </button>
      <h3 className="text-xl font-semibold mt-4 mb-2">Recent Moods</h3>
      <ul>
        {moods.map(mood => (
          <li key={mood.id} className="border p-2 mb-2">
            {mood.mood} - {new Date(mood.recorded_at).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MoodTracker;