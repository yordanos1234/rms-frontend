import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from 'notistack';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Chip, CircularProgress, Button, Dialog, DialogTitle, DialogContent,
  TextField, DialogActions, FormControl, InputLabel, Select, MenuItem, Fade, Avatar,
  IconButton
} from '@mui/material';
import { Add, CheckCircle, Cancel } from '@mui/icons-material';
import { useFormValidation, v } from '../hooks/useFormValidation';

const Grades = () => {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [grades, setGrades] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const { values, errors, touched, handleChange, handleBlur, validateAll, resetForm } = useFormValidation(
    { student: '', course: '', midterm: '', assignment: '', final: '' },
    {
      student: [v.required('Please select a student')],
      course: [v.required('Please select a course')],
      midterm: [
        v.required('Midterm mark is required'),
        v.isNumber('Must be a number'),
        v.min(0, 'Must be at least 0'),
        v.max(100, 'Must be at most 100'),
      ],
      assignment: [
        v.required('Assignment mark is required'),
        v.isNumber('Must be a number'),
        v.min(0, 'Must be at least 0'),
        v.max(100, 'Must be at most 100'),
      ],
      final: [
        v.required('Final mark is required'),
        v.isNumber('Must be a number'),
        v.min(0, 'Must be at least 0'),
        v.max(100, 'Must be at most 100'),
      ],
    }
  );

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [gRes, cRes, sRes] = await Promise.all([axios.get('/api/grades'), axios.get('/api/courses'), axios.get('/api/students')]);
      setGrades(gRes.data); setCourses(cRes.data); setStudents(sRes.data);
    } catch (err) { enqueueSnackbar('Failed to load grades', { variant: 'error' }); }
    setLoading(false);
  };

  const getGradeColor = (grade) => {
    if (['A+','A','A-'].includes(grade)) return '#27ae60';
    if (['B+','B','B-'].includes(grade)) return '#2980b9';
    if (['C+','C','C-'].includes(grade)) return '#f39c12';
    if (grade === 'D') return '#e67e22';
    return '#c0392b';
  };

  const handleSubmit = async () => {
    if (!validateAll()) { enqueueSnackbar('Please fix the errors in the form', { variant: 'warning' }); return; }
    try {
      const total = Number(values.midterm) + Number(values.assignment) + Number(values.final);
      let grade = 'F';
      if (total >= 90) grade = 'A+'; else if (total >= 85) grade = 'A'; else if (total >= 80) grade = 'A-';
      else if (total >= 75) grade = 'B+'; else if (total >= 70) grade = 'B'; else if (total >= 65) grade = 'B-';
      else if (total >= 60) grade = 'C+'; else if (total >= 55) grade = 'C'; else if (total >= 50) grade = 'C-';
      else if (total >= 45) grade = 'D';
      await axios.post('/api/grades', {
        student: values.student,
        course: values.course,
        enrollment: '000000000000000000000000',
        marks: { midterm: Number(values.midterm), assignment: Number(values.assignment), final: Number(values.final), total },
        grade
      });
      enqueueSnackbar('Grade submitted successfully', { variant: 'success' });
      setOpen(false);
      resetForm();
      fetchData();
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || 'Failed to submit grade', { variant: 'error' });
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`/api/grades/${id}`, { status: 'approved' });
      enqueueSnackbar('Grade approved successfully', { variant: 'success' });
      fetchData();
    } catch (err) { enqueueSnackbar('Failed to approve grade', { variant: 'error' }); }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(`/api/grades/${id}`, { status: 'rejected' });
      enqueueSnackbar('Grade rejected', { variant: 'warning' });
      fetchData();
    } catch (err) { enqueueSnackbar('Failed to reject grade', { variant: 'error' }); }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress size={48} sx={{ color: '#0f4c81' }} /></Box>;

  return (
    <Fade in timeout={400}>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1a2a3a', fontSize: { xs: '1.5rem', md: '2.125rem' } }}>Grades</Typography>
            <Typography variant="body2" color="text.secondary">View and manage student academic grades</Typography>
          </Box>
          {user.role === 'instructor' && (
            <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)} sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 600 }}>Submit Grade</Button>
          )}
        </Box>

        <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead><TableRow sx={{ bgcolor: '#0f4c81' }}>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>Student</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>Course</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }} align="center">Midterm</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }} align="center">Assignment</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }} align="center">Final</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }} align="center">Total</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }} align="center">Grade</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }} align="center">Status</TableCell>
              {['registrar','admin'].includes(user.role) && <TableCell sx={{ color: 'white', fontWeight: 700 }} align="center">Actions</TableCell>}
            </TableRow></TableHead>
            <TableBody>
              {grades.map((g) => (
                <TableRow key={g._id} hover sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                  <TableCell><Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#0f4c81', fontSize: 13 }}>{g.student?.user?.name?.split(' ').map(n=>n[0]).slice(0,2).join('')}</Avatar>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{g.student?.user?.name || g.student?.studentId}</Typography>
                  </Box></TableCell>
                  <TableCell><Typography variant="body2" sx={{ fontWeight: 600 }}>{g.course?.courseCode}</Typography><Typography variant="caption" sx={{ color: '#5a6a7a' }}>{g.course?.title}</Typography></TableCell>
                  <TableCell align="center">{g.marks?.midterm}</TableCell>
                  <TableCell align="center">{g.marks?.assignment}</TableCell>
                  <TableCell align="center">{g.marks?.final}</TableCell>
                  <TableCell align="center"><Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, minWidth: 28 }}>{g.marks?.total}</Typography>
                    <Box sx={{ width: 50, height: 5, bgcolor: '#e2e8f0', borderRadius: 2, overflow: 'hidden' }}><Box sx={{ width: `${Math.min((g.marks?.total || 0) / 100 * 100, 100)}%`, height: '100%', bgcolor: getGradeColor(g.grade), borderRadius: 2 }} /></Box>
                  </Box></TableCell>
                  <TableCell align="center"><Chip label={g.grade} size="small" sx={{ bgcolor: getGradeColor(g.grade) + '18', color: getGradeColor(g.grade), fontWeight: 800, minWidth: 40 }} /></TableCell>
                  <TableCell align="center"><Chip label={g.status} size="small" color={g.status === 'approved' ? 'success' : g.status === 'submitted' ? 'warning' : 'default'} sx={{ fontWeight: 600, textTransform: 'capitalize' }} /></TableCell>
                  {['registrar','admin'].includes(user.role) && (
                    <TableCell align="center">
                      {g.status === 'submitted' && (
                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                          <IconButton size="small" color="success" onClick={() => handleApprove(g._id)}><CheckCircle fontSize="small" /></IconButton>
                          <IconButton size="small" color="error" onClick={() => handleReject(g._id)}><Cancel fontSize="small" /></IconButton>
                        </Box>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
              {grades.length === 0 && <TableRow><TableCell colSpan={9} align="center" sx={{ py: 6, color: '#5a6a7a' }}>No grades found.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
          <DialogTitle sx={{ fontWeight: 700 }}>Submit Grade</DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="dense" error={touched.student && !!errors.student}>
              <InputLabel>Student</InputLabel>
              <Select value={values.student} label="Student" onChange={(e) => handleChange('student')(e)} onBlur={handleBlur('student')}>
                {students.map(s => <MenuItem key={s._id} value={s._id}>{s.user?.name} ({s.studentId})</MenuItem>)}
              </Select>
              {touched.student && errors.student && <Typography variant="caption" sx={{ color: '#c0392b', ml: 1.5 }}>{errors.student}</Typography>}
            </FormControl>
            <FormControl fullWidth margin="dense" error={touched.course && !!errors.course}>
              <InputLabel>Course</InputLabel>
              <Select value={values.course} label="Course" onChange={(e) => handleChange('course')(e)} onBlur={handleBlur('course')}>
                {courses.map(c => <MenuItem key={c._id} value={c._id}>{c.courseCode} - {c.title}</MenuItem>)}
              </Select>
              {touched.course && errors.course && <Typography variant="caption" sx={{ color: '#c0392b', ml: 1.5 }}>{errors.course}</Typography>}
            </FormControl>
            <Box sx={{ display: 'flex', gap: 2, mt: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
              <TextField fullWidth label="Midterm" type="number" value={values.midterm} onChange={(e) => handleChange('midterm')(e)} onBlur={handleBlur('midterm')} error={touched.midterm && !!errors.midterm} helperText={touched.midterm && errors.midterm} />
              <TextField fullWidth label="Assignment" type="number" value={values.assignment} onChange={(e) => handleChange('assignment')(e)} onBlur={handleBlur('assignment')} error={touched.assignment && !!errors.assignment} helperText={touched.assignment && errors.assignment} />
              <TextField fullWidth label="Final" type="number" value={values.final} onChange={(e) => handleChange('final')(e)} onBlur={handleBlur('final')} error={touched.final && !!errors.final} helperText={touched.final && errors.final} />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setOpen(false)} sx={{ textTransform: 'none', fontWeight: 600 }}>Cancel</Button>
            <Button variant="contained" onClick={handleSubmit} sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2.5, px: 3 }}>Submit Grade</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
};

export default Grades;
