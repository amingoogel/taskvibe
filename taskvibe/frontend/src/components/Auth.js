import React, { useState } from 'react';
import axios from '../axiosConfig';
// اضافه کردن ایمپورت‌های MUI
import { Box, TextField, Button, Typography, Alert, Stack, Divider } from '@mui/material';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import LoginIcon from '@mui/icons-material/Login';

function Auth({ setIsAuthenticated }) {
  // Separate state for register and login
  const [registerData, setRegisterData] = useState({ username: '', password: '', email: '' });
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/register/', registerData);
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('user_id', response.data.user_id);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
      setIsAuthenticated(true);
      setRegisterData({ username: '', password: '', email: '' });
      setError('');
    } catch (error) {
      setError(error.response?.data?.error || 'Registration failed');
      setRegisterData({ username: '', password: '', email: '' });
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/login/', loginData);
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('user_id', response.data.user_id);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
      setIsAuthenticated(true);
      setLoginData({ username: '', password: '' });
      setError('');
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed');
      setLoginData({ ...loginData, password: '' });
    }
  };

  // Reset error when switching between forms (if needed)
  // Here, both forms are shown, so error is only reset on input change

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', p: 3, bgcolor: 'background.paper', borderRadius: 3, boxShadow: 3 }}>
      <Stack spacing={2}>
        <Typography variant="h5" align="center" fontWeight={700} gutterBottom>
          <PersonAddAlt1Icon color="primary" sx={{ verticalAlign: 'middle', mr: 1 }} />
          ثبت‌نام <span role="img" aria-label="party">🎉</span>
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          label="نام کاربری"
          value={registerData.username}
          onChange={e => { setRegisterData({ ...registerData, username: e.target.value }); setError(''); }}
          fullWidth
          variant="outlined"
          margin="dense"
        />
        <TextField
          label="ایمیل"
          value={registerData.email}
          onChange={e => { setRegisterData({ ...registerData, email: e.target.value }); setError(''); }}
          fullWidth
          variant="outlined"
          margin="dense"
          type="email"
        />
        <TextField
          label="رمز عبور"
          value={registerData.password}
          onChange={e => { setRegisterData({ ...registerData, password: e.target.value }); setError(''); }}
          fullWidth
          variant="outlined"
          margin="dense"
          type="password"
        />
        <Button
          onClick={handleRegister}
          variant="contained"
          color="primary"
          size="large"
          startIcon={<PersonAddAlt1Icon />}
          fullWidth
        >
          ثبت‌نام
        </Button>
        <Divider sx={{ my: 2 }}>یا</Divider>
        <Typography variant="h5" align="center" fontWeight={700} gutterBottom>
          <LoginIcon color="success" sx={{ verticalAlign: 'middle', mr: 1 }} />
          ورود <span role="img" aria-label="wave">👋</span>
        </Typography>
        <TextField
          label="نام کاربری"
          value={loginData.username}
          onChange={e => { setLoginData({ ...loginData, username: e.target.value }); setError(''); }}
          fullWidth
          variant="outlined"
          margin="dense"
        />
        <TextField
          label="رمز عبور"
          value={loginData.password}
          onChange={e => { setLoginData({ ...loginData, password: e.target.value }); setError(''); }}
          fullWidth
          variant="outlined"
          margin="dense"
          type="password"
        />
        <Button
          onClick={handleLogin}
          variant="contained"
          color="success"
          size="large"
          startIcon={<LoginIcon />}
          fullWidth
        >
          ورود
        </Button>
      </Stack>
    </Box>
  );
}

export default Auth;