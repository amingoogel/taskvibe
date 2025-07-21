import React, { useState } from 'react';
import axios from '../axiosConfig';
import { Box, TextField, Button, Typography, Alert, Stack } from '@mui/material';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';

function RegisterForm({ setIsAuthenticated }) {
  const [registerData, setRegisterData] = useState({ username: '', email: '', password: '', password2: '' });
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (registerData.password !== registerData.password2) {
        setError('رمز عبور و تکرار آن یکسان نیست.');
        return;
    }
    try {
      const response = await axios.post('http://localhost:8000/api/register/', {
        username: registerData.username,
        email: registerData.email,
        password: registerData.password
      });
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('user_id', response.data.user_id);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
      setIsAuthenticated(true);
      setRegisterData({ username: '', password: '', email: '', password2: '' });
      setError('');
    } catch (error) {
      setError(error.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <Stack spacing={2}>
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
        <TextField
          label="تکرار رمز عبور"
          value={registerData.password2}
          onChange={e => { setRegisterData({ ...registerData, password2: e.target.value }); setError(''); }}
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
      </Stack>
  );
}

export default RegisterForm; 