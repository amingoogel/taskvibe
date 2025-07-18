import React, { useState } from 'react';
import axios from 'axios';

function Auth({ setIsAuthenticated }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/register/', { username, password, email });
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('user_id', response.data.user_id);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
      setIsAuthenticated(true);
    } catch (error) {
      alert(error.response?.data?.error || 'Registration failed');
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/login/', { username, password });
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('user_id', response.data.user_id);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
      setIsAuthenticated(true);
    } catch (error) {
      alert(error.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-semibold mb-4">Register</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        className="border p-2 mb-2 w-full rounded"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="border p-2 mb-2 w-full rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="border p-2 mb-2 w-full rounded"
      />
      <button onClick={handleRegister} className="bg-blue-500 text-white p-2 rounded w-full mb-4">
        Register
      </button>
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        className="border p-2 mb-2 w-full rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="border p-2 mb-2 w-full rounded"
      />
      <button onClick={handleLogin} className="bg-green-500 text-white p-2 rounded w-full">
        Login
      </button>
    </div>
  );
}

export default Auth;