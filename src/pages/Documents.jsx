import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from 'notistack';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Chip, CircularProgress, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, FormControl, InputLabel, Select, MenuItem, TextField, Fade, Avatar,
  IconButton
} from '@mui/material';
import { Add, CheckCircle, Delete } from '@mui/icons-material';
import { useFormValidation, v } from '../hooks/useFormValidation';

const Documents = () => {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const { values, errors, touched, handleChange, handleBlur, validateAll, resetForm } = useFormValidation(
    { type: 'transcript', purpose: '' },
    {
      type: [v.required('Please select a document type')],
      purpose: [
        v.minLength(2, 'Purpose must be at least 2 characters'),
        v.maxLength(500, 'Purpose must be at most 500 characters'),
      ],
    }
  );

  useEffect(() => { fetchDocs(); }, []);

  const fetchDocs = () => {
    axios.get('/api/documents').then(res => { setDocs(res.data); setLoading(false); })
      .catch(() => { setLoading(false); enqueueSnackbar('Failed to load documents', { variant: 'error' }); });
  };

  const handleRequest = async () => {
    if (!validateAll()) { enqueueSnackbar('Please fix the errors', { variant: 'warning' }); return; }
    try {
      await axios.post('/api/documents', values);
      enqueueSnackbar('Document requested successfully', { variant: 'success' });
      setOpen(false); resetForm(); fetchDocs();
    } catch (err) { enqueueSnackbar(err.response?.data?.message || 'Failed to request document', { variant: 'error' }); }
  };

  const handleUpdate = async (id, status) => {
    try {
      await axios.put(`/api/documents/${id}`, { status });
      enqueueSnackbar(`Document marked as ${status}`, { variant: 'success' });
      fetchDocs();
    } catch (err) { enqueueSnackbar('Failed to update document', { variant: 'error' }); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document request?')) return;
    try {
      await axios.delete(`/api/documents/${id}`);
      enqueueSnackbar('Document request deleted', { variant: 'success' });
      fetchDocs();
    } catch (err) { enqueueSnackbar('Failed to delete document', { variant: 'error' }); }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress size={48} sx={{ color: '#0f4c81' }} /></Box>;

  return (
    <Fade in timeout={400}>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1a2a3a', fontSize: { xs: '1.5rem', md: '2.125rem' } }}>Documents</Typography>
            <Typography variant="body2" color="text.secondary">Request and track academic documents</Typography>
          </Box>
          {user.role === 'student' && (
            <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)} sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 600 }}>Request Document</Button>
          )}
        </Box>

        <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead><TableRow sx={{ bgcolor: '#0f4c81' }}>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>Student</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>Type</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>Purpose</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }} align="center">Status</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }} align="center">Requested</TableCell>
              {user.role !== 'student' && <TableCell sx={{ color: 'white', fontWeight: 700 }} align="center">Actions</TableCell>}
            </TableRow></TableHead>
            <TableBody>
              {docs.map((d) => (
                <TableRow key={d._id} hover sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                  <TableCell><Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#0f4c81', fontSize: 12 }}>{d.student?.user?.name?.split(' ').map(n=>n[0]).slice(0,2).join('')}</Avatar>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{d.student?.user?.name || d.student?.studentId}</Typography>
                  </Box></TableCell>
                  <TableCell><Chip label={d.type.replace('_', ' ').toUpperCase()} size="small" sx={{ bgcolor: d.type === 'transcript' ? '#e8f0fe' : d.type === 'enrollment_letter' ? '#e0f2fe' : d.type === 'certificate' ? '#e8f5e9' : '#fff8e1', color: d.type === 'transcript' ? '#0f4c81' : d.type === 'enrollment_letter' ? '#2980b9' : d.type === 'certificate' ? '#27ae60' : '#f39c12', fontWeight: 700 }} /></TableCell>
                  <TableCell sx={{ maxWidth: 200 }}><Typography variant="body2" noWrap>{d.purpose}</Typography></TableCell>
                  <TableCell align="center"><Chip label={d.status} size="small" sx={{ bgcolor: d.status === 'ready' ? '#e8f5e9' : d.status === 'pending' ? '#fff8e1' : d.status === 'processing' ? '#e0f2fe' : '#f5f5f5', color: d.status === 'ready' ? '#27ae60' : d.status === 'pending' ? '#f39c12' : d.status === 'processing' ? '#2980b9' : '#5a6a7a', fontWeight: 700, textTransform: 'capitalize' }} /></TableCell>
                  <TableCell align="center">{new Date(d.requestedAt).toLocaleDateString('en-GB')}</TableCell>
                  {user.role !== 'student' && (
                    <TableCell align="center">
                      {d.status === 'pending' && (
                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                          <Button size="small" variant="outlined" sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, fontSize: 12 }} onClick={() => handleUpdate(d._id, 'processing')}>Process</Button>
                          <Button size="small" variant="contained" sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, fontSize: 12 }} onClick={() => handleUpdate(d._id, 'ready')}>Ready</Button>
                        </Box>
                      )}
                      {d.status === 'processing' && (
                        <Button size="small" color="success" variant="contained" sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, fontSize: 12 }} onClick={() => handleUpdate(d._id, 'ready')}>Mark Ready</Button>
                      )}
                      {['ready','delivered'].includes(d.status) && (
                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                          <CheckCircle sx={{ color: '#27ae60' }} />
                          <IconButton size="small" color="error" onClick={() => handleDelete(d._id)}><Delete fontSize="small" /></IconButton>
                        </Box>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
              {docs.length === 0 && <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6, color: '#5a6a7a' }}>No document requests found.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
          <DialogTitle sx={{ fontWeight: 700 }}>Request Document</DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="dense" error={touched.type && !!errors.type}>
              <InputLabel>Document Type</InputLabel>
              <Select value={values.type} label="Document Type" onChange={(e) => handleChange('type')(e)} onBlur={handleBlur('type')}>
                <MenuItem value="transcript">Transcript</MenuItem>
                <MenuItem value="enrollment_letter">Enrollment Letter</MenuItem>
                <MenuItem value="certificate">Certificate</MenuItem>
                <MenuItem value="clearance">Clearance</MenuItem>
                <MenuItem value="id_card">ID Card</MenuItem>
              </Select>
              {touched.type && errors.type && <Typography variant="caption" sx={{ color: '#c0392b', ml: 1.5 }}>{errors.type}</Typography>}
            </FormControl>
            <TextField fullWidth label="Purpose" margin="dense" multiline rows={2} placeholder="e.g. Graduation application, Internship, Job application..."
              value={values.purpose} onChange={(e) => handleChange('purpose')(e)} onBlur={handleBlur('purpose')}
              error={touched.purpose && !!errors.purpose} helperText={touched.purpose && errors.purpose} />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setOpen(false)} sx={{ textTransform: 'none', fontWeight: 600 }}>Cancel</Button>
            <Button variant="contained" onClick={handleRequest} sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2.5, px: 3 }}>Request</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
};

export default Documents;
