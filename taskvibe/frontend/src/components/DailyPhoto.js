import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';

function DailyPhoto({ date }) {
  const [photo, setPhoto] = useState(null);
  const [mood, setMood] = useState('');
  const [dailyPhoto, setDailyPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const effectiveDate = date || new Date();

  useEffect(() => {
    setLoading(true);
    // Use effectiveDate which defaults to today
    axios.get('http://localhost:8000/api/photos/', { params: { date: effectiveDate.toISOString().slice(0, 10) } })
      .then(response => {
        if (response.data.length > 0) setDailyPhoto(response.data[0]);
        else setDailyPhoto(null);
      })
      .finally(() => setLoading(false));
  }, [date]); // Keep dependency on `date` prop to refetch when it changes

  const handleUploadPhoto = async () => {
    if (!photo) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('photo', photo);
    formData.append('mood', mood);
    // Use effectiveDate here as well
    formData.append('date', effectiveDate.toISOString().slice(0, 10));
    try {
      const response = await axios.post('http://localhost:8000/api/photos/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setDailyPhoto(response.data);
      setPhoto(null);
      setMood('');
    } catch (error) {
      alert('Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-semibold mb-4">عکس روز {effectiveDate.toLocaleDateString('fa-IR')}</h2>
      <Tooltip title="آپلود عکس روزانه" arrow>
        <input
          type="file"
          onChange={e => setPhoto(e.target.files[0])}
          className="mb-2"
        />
      </Tooltip>
      <input
        type="text"
        value={mood}
        onChange={e => setMood(e.target.value)}
        placeholder="حس و حال شما"
        className="border p-2 mb-2 w-full rounded"
      />
      <button onClick={handleUploadPhoto} className="bg-green-500 text-white p-2 rounded w-full" disabled={uploading || !photo}>
        {uploading ? 'در حال آپلود...' : 'آپلود عکس'}
      </button>
      {loading ? (
        <div className="flex justify-center items-center my-4"><CircularProgress /></div>
      ) : !dailyPhoto ? (
        <div className="text-center text-gray-500 my-4">عکسی برای این روز ثبت نشده است.</div>
      ) : (
        <Fade in timeout={500}>
          <div className="mt-4">
            <Tooltip title="عکس روزانه شما" arrow>
              <img src={dailyPhoto.photo} alt="Daily Photo" className="max-w-xs rounded" />
            </Tooltip>
            <p className="mt-2">حس و حال: {dailyPhoto.mood}</p>
          </div>
        </Fade>
      )}
    </div>
  );
}

export default DailyPhoto;