import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import {
  Box, Typography, Grid, Card, CardContent, Chip, CircularProgress, Alert, Paper, Button,
  TextField, InputAdornment, Fade, Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem, Avatar, IconButton
} from '@mui/material';
import { Book, Search, Add, Delete, Edit } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useFormValidation, v } from '../hooks/useFormValidation';

const Courses = () => {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [courses, setCourses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const { values, errors, touched, handleChange, handleBlur, validateAll, resetForm, setFormValues } = useFormValidation(
    { courseCode: '', title: '', credits: 3, department: 'Computer Science', description: '', semester: '1st', year: 1 },
    {
      courseCode: [v.required('Course code is required'), v.minLength(2, 'Must be at least 2 characters'), v.maxLength(20, 'Must be at most 20 characters')],
      title: [v.required('Title is required'), v.minLength(2, 'Must be at least 2 characters'), v.maxLength(200, 'Must be at most 200 characters')],
      credits: [v.required('Credits are required'), v.isNumber('Must be a number'), v.min(1, 'Must be at least 1'), v.max(20, 'Must be at most 20'), v.integer('Must be a whole number')],
      department: [v.required('Department is required'), v.minLength(2, 'Must be at least 2 characters')],
      year: [v.required('Year is required'), v.isNumber('Must be a number'), v.min(1, 'Must be at least 1'), v.max(7, 'Must be at most 7'), v.integer('Must be a whole number')],
      semester: [v.required('Semester is required')],
      description: [v.maxLength(1000, 'Description must be at most 1000 characters')],
    }
  );

  useEffect(() => { fetchCourses(); }, []);

  useEffect(() => {
    const term = search.toLowerCase();
    setFiltered(courses.filter(c => c.courseCode.toLowerCase().includes(term) || c.title.toLowerCase().includes(term) || c.department.toLowerCase().includes(term)));
  }, [search, courses]);

  const fetchCourses = () => {
    setLoading(true);
    axios.get('/api/courses').then(res => { setCourses(res.data); setFiltered(res.data); setLoading(false); })
      .catch(() => { setLoading(false); enqueueSnackbar('Failed to load courses', { variant: 'error' }); });
  };

  const handleCreate = async () => {
    if (!validateAll()) {
      enqueueSnackbar('Please fix the errors in the form', { variant: 'warning' });
      return;
    }
    try {
      if (editMode && editId) {
        await axios.put(`/api/courses/${editId}`, values);
        enqueueSnackbar('Course updated successfully', { variant: 'success' });
      } else {
        await axios.post('/api/courses', values);
        enqueueSnackbar('Course created successfully', { variant: 'success' });
      }
      setOpen(false);
      resetForm();
      setEditMode(false);
      setEditId(null);
      fetchCourses();
    } catch (err) {
      const msg = err.response?.data?.message || 'Operation failed';
      enqueueSnackbar(msg, { variant: 'error' });
    }
  };

  const handleEdit = (course) => {
    setFormValues({
      courseCode: course.courseCode, title: course.title, credits: course.credits,
      department: course.department, description: course.description || '', semester: course.semester, year: course.year
    });
    setEditMode(true);
    setEditId(course._id);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await axios.delete(`/api/courses/${id}`);
      enqueueSnackbar('Course deleted successfully', { variant: 'success' });
      fetchCourses();
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || 'Failed to delete course', { variant: 'error' });
    }
  };

  const canEdit = ['admin', 'registrar', 'department_head'].includes(user?.role);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress size={48} sx={{ color: '#0f4c81' }} /></Box>;

  return (
    <Fade in timeout={400}>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1a2a3a', fontSize: { xs: '1.5rem', md: '2.125rem' } }}>Courses</Typography>
            <Typography variant="body2" color="text.secondary">Browse and manage academic courses</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', width: { xs: '100%', sm: 'auto' } }}>
            <TextField placeholder="Search courses..." size="small" value={search} onChange={e => setSearch(e.target.value)}
              sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: { sm: 240 }, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" sx={{ color: '#5a6a7a' }} /></InputAdornment> }} />
            {canEdit && (
              <Button variant="contained" startIcon={<Add />} onClick={() => { resetForm(); setEditMode(false); setEditId(null); setOpen(true); }} sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 600 }}>New Course</Button>
            )}
          </Box>
        </Box>

        <Grid container spacing={3}>
          {filtered.map((c) => (
            <Grid item xs={12} md={6} lg={4} key={c._id}>
              <Card sx={{ height: '100%', '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 16px 48px rgba(0,0,0,0.10)' } }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Chip label={c.courseCode} size="small" sx={{ bgcolor: '#0f4c8115', color: '#0f4c81', fontWeight: 700, borderRadius: 1.5 }} />
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {canEdit && (
                        <>
                          <IconButton size="small" onClick={() => handleEdit(c)} sx={{ color: '#2980b9' }}><Edit fontSize="small" /></IconButton>
                          <IconButton size="small" onClick={() => handleDelete(c._id)} sx={{ color: '#c0392b' }}><Delete fontSize="small" /></IconButton>
                        </>
                      )}
                    </Box>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a2a3a', mb: 1, fontSize: { xs: '1.125rem', md: '1.25rem' } }}>{c.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.7, minHeight: 48 }}>{c.description || 'No description available.'}</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    <Chip label={c.department} size="small" sx={{ bgcolor: '#e8f0fe', color: '#0f4c81' }} />
                    <Chip label={`Year ${c.year}`} size="small" sx={{ bgcolor: '#f3e5f5', color: '#8e44ad' }} />
                    <Chip label={`${c.credits} Credits`} size="small" variant="outlined" sx={{ fontWeight: 500 }} />
                  </Box>
                  {c.instructor && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pt: 1.5, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                      <Avatar sx={{ width: 28, height: 28, bgcolor: '#2980b9', fontSize: 12 }}>{c.instructor.name?.split(' ').map(n=>n[0]).slice(0,2).join('')}</Avatar>
                      <Typography variant="caption" sx={{ color: '#5a6a7a', fontWeight: 500 }}>{c.instructor.name}</Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
          {filtered.length === 0 && <Grid item xs={12}><Paper sx={{ p: 6, textAlign: 'center' }}><Typography color="text.secondary">No courses found.</Typography></Paper></Grid>}
        </Grid>

        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
          <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>{editMode ? 'Edit Course' : 'Create New Course'}</DialogTitle>
          <DialogContent>
            <TextField fullWidth label="Course Code" margin="dense" required value={values.courseCode} onChange={(e) => handleChange('courseCode')(e)} onBlur={handleBlur('courseCode')} error={touched.courseCode && !!errors.courseCode} helperText={touched.courseCode && errors.courseCode} />
            <TextField fullWidth label="Course Title" margin="dense" required value={values.title} onChange={(e) => handleChange('title')(e)} onBlur={handleBlur('title')} error={touched.title && !!errors.title} helperText={touched.title && errors.title} />
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <TextField fullWidth label="Credits" type="number" margin="dense" value={values.credits} onChange={(e) => handleChange('credits')(e)} onBlur={handleBlur('credits')} error={touched.credits && !!errors.credits} helperText={touched.credits && errors.credits} />
              <TextField fullWidth label="Year" type="number" margin="dense" value={values.year} onChange={(e) => handleChange('year')(e)} onBlur={handleBlur('year')} error={touched.year && !!errors.year} helperText={touched.year && errors.year} />
            </Box>
            <FormControl fullWidth margin="dense" error={touched.semester && !!errors.semester}>
              <InputLabel>Semester</InputLabel>
              <Select value={values.semester} label="Semester" onChange={(e) => handleChange('semester')(e)} onBlur={handleBlur('semester')}>
                <MenuItem value="1st">1st Semester</MenuItem>
                <MenuItem value="2nd">2nd Semester</MenuItem>
              </Select>
              {touched.semester && errors.semester && <Typography variant="caption" sx={{ color: '#c0392b', ml: 1.5 }}>{errors.semester}</Typography>}
            </FormControl>
            <TextField fullWidth label="Department" margin="dense" value={values.department} onChange={(e) => handleChange('department')(e)} onBlur={handleBlur('department')} error={touched.department && !!errors.department} helperText={touched.department && errors.department} />
            <TextField fullWidth label="Description" margin="dense" multiline rows={3} value={values.description} onChange={(e) => handleChange('description')(e)} />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setOpen(false)} sx={{ textTransform: 'none', fontWeight: 600 }}>Cancel</Button>
            <Button variant="contained" onClick={handleCreate} sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2.5, px: 3 }}>{editMode ? 'Update Course' : 'Create Course'}</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
};

export default Courses;
