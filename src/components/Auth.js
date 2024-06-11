// src/components/Auth.js
import React, { useState } from 'react';
import axiosInstance from '../axiosInstance';
import { TextField, Button, Typography, Container, Box } from '@mui/material';

function Auth({ setIsAuthenticated }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const path = isLogin ? '/auth/login' : '/auth/register';
    try {
      const response = await axiosInstance.post(path, { username, password });
      localStorage.setItem('token', response.data.token);
      setIsAuthenticated(true);
      setMessage(isLogin ? 'Login successful!' : 'Registration successful!');
    } catch (err) {
      console.error(err);
      setMessage('Error: ' + (err.response ? err.response.data.message : 'Server error'));
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          {isLogin ? 'Login' : 'Register'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {isLogin ? 'Login' : 'Register'}
          </Button>
          <Button
            fullWidth
            variant="text"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Switch to Register' : 'Switch to Login'}
          </Button>
        </Box>
        {message && <Typography variant="body2" color="error">{message}</Typography>}
      </Box>
    </Container>
  );
}

export default Auth;
