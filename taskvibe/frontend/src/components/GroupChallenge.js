import React, { useState, useEffect } from 'react';
import axios from 'axios';

function setAxiosAuthToken() {
  const token = localStorage.getItem('access_token');
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
}

function GroupChallenge() {
  const [groups, setGroups] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [challengeUpdates, setChallengeUpdates] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [challengeTitle, setChallengeTitle] = useState('');
  const [challengeDescription, setChallengeDescription] = useState('');
  const [challengeTarget, setChallengeTarget] = useState(5);
  const [challengeDeadline, setChallengeDeadline] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');

  useEffect(() => {
    setAxiosAuthToken();
    axios.get('http://localhost:8000/api/groups/')
      .then(response => {
        setGroups(response.data);
        if (response.data.length > 0) setSelectedGroup(response.data[0].id);
      })
      .catch(error => {
        if (error.response?.status === 401) {
          alert('لطفاً دوباره وارد شوید (توکن منقضی شده یا معتبر نیست)');
          localStorage.removeItem('access_token');
          window.location.reload();
        }
      });
    axios.get('http://localhost:8000/api/challenges/')
      .then(response => setChallenges(response.data))
      .catch(error => {
        if (error.response?.status === 401) {
          alert('لطفاً دوباره وارد شوید (توکن منقضی شده یا معتبر نیست)');
          localStorage.removeItem('access_token');
          window.location.reload();
        }
      });
    // WebSocket setup (optional, unchanged)
    if (groups.length > 0) {
      const ws = new WebSocket(`ws://localhost:8000/ws/challenge/${groups[0]?.id}/`);
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setChallengeUpdates(prev => [...prev, data.message]);
      };
      return () => ws.close();
    }
  }, []); // Only run once on mount

  const handleCreateGroup = async () => {
    setAxiosAuthToken();
    if (!groupName.trim()) {
      alert('لطفاً نام گروه را وارد کنید.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:8000/api/groups/', {
        name: groupName
      });
      setGroups([...groups, response.data]);
      setGroupName('');
    } catch (error) {
      if (error.response?.status === 401) {
        alert('لطفاً دوباره وارد شوید (توکن منقضی شده یا معتبر نیست)');
        localStorage.removeItem('access_token');
        window.location.reload();
      } else {
        alert(error.response?.data?.detail || error.response?.data?.error || 'Failed to create group');
      }
    }
  };

  const handleCreateChallenge = async () => {
    if (!selectedGroup) {
      alert('لطفاً یک گروه انتخاب کنید.');
      return;
    }
    if (!challengeTitle.trim() || !challengeDescription.trim() || !challengeDeadline) {
      alert('لطفاً همه فیلدهای چالش را پر کنید.');
      return;
    }
    setAxiosAuthToken();
    try {
      const response = await axios.post('http://localhost:8000/api/challenges/', {
        group: selectedGroup,
        title: challengeTitle,
        description: challengeDescription,
        target_tasks: challengeTarget,
        deadline: challengeDeadline
      });
      setChallenges([...challenges, response.data]);
      setChallengeTitle('');
      setChallengeDescription('');
      setChallengeTarget(5);
      setChallengeDeadline('');
    } catch (error) {
      if (error.response?.status === 401) {
        alert('لطفاً دوباره وارد شوید (توکن منقضی شده یا معتبر نیست)');
        localStorage.removeItem('access_token');
        window.location.reload();
      } else {
        alert(error.response?.data?.detail || error.response?.data?.error || 'Failed to create challenge');
      }
    }
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-semibold mb-4">Groups & Challenges</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Group Name"
          value={groupName}
          onChange={e => setGroupName(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />
        <button onClick={handleCreateGroup} className="bg-blue-500 text-white p-2 rounded w-full mb-2">
          Create Group
        </button>
      </div>
      <div className="mb-4">
        <select
          value={selectedGroup}
          onChange={e => setSelectedGroup(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        >
          <option value="">Select Group</option>
          {groups.map(group => (
            <option key={group.id} value={group.id}>{group.name}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Challenge Title"
          value={challengeTitle}
          onChange={e => setChallengeTitle(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />
        <input
          type="text"
          placeholder="Challenge Description"
          value={challengeDescription}
          onChange={e => setChallengeDescription(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />
        <input
          type="number"
          placeholder="Target Tasks"
          value={challengeTarget}
          onChange={e => setChallengeTarget(Number(e.target.value))}
          className="border p-2 rounded w-full mb-2"
        />
        <input
          type="datetime-local"
          placeholder="Deadline"
          value={challengeDeadline}
          onChange={e => setChallengeDeadline(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />
        <button onClick={handleCreateChallenge} className="bg-blue-500 text-white p-2 rounded w-full mb-4">
          Create Challenge
        </button>
      </div>
      <h3 className="text-xl font-semibold mb-2">Challenges</h3>
      <ul>
        {challenges.map(challenge => (
          <li key={challenge.id} className="border p-2 mb-2">
            {challenge.title} - Target: {challenge.target_tasks} tasks by {new Date(challenge.deadline).toLocaleDateString()}
          </li>
        ))}
      </ul>
      <h3 className="text-xl font-semibold mt-4 mb-2">Challenge Updates</h3>
      <ul>
        {challengeUpdates.map((update, index) => (
          <li key={index} className="border p-2 mb-2">
            User {update.user_id} completed {update.completed_tasks} tasks
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GroupChallenge;