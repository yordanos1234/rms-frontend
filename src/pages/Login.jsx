import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import {
  Box, Paper, TextField, Button, Typography, CircularProgress,
  Container, Avatar, InputAdornment, IconButton, Fade
} from '@mui/material';
import { Visibility, VisibilityOff, School } from '@mui/icons-material';
import { useFormValidation, v } from '../hooks/useFormValidation';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { values, errors, touched, handleChange, handleBlur, validateAll } = useFormValidation(
    { email: '', password: '' },
    {
      email: [v.required('Email is required'), v.email('Please enter a valid email address')],
      password: [v.required('Password is required'), v.minLength(6, 'Password must be at least 6 characters')],
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) {
      enqueueSnackbar('Please fix the errors in the form', { variant: 'warning' });
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/login', values);
      login(res.data.token, res.data.user);
      enqueueSnackbar(`Welcome back, ${res.data.user.name}!`, { variant: 'success' });
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      enqueueSnackbar(msg, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (email) => {
    setValues({ email, password: 'password123' });
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%)', py: 4 }}>
      <Container maxWidth="xs">
        <Fade in timeout={600}>
          <Paper elevation={0} sx={{ p: { xs: 3, sm: 5 }, borderRadius: 4, boxShadow: '0 12px 48px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 5, background: 'linear-gradient(90deg, #0f4c81, #2980b9, #27ae60)' }} />
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Avatar sx={{ bgcolor: '#0f4c81', width: 64, height: 64, mx: 'auto', mb: 2, boxShadow: '0 8px 24px rgba(15,76,129,0.25)' }}><School sx={{ fontSize: 32 }} /></Avatar>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#1a2a3a', mb: 0.5 }}>Welcome Back</Typography>
              <Typography variant="body2" color="text.secondary">Sign in to your RMS account</Typography>
            </Box>

            <form onSubmit={handleSubmit} noValidate>
              <TextField
                fullWidth label="Email Address" type="email" margin="normal" required
                value={values.email} onChange={(e) => handleChange('email')(e)} onBlur={handleBlur('email')}
                error={touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
              />
              <TextField
                fullWidth label="Password" type={showPassword ? 'text' : 'password'} margin="normal" required
                value={values.password} onChange={(e) => handleChange('password')(e)} onBlur={handleBlur('password')}
                error={touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">{showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}</IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button fullWidth variant="contained" type="submit" size="large" sx={{ mt: 3, py: 1.4, fontWeight: 700, borderRadius: 2.5, boxShadow: '0 6px 20px rgba(15,76,129,0.25)' }} disabled={loading}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
              </Button>
            </form>

            <Typography variant="body2" textAlign="center" sx={{ mt: 3, color: '#5a6a7a' }}>
              Don't have an account? <Link to="/register" style={{ color: '#0f4c81', fontWeight: 700, textDecoration: 'none' }}>Create one</Link>
            </Typography>

            <Box sx={{ mt: 4, p: 2.5, bgcolor: '#f8fafc', borderRadius: 3, border: '1px dashed rgba(15,76,129,0.15)' }}>
              <Typography variant="caption" display="block" sx={{ color: '#5a6a7a', fontWeight: 600, mb: 1 }}>Quick Demo Login</Typography>
              {[
                ['admin@rms.com', 'Admin'],
                ['registrar@rms.com', 'Registrar'],
                ['instructor@rms.com', 'Instructor'],
                ['elham@rms.com', 'Student'],
              ].map(([email, role]) => (
                <Box key={email} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5, cursor: 'pointer', p: 0.5, borderRadius: 1, '&:hover': { bgcolor: 'rgba(15,76,129,0.04)' } }}
                  onClick={() => { setValues({ email, password: 'password123' }); }}>
                  <Typography variant="caption" sx={{ color: '#1a2a3a', fontFamily: 'monospace' }}>{email}</Typography>
                  <Typography variant="caption" sx={{ color: '#2980b9', fontWeight: 600 }}>{role}</Typography>
                </Box>
              ))}
              <Typography variant="caption" sx={{ color: '#5a6a7a', display: 'block', mt: 1 }}>Password for all: <strong>password123</strong></Typography>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default Login;
