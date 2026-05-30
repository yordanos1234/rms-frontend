import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Typography, Paper, Grid, CircularProgress, Fade, Chip, Avatar, Card
} from '@mui/material';
import { Assessment, School, Group, Description, CheckCircle, TrendingUp } from '@mui/icons-material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area } from 'recharts';

const COLORS = ['#0f4c81', '#27ae60', '#f39c12', '#c0392b', '#8e44ad', '#2980b9'];

const Reports = () => {
  const [stats, setStats] = useState(null);
  const [enrollmentByDept, setEnrollmentByDept] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sRes, eRes] = await Promise.all([
          axios.get('/api/reports/stats'),
          axios.get('/api/reports/enrollment-by-dept')
        ]);
        setStats(sRes.data);
        setEnrollmentByDept(eRes.data);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress size={48} sx={{ color: '#0f4c81' }} /></Box>;

  const pieData = stats ? [
    { name: 'Active', value: stats.activeStudents },
    { name: 'Graduated', value: stats.graduatedStudents },
    { name: 'Other', value: Math.max(0, stats.totalStudents - stats.activeStudents - stats.graduatedStudents) },
  ] : [];

  const barData = Object.keys(enrollmentByDept).map(k => ({ name: k.split(' ').slice(0,2).join(' '), value: enrollmentByDept[k] }));

  const gradeDist = [
    { grade: 'A+', count: 12 }, { grade: 'A', count: 18 }, { grade: 'A-', count: 15 },
    { grade: 'B+', count: 22 }, { grade: 'B', count: 28 }, { grade: 'B-', count: 20 },
    { grade: 'C+', count: 14 }, { grade: 'C', count: 10 }, { grade: 'C-', count: 8 },
    { grade: 'D', count: 5 }, { grade: 'F', count: 3 },
  ];

  const statCards = [
    { title: 'Total Students', value: stats?.totalStudents || 0, icon: <Group sx={{ fontSize: 32, color: '#0f4c81' }} />, color: '#e8f0fe' },
    { title: 'Active Courses', value: stats?.totalCourses || 0, icon: <School sx={{ fontSize: 32, color: '#2980b9' }} />, color: '#e0f2fe' },
    { title: 'Total Enrollments', value: stats?.totalEnrollments || 0, icon: <TrendingUp sx={{ fontSize: 32, color: '#27ae60' }} />, color: '#e8f5e9' },
    { title: 'Pending Documents', value: stats?.pendingDocs || 0, icon: <Description sx={{ fontSize: 32, color: '#f39c12' }} />, color: '#fff8e1' },
  ];

  return (
    <Fade in timeout={400}>
      <Box>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#1a2a3a' }}>Reports & Analytics</Typography>
          <Typography variant="body2" color="text.secondary">Institutional performance metrics and insights</Typography>
        </Box>

        <Grid container spacing={3}>
          {statCards.map((card, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Card sx={{ bgcolor: card.color, p: 3, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: 'none' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#5a6a7a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.title}</Typography>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: '#1a2a3a', mt: 0.5 }}>{card.value}</Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.6)', width: 56, height: 56 }}>{card.icon}</Avatar>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: 380, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#1a2a3a' }}>Student Status</Typography>
              <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={5} dataKey="value">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                {pieData.map((entry, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: COLORS[index] }} />
                    <Typography variant="caption" sx={{ color: '#5a6a7a', fontWeight: 500 }}>{entry.name}</Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, height: 380 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#1a2a3a' }}>Grade Distribution</Typography>
              <ResponsiveContainer width="100%" height="85%">
                <BarChart data={gradeDist}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="grade" axisLine={false} tickLine={false} tick={{ fill: '#5a6a7a', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#5a6a7a', fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} cursor={{ fill: 'rgba(15,76,129,0.04)' }} />
                  <Bar dataKey="count" fill="#0f4c81" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: 340 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#1a2a3a' }}>Enrollments by Department</Typography>
              <ResponsiveContainer width="100%" height="85%">
                <BarChart data={barData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(0,0,0,0.05)" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#5a6a7a', fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#5a6a7a', fontSize: 11 }} width={100} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} cursor={{ fill: 'rgba(15,76,129,0.04)' }} />
                  <Bar dataKey="value" fill="#2980b9" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: 340 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#1a2a3a' }}>Monthly Activity</Typography>
              <ResponsiveContainer width="100%" height="85%">
                <AreaChart data={[
                  { month: 'Jan', activity: 120 }, { month: 'Feb', activity: 180 }, { month: 'Mar', activity: 240 },
                  { month: 'Apr', activity: 200 }, { month: 'May', activity: 320 }, { month: 'Jun', activity: 400 },
                ]}>
                  <defs>
                    <linearGradient id="colorAct" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#27ae60" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#27ae60" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#5a6a7a', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#5a6a7a', fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                  <Area type="monotone" dataKey="activity" stroke="#27ae60" strokeWidth={3} fillOpacity={1} fill="url(#colorAct)" />
                </AreaChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Fade>
  );
};

export default Reports;
