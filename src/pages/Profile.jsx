import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Box, Typography, Paper, Avatar, Chip, Divider, Grid, Card, CardContent
} from '@mui/material';
import { Person, Email, Security, School, Phone, CalendarToday, VerifiedUser } from '@mui/icons-material';

const Profile = () => {
  const { user } = useAuth();

  const roleColors = {
    admin: { color: '#f87171', bg: 'rgba(248,113,113,0.12)' },
    registrar: { color: '#fbbf24', bg: 'rgba(251,191,36,0.12)' },
    department_head: { color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
    instructor: { color: '#38bdf8', bg: 'rgba(56,189,248,0.12)' },
    student: { color: '#34d399', bg: 'rgba(52,211,153,0.12)' }
  };
  const rc = roleColors[user?.role] || roleColors.student;

  const infoItems = [
    { icon: <Email sx={{ color: '#60a5fa' }} />, label: 'Email', value: user?.email },
    { icon: <Person sx={{ color: '#60a5fa' }} />, label: 'User ID', value: user?.id?.substring(0, 12) + '...' },
    { icon: <Security sx={{ color: '#60a5fa' }} />, label: 'Role', value: user?.role?.replace('_', ' ') },
    { icon: <School sx={{ color: '#60a5fa' }} />, label: 'Department', value: user?.department || 'Not assigned' },
    { icon: <Phone sx={{ color: '#60a5fa' }} />, label: 'Phone', value: 'Not provided' },
    { icon: <CalendarToday sx={{ color: '#60a5fa' }} />, label: 'Member Since', value: new Date().toLocaleDateString('en-GB') },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, fontSize: { xs: '1.5rem', md: '2.125rem' } }}>My Profile</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>View and manage your account information</Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: { xs: 2, md: 4 }, textAlign: 'center', height: 'fit-content' }}>
            <Avatar sx={{
              width: 100, height: 100, mx: 'auto', mb: 2,
              bgcolor: rc.color, fontSize: 36, fontWeight: 800,
              boxShadow: `0 8px 24px ${rc.color}40`
            }}>
              {user?.name?.split(' ').map(n=>n[0]).slice(0,2).join('')}
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>{user?.name}</Typography>
            <Chip label={user?.role?.replace('_', ' ')} size="small" sx={{
              bgcolor: rc.bg, color: rc.color, fontWeight: 700, textTransform: 'capitalize', mb: 2
            }} />
            <Divider sx={{ my: 2 }} />
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}><strong>Email:</strong> {user?.email}</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}><strong>Department:</strong> {user?.department || 'N/A'}</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}><strong>Status:</strong> <span style={{ color: '#34d399', fontWeight: 600 }}>Active</span></Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: { xs: 2, md: 4 } }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, fontSize: { xs: '1.125rem', md: '1.25rem' } }}>Account Details</Typography>
            <Grid container spacing={3}>
              {infoItems.map((item, i) => (
                <Grid item xs={12} sm={6} key={i}>
                  <Card elevation={0} sx={{ bgcolor: '#f8fafc', borderRadius: 3, p: 1 }}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: '12px !important', px: '16px !important' }}>
                      <Avatar sx={{ bgcolor: 'rgba(15,76,129,0.08)', width: 40, height: 40 }}>{item.icon}</Avatar>
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600,  }}>{item.value}</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
