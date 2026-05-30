import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
  Box, Typography, Grid, Card, CardContent, Paper, List, ListItem, ListItemText,
  Avatar, Divider, LinearProgress
} from '@mui/material';
import {
  School, Book, Description, Group, TrendingUp, CheckCircle, Warning, Schedule
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { ModernSpinner } from '../components/ModernSpinner';

const COLORS = ['#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#38bdf8'];

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (['admin', 'registrar', 'department_head'].includes(user.role)) {
          const statsRes = await axios.get('/api/reports/stats');
          setStats(statsRes.data);
        }
        const annRes = await axios.get('/api/announcements');
        setAnnouncements(annRes.data.slice(0, 5));
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchData();
  }, [user.role]);

  const roleCards = {
    student: [
      { title: 'Program', value: 'BSc Computer Science', icon: <School sx={{ fontSize: 32, color: '#60a5fa' }} />, color: 'rgba(96,165,250,0.12)', textColor: '#60a5fa' },
      { title: 'Current Semester', value: '1st Semester 2025', icon: <Schedule sx={{ fontSize: 32, color: '#38bdf8' }} />, color: 'rgba(56,189,248,0.12)', textColor: '#38bdf8' },
      { title: 'Cumulative GPA', value: '3.52', icon: <TrendingUp sx={{ fontSize: 32, color: '#34d399' }} />, color: 'rgba(52,211,153,0.12)', textColor: '#34d399' },
      { title: 'Academic Status', value: 'Good Standing', icon: <CheckCircle sx={{ fontSize: 32, color: '#a78bfa' }} />, color: 'rgba(167,139,250,0.12)', textColor: '#a78bfa' },
    ],
    instructor: [
      { title: 'Courses Teaching', value: '4', icon: <Book sx={{ fontSize: 32, color: '#60a5fa' }} />, color: 'rgba(96,165,250,0.12)', textColor: '#60a5fa' },
      { title: 'Total Students', value: '128', icon: <Group sx={{ fontSize: 32, color: '#38bdf8' }} />, color: 'rgba(56,189,248,0.12)', textColor: '#38bdf8' },
      { title: 'Pending Grades', value: '3', icon: <Warning sx={{ fontSize: 32, color: '#fbbf24' }} />, color: 'rgba(251,191,36,0.12)', textColor: '#fbbf24' },
      { title: 'Department', value: 'Computer Science', icon: <School sx={{ fontSize: 32, color: '#a78bfa' }} />, color: 'rgba(167,139,250,0.12)', textColor: '#a78bfa' },
    ],
    registrar: [
      { title: 'Total Students', value: stats?.totalStudents || 0, icon: <Group sx={{ fontSize: 32, color: '#60a5fa' }} />, color: 'rgba(96,165,250,0.12)', textColor: '#60a5fa' },
      { title: 'Active Courses', value: stats?.totalCourses || 0, icon: <Book sx={{ fontSize: 32, color: '#38bdf8' }} />, color: 'rgba(56,189,248,0.12)', textColor: '#38bdf8' },
      { title: 'Pending Documents', value: stats?.pendingDocs || 0, icon: <Description sx={{ fontSize: 32, color: '#fbbf24' }} />, color: 'rgba(251,191,36,0.12)', textColor: '#fbbf24' },
      { title: 'Total Enrollments', value: stats?.totalEnrollments || 0, icon: <School sx={{ fontSize: 32, color: '#34d399' }} />, color: 'rgba(52,211,153,0.12)', textColor: '#34d399' },
    ],
    admin: [
      { title: 'Total Students', value: stats?.totalStudents || 0, icon: <Group sx={{ fontSize: 32, color: '#60a5fa' }} />, color: 'rgba(96,165,250,0.12)', textColor: '#60a5fa' },
      { title: 'Active Courses', value: stats?.totalCourses || 0, icon: <Book sx={{ fontSize: 32, color: '#38bdf8' }} />, color: 'rgba(56,189,248,0.12)', textColor: '#38bdf8' },
      { title: 'Pending Documents', value: stats?.pendingDocs || 0, icon: <Description sx={{ fontSize: 32, color: '#fbbf24' }} />, color: 'rgba(251,191,36,0.12)', textColor: '#fbbf24' },
      { title: 'Active Users', value: stats?.activeStudents || 0, icon: <CheckCircle sx={{ fontSize: 32, color: '#34d399' }} />, color: 'rgba(52,211,153,0.12)', textColor: '#34d399' },
    ],
    department_head: [
      { title: 'Dept Students', value: stats?.totalStudents || 0, icon: <Group sx={{ fontSize: 32, color: '#60a5fa' }} />, color: 'rgba(96,165,250,0.12)', textColor: '#60a5fa' },
      { title: 'Courses', value: stats?.totalCourses || 0, icon: <Book sx={{ fontSize: 32, color: '#38bdf8' }} />, color: 'rgba(56,189,248,0.12)', textColor: '#38bdf8' },
      { title: 'Enrollments', value: stats?.totalEnrollments || 0, icon: <School sx={{ fontSize: 32, color: '#fbbf24' }} />, color: 'rgba(251,191,36,0.12)', textColor: '#fbbf24' },
      { title: 'Graduated', value: stats?.graduatedStudents || 0, icon: <CheckCircle sx={{ fontSize: 32, color: '#34d399' }} />, color: 'rgba(52,211,153,0.12)', textColor: '#34d399' },
    ]
  };

  const cards = roleCards[user.role] || roleCards.student;
  const chartData = stats ? [
    { name: 'Active Students', value: stats.activeStudents },
    { name: 'Graduated', value: stats.graduatedStudents },
    { name: 'Suspended', value: Math.max(0, stats.totalStudents - stats.activeStudents - stats.graduatedStudents) },
  ] : [];

  const enrollmentData = [
    { month: 'Sep', students: 420 },
    { month: 'Oct', students: 480 },
    { month: 'Nov', students: 510 },
    { month: 'Dec', students: 490 },
    { month: 'Jan', students: 540 },
    { month: 'Feb', students: 580 },
  ];

  if (loading) return (
    <ModernSpinner message="Loading your dashboard..." />
  );

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, fontSize: { xs: '1.5rem', md: '2.125rem' } }}>
          Welcome back, {user.name.split(' ')[0]}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening in your registrar system today.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {cards.map((card, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card sx={{ bgcolor: card.color, border: 'none', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 32px rgba(0,0,0,0.10)' } }}>
              <CardContent sx={{ py: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: card.textColor, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.title}</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>{card.value}</Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.5)', width: 48, height: 48 }}>{card.icon}</Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        {stats && (
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: { xs: 320, md: 400 }, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontSize: { xs: '1.125rem', md: '1.25rem' } }}>Student Distribution</Typography>
              <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                {chartData.map((entry, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: COLORS[index] }} />
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{entry.name}</Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        )}
        <Grid item xs={12} md={stats ? 8 : 12}>
          <Paper sx={{ p: 3, height: { xs: 320, md: 400 }, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontSize: { xs: '1.125rem', md: '1.25rem' } }}>Enrollment Trends</Typography>
            <Box sx={{ flexGrow: 1 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={enrollmentData}>
                  <defs>
                    <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0f4c81" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#0f4c81" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#5a6a7a', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#5a6a7a', fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                  <Area type="monotone" dataKey="students" stroke="#0f4c81" strokeWidth={3} fillOpacity={1} fill="url(#colorStudents)" />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontSize: { xs: '1.125rem', md: '1.25rem' } }}>Recent Announcements</Typography>
            <List>
              {announcements.map((a, i) => (
                <ListItem key={a._id} divider={i < announcements.length - 1} sx={{ px: 0, py: 1.5 }}>
                  <Avatar sx={{ bgcolor: a.targetAudience === 'all' ? '#60a5fa' : '#38bdf8', width: 36, height: 36, mr: 2, fontSize: 14, fontWeight: 700 }}>
                    {a.targetAudience === 'all' ? 'A' : a.targetAudience[0].toUpperCase()}
                  </Avatar>
                  <ListItemText
                    primary={<Typography variant="body1" sx={{ fontWeight: 600,  }}>{a.title}</Typography>}
                    secondary={<Typography variant="caption" sx={{ color: 'text.secondary' }}>{a.content.substring(0, 80)}...</Typography>}
                  />
                </ListItem>
              ))}
              {announcements.length === 0 && <Typography color="text.secondary">No announcements yet.</Typography>}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontSize: { xs: '1.125rem', md: '1.25rem' } }}>Quick Actions</Typography>
            <Grid container spacing={2}>
              {[
                { label: 'View Courses', path: '/courses', color: '#60a5fa' },
                { label: 'Check Grades', path: '/grades', color: '#38bdf8' },
                { label: 'Request Document', path: '/documents', color: '#fbbf24' },
                { label: 'View Profile', path: '/profile', color: '#34d399' },
              ].map((action) => (
                <Grid item xs={12} sm={6} key={action.label}>
                  <Card sx={{ p: 2, cursor: 'pointer', '&:hover': { bgcolor: action.color + '08', transform: 'translateY(-2px)' } }} onClick={() => navigate(action.path)}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: action.color }}>{action.label}</Typography>
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

export default Dashboard;
