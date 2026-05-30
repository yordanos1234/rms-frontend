import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Chip, Alert, TextField, InputAdornment, Avatar, Fade,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem, IconButton
} from '@mui/material';
import { People, Search, Delete, Add } from '@mui/icons-material';
import { useFormValidation, v } from '../hooks/useFormValidation';
import { ModernSpinner } from '../components/ModernSpinner';

const Users = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);

  const { values, errors, touched, handleChange, handleBlur, validateAll, resetForm } = useFormValidation(
    { name: '', email: '', password: 'password123', role: 'student', department: '', phone: '' },
    {
      name: [v.required('Name is required'), v.minLength(2, 'At least 2 characters'), v.maxLength(100, 'At most 100 characters')],
      email: [v.required('Email is required'), v.email('Invalid email')],
      password: [v.required('Password is required'), v.minLength(6, 'At least 6 characters')],
      role: [v.required('Role is required')],
      department: [v.minLength(2, 'At least 2 characters')],
      phone: [v.phone('Invalid Ethiopian phone')],
    }
  );

  useEffect(() => { fetchUsers(); }, []);

  useEffect(() => {
    const term = search.toLowerCase();
    setFiltered(users.filter(u => u.name?.toLowerCase().includes(term) || u.email?.toLowerCase().includes(term) || u.role?.toLowerCase().includes(term) || u.department?.toLowerCase().includes(term)));
  }, [search, users]);

  const fetchUsers = () => {
    setLoading(true); setError('');
    axios.get('/api/users').then(res => { setUsers(res.data); setFiltered(res.data); setLoading(false); })
      .catch(err => { setError('Failed to load users'); setLoading(false); });
  };

  const handleCreate = async () => {
    if (!validateAll()) { enqueueSnackbar('Please fix the errors', { variant: 'warning' }); return; }
    try {
      await axios.post('/api/users', values);
      enqueueSnackbar('User created successfully', { variant: 'success' });
      setOpen(false); resetForm(); fetchUsers();
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || 'Failed to create user', { variant: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`/api/users/${id}`);
      enqueueSnackbar('User deleted successfully', { variant: 'success' });
      fetchUsers();
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || 'Failed to delete user', { variant: 'error' });
    }
  };

  const roleColors = {
    admin: { color: '#f87171', bg: 'rgba(248,113,113,0.12)' },
    registrar: { color: '#fbbf24', bg: 'rgba(251,191,36,0.12)' },
    department_head: { color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
    instructor: { color: '#38bdf8', bg: 'rgba(56,189,248,0.12)' },
    student: { color: '#34d399', bg: 'rgba(52,211,153,0.12)' }
  };

  if (loading) return <ModernSpinner message="Loading users..." />;
  if (error) return <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>;

  return (
    <Fade in timeout={400}>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: '1.5rem', md: '2.125rem' } }}>Users</Typography>
            <Typography variant="body2" color="text.secondary">Manage system users and access permissions</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', width: { xs: '100%', sm: 'auto' } }}>
            <TextField placeholder="Search users..." size="small" value={search} onChange={e => setSearch(e.target.value)}
              sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: { sm: 280 }, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" sx={{ color: 'text.secondary' }} /></InputAdornment> }} />
            <Button variant="contained" startIcon={<Add />} onClick={() => { resetForm(); setOpen(true); }} sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 600 }}>Add User</Button>
          </Box>
        </Box>

        <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead><TableRow sx={{ bgcolor: 'rgba(15,76,129,0.4)' }}>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>User</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>Email</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>Role</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>Department</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }} align="center">Status</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }} align="center">Actions</TableCell>
            </TableRow></TableHead>
            <TableBody>
              {filtered.map((u) => (
                <TableRow key={u._id} hover sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                  <TableCell><Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ width: 36, height: 36, bgcolor: roleColors[u.role]?.bg || 'rgba(255,255,255,0.08)', color: roleColors[u.role]?.color || '#5a6a7a', fontWeight: 700, fontSize: 14 }}>{u.name?.split(' ').map(n=>n[0]).slice(0,2).join('')}</Avatar>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{u.name}</Typography>
                  </Box></TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontFamily: 'monospace', fontSize: '0.875rem' }}>{u.email}</TableCell>
                  <TableCell><Chip label={u.role?.replace('_', ' ')} size="small" sx={{ bgcolor: roleColors[u.role]?.bg || 'rgba(255,255,255,0.06)', color: roleColors[u.role]?.color || '#5a6a7a', fontWeight: 700, textTransform: 'capitalize' }} /></TableCell>
                  <TableCell>{u.department || '-'}</TableCell>
                  <TableCell align="center"><Chip label={u.isActive ? 'Active' : 'Inactive'} size="small" color={u.isActive ? 'success' : 'default'} sx={{ fontWeight: 600 }} /></TableCell>
                  <TableCell align="center"><IconButton size="small" color="error" onClick={() => handleDelete(u._id)}><Delete fontSize="small" /></IconButton></TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6, color: 'text.secondary' }}>No users found.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
          <DialogTitle sx={{ fontWeight: 700 }}>Create New User</DialogTitle>
          <DialogContent>
            <TextField fullWidth label="Full Name" margin="dense" required value={values.name} onChange={(e) => handleChange('name')(e)} onBlur={handleBlur('name')} error={touched.name && !!errors.name} helperText={touched.name && errors.name} />
            <TextField fullWidth label="Email" type="email" margin="dense" required value={values.email} onChange={(e) => handleChange('email')(e)} onBlur={handleBlur('email')} error={touched.email && !!errors.email} helperText={touched.email && errors.email} />
            <TextField fullWidth label="Password" type="password" margin="dense" required value={values.password} onChange={(e) => handleChange('password')(e)} onBlur={handleBlur('password')} error={touched.password && !!errors.password} helperText={touched.password && errors.password} />
            <FormControl fullWidth margin="dense" error={touched.role && !!errors.role}>
              <InputLabel>Role</InputLabel>
              <Select value={values.role} label="Role" onChange={(e) => handleChange('role')(e)} onBlur={handleBlur('role')}>
                <MenuItem value="student">Student</MenuItem>
                <MenuItem value="instructor">Instructor</MenuItem>
                <MenuItem value="registrar">Registrar Staff</MenuItem>
                <MenuItem value="department_head">Department Head</MenuItem>
                <MenuItem value="admin">Administrator</MenuItem>
              </Select>
              {touched.role && errors.role && <Typography variant="caption" sx={{ color: '#f87171', ml: 1.5 }}>{errors.role}</Typography>}
            </FormControl>
            <TextField fullWidth label="Department" margin="dense" value={values.department} onChange={(e) => handleChange('department')(e)} onBlur={handleBlur('department')} error={touched.department && !!errors.department} helperText={touched.department && errors.department} />
            <TextField fullWidth label="Phone" margin="dense" placeholder="0911223344" value={values.phone} onChange={(e) => handleChange('phone')(e)} onBlur={handleBlur('phone')} error={touched.phone && !!errors.phone} helperText={touched.phone && errors.phone} />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setOpen(false)} sx={{ textTransform: 'none', fontWeight: 600 }}>Cancel</Button>
            <Button variant="contained" onClick={handleCreate} sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2.5, px: 3 }}>Create User</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
};

export default Users;
