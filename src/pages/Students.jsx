import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Chip, Alert, TextField, InputAdornment, Avatar, Fade,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { School, Search, Add } from '@mui/icons-material';
import { useFormValidation, v } from '../hooks/useFormValidation';
import { ModernSpinner } from '../components/ModernSpinner';

const Students = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [students, setStudents] = useState([]);
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);

  const { values, errors, touched, handleChange, handleBlur, validateAll, resetForm } = useFormValidation(
    { user: '', studentId: '', program: 'BSc Computer Science', year: 1, semester: 1, gpa: '', status: 'active' },
    {
      user: [v.required('User is required')],
      studentId: [v.required('Student ID is required'), v.minLength(3, 'At least 3 characters'), v.maxLength(50, 'At most 50 characters')],
      program: [v.required('Program is required'), v.minLength(2, 'At least 2 characters')],
      year: [v.required('Year is required'), v.isNumber('Must be a number'), v.min(1, 'Min 1'), v.max(7, 'Max 7'), v.integer('Must be whole number')],
      semester: [v.required('Semester is required'), v.isNumber('Must be a number'), v.min(1, 'Min 1'), v.max(3, 'Max 3'), v.integer('Must be whole number')],
      gpa: [v.isNumber('Must be a number'), v.min(0, 'Min 0'), v.max(4, 'Max 4')],
      status: [v.required('Status is required')],
    }
  );

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    const term = search.toLowerCase();
    setFiltered(students.filter(s => (s.studentId?.toLowerCase().includes(term)) || (s.user?.name?.toLowerCase().includes(term)) || (s.program?.toLowerCase().includes(term))));
  }, [search, students]);

  const fetchData = async () => {
    setLoading(true); setError('');
    try {
      const sRes = await axios.get('/api/students');
      setStudents(sRes.data); setFiltered(sRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load students');
      setLoading(false);
      return;
    }
    try {
      const uRes = await axios.get('/api/users');
      setUsers(uRes.data.filter(u => u.role === 'student'));
    } catch (err) {
      // Non-critical: users list is only needed for the "Add Student" dropdown
      console.warn('Could not load users list:', err.response?.data?.message);
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!validateAll()) { enqueueSnackbar('Please fix the errors', { variant: 'warning' }); return; }
    try {
      await axios.post('/api/students', values);
      enqueueSnackbar('Student created successfully', { variant: 'success' });
      setOpen(false); resetForm(); fetchData();
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || 'Failed to create student', { variant: 'error' });
    }
  };

  const statusColor = { active: 'success', graduated: 'primary', suspended: 'error', withdrawn: 'default' };

  if (loading) return <ModernSpinner message="Loading students..." />;
  if (error) return <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>;

  return (
    <Fade in timeout={400}>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: '1.5rem', md: '2.125rem' } }}>Students</Typography>
            <Typography variant="body2" color="text.secondary">Manage and view all registered students</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', width: { xs: '100%', sm: 'auto' } }}>
            <TextField placeholder="Search by name, ID or program..." size="small" value={search} onChange={e => setSearch(e.target.value)}
              sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: { sm: 280 }, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" sx={{ color: 'text.secondary' }} /></InputAdornment> }} />
            <Button variant="contained" startIcon={<Add />} onClick={() => { resetForm(); setOpen(true); }} sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 600 }}>Add Student</Button>
          </Box>
        </Box>

        <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead><TableRow sx={{ bgcolor: 'rgba(15,76,129,0.4)' }}>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>Student</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>Student ID</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>Program</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>Year</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>GPA</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>Status</TableCell>
            </TableRow></TableHead>
            <TableBody>
              {filtered.map((s) => (
                <TableRow key={s._id} hover sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                  <TableCell><Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ width: 36, height: 36, bgcolor: 'rgba(15,76,129,0.4)', fontSize: 14, fontWeight: 700 }}>{s.user?.name?.split(' ').map(n=>n[0]).slice(0,2).join('')}</Avatar>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{s.user?.name}</Typography>
                  </Box></TableCell>
                  <TableCell sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>{s.studentId}</TableCell>
                  <TableCell>{s.program}</TableCell>
                  <TableCell>Year {s.year} - Sem {s.semester}</TableCell>
                  <TableCell><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: s.gpa >= 3.5 ? '#34d399' : s.gpa >= 2.5 ? '#38bdf8' : '#fbbf24' }}>{s.gpa}</Typography>
                    <Box sx={{ width: 60, height: 4, bgcolor: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}><Box sx={{ width: `${Math.min(s.gpa / 4 * 100, 100)}%`, height: '100%', bgcolor: s.gpa >= 3.5 ? '#34d399' : s.gpa >= 2.5 ? '#38bdf8' : '#fbbf24', borderRadius: 2 }} /></Box>
                  </Box></TableCell>
                  <TableCell><Chip label={s.status} color={statusColor[s.status] || 'default'} size="small" sx={{ fontWeight: 600, textTransform: 'capitalize' }} /></TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6, color: 'text.secondary' }}>No students found.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
          <DialogTitle sx={{ fontWeight: 700 }}>Add New Student</DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="dense" error={touched.user && !!errors.user}>
              <InputLabel>User</InputLabel>
              <Select value={values.user} label="User" onChange={(e) => handleChange('user')(e)} onBlur={handleBlur('user')}>
                {users.map(u => <MenuItem key={u._id} value={u._id}>{u.name} ({u.email})</MenuItem>)}
              </Select>
            </FormControl>
            {touched.user && errors.user && <Typography variant="caption" sx={{ color: '#f87171', ml: 1.5 }}>{errors.user}</Typography>}
            <TextField fullWidth label="Student ID" margin="dense" required value={values.studentId} onChange={(e) => handleChange('studentId')(e)} onBlur={handleBlur('studentId')} error={touched.studentId && !!errors.studentId} helperText={touched.studentId && errors.studentId} />
            <TextField fullWidth label="Program" margin="dense" required value={values.program} onChange={(e) => handleChange('program')(e)} onBlur={handleBlur('program')} error={touched.program && !!errors.program} helperText={touched.program && errors.program} />
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <TextField fullWidth label="Year" type="number" margin="dense" required value={values.year} onChange={(e) => handleChange('year')(e)} onBlur={handleBlur('year')} error={touched.year && !!errors.year} helperText={touched.year && errors.year} />
              <TextField fullWidth label="Semester" type="number" margin="dense" required value={values.semester} onChange={(e) => handleChange('semester')(e)} onBlur={handleBlur('semester')} error={touched.semester && !!errors.semester} helperText={touched.semester && errors.semester} />
            </Box>
            <TextField fullWidth label="GPA" type="number" margin="dense" value={values.gpa} onChange={(e) => handleChange('gpa')(e)} onBlur={handleBlur('gpa')} error={touched.gpa && !!errors.gpa} helperText={touched.gpa && errors.gpa} />
            <FormControl fullWidth margin="dense" error={touched.status && !!errors.status}>
              <InputLabel>Status</InputLabel>
              <Select value={values.status} label="Status" onChange={(e) => handleChange('status')(e)} onBlur={handleBlur('status')}>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="graduated">Graduated</MenuItem>
                <MenuItem value="suspended">Suspended</MenuItem>
                <MenuItem value="withdrawn">Withdrawn</MenuItem>
              </Select>
              {touched.status && errors.status && <Typography variant="caption" sx={{ color: '#f87171', ml: 1.5 }}>{errors.status}</Typography>}
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setOpen(false)} sx={{ textTransform: 'none', fontWeight: 600 }}>Cancel</Button>
            <Button variant="contained" onClick={handleCreate} sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2.5, px: 3 }}>Add Student</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
};

export default Students;
