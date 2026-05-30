import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from 'notistack';
import {
  Box, Typography, Card, CardContent, Chip, CircularProgress, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem,
  Fade, Avatar, Divider, IconButton
} from '@mui/material';
import { Campaign, Add, Delete, Edit } from '@mui/icons-material';
import { useFormValidation, v } from '../hooks/useFormValidation';

const Announcements = () => {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const { values, errors, touched, handleChange, handleBlur, validateAll, resetForm, setFormValues } = useFormValidation(
    { title: '', content: '', targetAudience: 'all' },
    {
      title: [v.required('Title is required'), v.minLength(3, 'At least 3 characters'), v.maxLength(200, 'At most 200 characters')],
      content: [v.required('Content is required'), v.minLength(5, 'At least 5 characters'), v.maxLength(5000, 'At most 5000 characters')],
      targetAudience: [v.required('Target audience is required')],
    }
  );

  useEffect(() => { fetchAnnouncements(); }, []);

  const fetchAnnouncements = () => {
    axios.get('/api/announcements').then(res => { setAnnouncements(res.data); setLoading(false); })
      .catch(() => { setLoading(false); enqueueSnackbar('Failed to load announcements', { variant: 'error' }); });
  };

  const handleCreate = async () => {
    if (!validateAll()) { enqueueSnackbar('Please fix the errors', { variant: 'warning' }); return; }
    try {
      if (editMode && editId) {
        await axios.put(`/api/announcements/${editId}`, values);
        enqueueSnackbar('Announcement updated successfully', { variant: 'success' });
      } else {
        await axios.post('/api/announcements', values);
        enqueueSnackbar('Announcement posted successfully', { variant: 'success' });
      }
      setOpen(false); resetForm(); setEditMode(false); setEditId(null); fetchAnnouncements();
    } catch (err) { enqueueSnackbar(err.response?.data?.message || 'Failed to save announcement', { variant: 'error' }); }
  };

  const handleEdit = (a) => {
    setFormValues({ title: a.title, content: a.content, targetAudience: a.targetAudience });
    setEditMode(true); setEditId(a._id); setOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    try {
      await axios.delete(`/api/announcements/${id}`);
      enqueueSnackbar('Announcement deleted successfully', { variant: 'success' });
      fetchAnnouncements();
    } catch (err) { enqueueSnackbar(err.response?.data?.message || 'Failed to delete', { variant: 'error' }); }
  };

  const audienceColors = {
    all: { bg: '#e8f0fe', color: '#0f4c81' },
    students: { bg: '#e8f5e9', color: '#27ae60' },
    instructors: { bg: '#e0f2fe', color: '#2980b9' },
    registrar: { bg: '#f3e5f5', color: '#8e44ad' },
    department_heads: { bg: '#fff8e1', color: '#f39c12' }
  };

  const canCreate = ['admin', 'registrar', 'department_head'].includes(user.role);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress size={48} sx={{ color: '#0f4c81' }} /></Box>;

  return (
    <Fade in timeout={400}>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1a2a3a', fontSize: { xs: '1.5rem', md: '2.125rem' } }}>Announcements</Typography>
            <Typography variant="body2" color="text.secondary">Stay updated with the latest institutional news</Typography>
          </Box>
          {canCreate && (
            <Button variant="contained" startIcon={<Add />} onClick={() => { resetForm(); setEditMode(false); setEditId(null); setOpen(true); }} sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 600 }}>New Announcement</Button>
          )}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {announcements.map((a) => {
            const colors = audienceColors[a.targetAudience] || audienceColors.all;
            const isAuthor = a.postedBy?._id === user?.id || user?.role === 'admin';
            return (
              <Card key={a._id} elevation={0} sx={{ borderLeft: `4px solid ${colors.color}`, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.06)', '&:hover': { boxShadow: '0 8px 32px rgba(0,0,0,0.10)', transform: 'translateY(-2px)' } }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a2a3a', lineHeight: 1.3, fontSize: { xs: '1.125rem', md: '1.25rem' } }}>{a.title}</Typography>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Chip label={a.targetAudience.replace('_', ' ')} size="small" sx={{ bgcolor: colors.bg, color: colors.color, fontWeight: 700, textTransform: 'capitalize' }} />
                      {isAuthor && (
                        <>
                          <IconButton size="small" onClick={() => handleEdit(a)} sx={{ color: '#2980b9' }}><Edit fontSize="small" /></IconButton>
                          <IconButton size="small" onClick={() => handleDelete(a._id)} sx={{ color: '#c0392b' }}><Delete fontSize="small" /></IconButton>
                        </>
                      )}
                    </Box>
                  </Box>
                  <Typography variant="body1" sx={{ color: '#5a6a7a', lineHeight: 1.7, mb: 2 }}>{a.content}</Typography>
                  <Divider sx={{ mb: 1.5 }} />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 28, height: 28, bgcolor: colors.color, fontSize: 12, fontWeight: 700 }}>{a.postedBy?.name?.split(' ').map(n=>n[0]).slice(0,2).join('')}</Avatar>
                    <Typography variant="caption" sx={{ color: '#5a6a7a', fontWeight: 500 }}>{a.postedBy?.name} &bull; {a.postedBy?.role?.replace('_', ' ')} &bull; {new Date(a.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</Typography>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
          {announcements.length === 0 && <Paper sx={{ p: 6, textAlign: 'center' }}><Campaign sx={{ fontSize: 48, color: '#5a6a7a', mb: 2 }} /><Typography color="text.secondary">No announcements yet.</Typography></Paper>}
        </Box>

        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
          <DialogTitle sx={{ fontWeight: 700 }}>{editMode ? 'Edit Announcement' : 'Create Announcement'}</DialogTitle>
          <DialogContent>
            <TextField fullWidth label="Title" margin="dense" required value={values.title} onChange={(e) => handleChange('title')(e)} onBlur={handleBlur('title')} error={touched.title && !!errors.title} helperText={touched.title && errors.title} />
            <TextField fullWidth label="Content" margin="dense" multiline rows={4} required value={values.content} onChange={(e) => handleChange('content')(e)} onBlur={handleBlur('content')} error={touched.content && !!errors.content} helperText={touched.content && errors.content} />
            <FormControl fullWidth margin="dense" error={touched.targetAudience && !!errors.targetAudience}>
              <InputLabel>Target Audience</InputLabel>
              <Select value={values.targetAudience} label="Target Audience" onChange={(e) => handleChange('targetAudience')(e)} onBlur={handleBlur('targetAudience')}>
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="students">Students</MenuItem>
                <MenuItem value="instructors">Instructors</MenuItem>
                <MenuItem value="registrar">Registrar Staff</MenuItem>
                <MenuItem value="department_heads">Department Heads</MenuItem>
              </Select>
              {touched.targetAudience && errors.targetAudience && <Typography variant="caption" sx={{ color: '#c0392b', ml: 1.5 }}>{errors.targetAudience}</Typography>}
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setOpen(false)} sx={{ textTransform: 'none', fontWeight: 600 }}>Cancel</Button>
            <Button variant="contained" onClick={handleCreate} sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2.5, px: 3 }}>{editMode ? 'Update' : 'Post'}</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
};

export default Announcements;
