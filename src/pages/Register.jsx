import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import {
  Box, Paper, TextField, Button, Typography, CircularProgress,
  Container, Avatar, FormControl, InputLabel, Select, MenuItem, Fade
} from '@mui/material';
import { School } from '@mui/icons-material';
import { useFormValidation, v } from '../hooks/useFormValidation';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { values, errors, touched, handleChange, handleBlur, validateAll, resetForm } = useFormValidation(
    { name: '', email: '', password: '', role: 'student', department: '', phone: '' },
    {
      name: [v.required('Full name is required'), v.minLength(2, 'Name must be at least 2 characters'), v.maxLength(100, 'Name must be at most 100 characters'), v.match(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens and apostrophes')],
      email: [v.required('Email is required'), v.email('Please enter a valid email address')],
      password: [v.required('Password is required'), v.minLength(6, 'Password must be at least 6 characters'), v.maxLength(128, 'Password must be at most 128 characters')],
      role: [v.required('Role is required')],
      department: [v.minLength(2, 'Department must be at least 2 characters'), v.maxLength(100, 'Department must be at most 100 characters')],
      phone: [v.phone('Phone must be a valid Ethiopian number (e.g., 0911223344)')],
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
      await axios.post('/api/auth/register', values);
      enqueueSnackbar('Account created successfully! Please sign in.', { variant: 'success' });
      resetForm();
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      if (err.response?.data?.errors) {
        const fieldErrors = Object.entries(err.response.data.errors).map(([k, v]) => `${k}: ${v}`).join(', ');
        enqueueSnackbar(fieldErrors, { variant: 'error' });
      } else {
        enqueueSnackbar(msg, { variant: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%)', py: 4 }}>
      <Container maxWidth="xs">
        <Fade in timeout={600}>
          <Paper elevation={0} sx={{ p: { xs: 3, sm: 5 }, borderRadius: 4, boxShadow: '0 12px 48px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 5, background: 'linear-gradient(90deg, #27ae60, #2980b9, #0f4c81)' }} />
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Avatar sx={{ bgcolor: '#27ae60', width: 64, height: 64, mx: 'auto', mb: 2, boxShadow: '0 8px 24px rgba(39,174,96,0.25)' }}><School sx={{ fontSize: 32 }} /></Avatar>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#1a2a3a', mb: 0.5 }}>Create Account</Typography>
              <Typography variant="body2" color="text.secondary">Join the Registrar Management System</Typography>
            </Box>

            <form onSubmit={handleSubmit} noValidate>
              <TextField fullWidth label="Full Name" margin="normal" required
                value={values.name} onChange={(e) => handleChange('name')(e)} onBlur={handleBlur('name')}
                error={touched.name && !!errors.name} helperText={touched.name && errors.name}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }} />
              <TextField fullWidth label="Email Address" type="email" margin="normal" required
                value={values.email} onChange={(e) => handleChange('email')(e)} onBlur={handleBlur('email')}
                error={touched.email && !!errors.email} helperText={touched.email && errors.email}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }} />
              <TextField fullWidth label="Password" type="password" margin="normal" required
                value={values.password} onChange={(e) => handleChange('password')(e)} onBlur={handleBlur('password')}
                error={touched.password && !!errors.password} helperText={touched.password && errors.password}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }} />
              <FormControl fullWidth margin="normal" error={touched.role && !!errors.role} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}>
                <InputLabel>Role</InputLabel>
                <Select value={values.role} label="Role" onChange={(e) => handleChange('role')(e)} onBlur={handleBlur('role')}>
                  <MenuItem value="student">Student</MenuItem>
                  <MenuItem value="instructor">Instructor</MenuItem>
                  <MenuItem value="registrar">Registrar Staff</MenuItem>
                  <MenuItem value="department_head">Department Head</MenuItem>
                  <MenuItem value="admin">Administrator</MenuItem>
                </Select>
              </FormControl>
              <TextField fullWidth label="Department" margin="normal"
                value={values.department} onChange={(e) => handleChange('department')(e)} onBlur={handleBlur('department')}
                error={touched.department && !!errors.department} helperText={touched.department && errors.department}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }} />
              <TextField fullWidth label="Phone Number" margin="normal" placeholder="0911223344"
                value={values.phone} onChange={(e) => handleChange('phone')(e)} onBlur={handleBlur('phone')}
                error={touched.phone && !!errors.phone} helperText={touched.phone && errors.phone}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }} />
              <Button fullWidth variant="contained" type="submit" size="large"
                sx={{ mt: 3, py: 1.4, fontWeight: 700, borderRadius: 2.5, boxShadow: '0 6px 20px rgba(15,76,129,0.25)' }} disabled={loading}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
              </Button>
            </form>

            <Typography variant="body2" textAlign="center" sx={{ mt: 3, color: '#5a6a7a' }}>
              Already have an account? <Link to="/login" style={{ color: '#0f4c81', fontWeight: 700, textDecoration: 'none' }}>Sign In</Link>
            </Typography>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default Register;
