import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DailyPhoto() {
  const [photo, setPhoto] = useState(null);
  const [mood, setMood] = useState('');
  const [dailyPhoto, setDailyPhoto] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/api/photos/').then(response => {
      if (response.data.length > 0) setDailyPhoto(response.data[0]);
    });
  }, []);

  const handleUploadPhoto = async () => {
    const formData = new FormData();
    formData.append('photo', photo);
    formData.append('mood', mood);
    try {
      const response = await axios.post('http://localhost:8000/api/photos/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setDailyPhoto(response.data);
      setPhoto(null);
      setMood('');
    } catch (error) {
      alert('Failed to upload photo');
    }
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-semibold mb-4">Upload Daily Photo</h2>
      <input
        type="file"
        onChange={e => setPhoto(e.target.files[0])}
        className="mb-2"
      />
      <input
        type="text"
        value={mood}
        onChange={e => setMood(e.target.value)}
        placeholder="Your Mood"
        className="border p-2 mb-2 w-full rounded"
      />
      <button onClick={handleUploadPhoto} className="bg-green-500 text-white p-2 rounded w-full">
        Upload Photo
      </button>
      {dailyPhoto && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">Today's Photo</h3>
          <img src={dailyPhoto.photo} alt="Daily Photo" className="max-w-xs rounded" />
          <p className="mt-2">Mood: {dailyPhoto.mood}</p>
        </div>
      )}
    </div>
  );
}

export default DailyPhoto;