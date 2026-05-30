import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  Box, Typography, Paper, Grid, CircularProgress, Fade, Button, Avatar, Card, CardContent, Divider,
  Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton
} from '@mui/material';
import { Assessment, School, Group, Description, CheckCircle, TrendingUp, Download, PictureAsPdf } from '@mui/icons-material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area } from 'recharts';

const COLORS = ['#0f4c81', '#27ae60', '#f39c12', '#c0392b', '#8e44ad', '#2980b9'];

const Reports = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [stats, setStats] = useState(null);
  const [enrollmentByDept, setEnrollmentByDept] = useState({});
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [courses, setCourses] = useState([]);
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const reportRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sRes, eRes, stRes, gRes, cRes, dRes] = await Promise.all([
          axios.get('/api/reports/stats'),
          axios.get('/api/reports/enrollment-by-dept'),
          axios.get('/api/students'),
          axios.get('/api/grades'),
          axios.get('/api/courses'),
          axios.get('/api/documents'),
        ]);
        setStats(sRes.data);
        setEnrollmentByDept(eRes.data);
        setStudents(stRes.data);
        setGrades(gRes.data);
        setCourses(cRes.data);
        setDocs(dRes.data);
      } catch (err) { console.error(err); enqueueSnackbar('Failed to load report data', { variant: 'error' }); }
      setLoading(false);
    };
    fetchData();
  }, []);

  const generateEnrollmentPDF = () => {
    const doc = new jsPDF({ orientation: 'landscape' });
    doc.setFontSize(20);
    doc.setTextColor(15, 76, 129);
    doc.text('Student Enrollment Report', 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(90, 106, 122);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
    doc.text(`Institution: Addis Ababa University`, 14, 37);
    doc.text(`Total Students: ${stats?.totalStudents || 0}`, 14, 44);

    const activeCount = students.filter(s => s.status === 'active').length;
    const graduatedCount = students.filter(s => s.status === 'graduated').length;

    autoTable(doc, {
      startY: 52,
      head: [['Status', 'Count', 'Percentage']],
      body: [
        ['Active Students', activeCount, `${((activeCount / students.length) * 100).toFixed(1)}%`],
        ['Graduated', graduatedCount, `${((graduatedCount / students.length) * 100).toFixed(1)}%`],
        ['Suspended', students.filter(s => s.status === 'suspended').length, '-'],
        ['Withdrawn', students.filter(s => s.status === 'withdrawn').length, '-'],
      ],
      theme: 'grid',
      headStyles: { fillColor: [15, 76, 129], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 248, 252] },
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [['Student ID', 'Name', 'Program', 'Year', 'Semester', 'GPA', 'Status']],
      body: students.map(s => [
        s.studentId, s.user?.name || '-', s.program, `Year ${s.year}`, `Sem ${s.semester}`,
        s.gpa?.toFixed(2) || '-', s.status?.toUpperCase() || '-'
      ]),
      theme: 'grid',
      headStyles: { fillColor: [15, 76, 129], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 248, 252] },
      styles: { fontSize: 9, cellPadding: 2 },
    });

    doc.save('Student_Enrollment_Report.pdf');
    enqueueSnackbar('Enrollment report downloaded!', { variant: 'success' });
  };

  const generateGradePDF = () => {
    const doc = new jsPDF({ orientation: 'landscape' });
    doc.setFontSize(20);
    doc.setTextColor(15, 76, 129);
    doc.text('Academic Grade Report', 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(90, 106, 122);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
    doc.text(`Total Grade Records: ${grades.length}`, 14, 37);

    autoTable(doc, {
      startY: 45,
      head: [['Student', 'Student ID', 'Course', 'Midterm', 'Assignment', 'Final', 'Total', 'Grade', 'Status']],
      body: grades.map(g => [
        g.student?.user?.name || '-', g.student?.studentId || '-',
        `${g.course?.courseCode || '-'} - ${g.course?.title || '-'}`,
        g.marks?.midterm, g.marks?.assignment, g.marks?.final, g.marks?.total,
        g.grade, g.status?.toUpperCase()
      ]),
      theme: 'grid',
      headStyles: { fillColor: [15, 76, 129], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 248, 252] },
      styles: { fontSize: 9, cellPadding: 2 },
    });

    doc.save('Academic_Grade_Report.pdf');
    enqueueSnackbar('Grade report downloaded!', { variant: 'success' });
  };

  const generateDocumentPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(15, 76, 129);
    doc.text('Document Processing Report', 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(90, 106, 122);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
    doc.text(`Total Requests: ${docs.length}`, 14, 37);

    const statusCounts = { pending: 0, processing: 0, ready: 0, delivered: 0 };
    docs.forEach(d => { if (statusCounts[d.status] !== undefined) statusCounts[d.status]++; });

    autoTable(doc, {
      startY: 45,
      head: [['Status', 'Count']],
      body: Object.entries(statusCounts).map(([k, v]) => [k.toUpperCase(), v]),
      theme: 'grid',
      headStyles: { fillColor: [15, 76, 129], textColor: 255, fontStyle: 'bold' },
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [['Student', 'Type', 'Purpose', 'Status', 'Requested Date']],
      body: docs.map(d => [
        d.student?.user?.name || '-', d.type?.replace('_', ' ').toUpperCase() || '-',
        d.purpose || '-', d.status?.toUpperCase() || '-',
        new Date(d.requestedAt).toLocaleDateString('en-GB')
      ]),
      theme: 'grid',
      headStyles: { fillColor: [15, 76, 129], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 248, 252] },
      styles: { fontSize: 9, cellPadding: 2 },
    });

    doc.save('Document_Processing_Report.pdf');
    enqueueSnackbar('Document report downloaded!', { variant: 'success' });
  };

  const generateCoursePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(15, 76, 129);
    doc.text('Course Catalog Report', 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(90, 106, 122);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
    doc.text(`Total Courses: ${courses.length}`, 14, 37);

    autoTable(doc, {
      startY: 45,
      head: [['Code', 'Title', 'Credits', 'Department', 'Year', 'Semester', 'Instructor']],
      body: courses.map(c => [
        c.courseCode, c.title, c.credits, c.department, `Year ${c.year}`, c.semester,
        c.instructor?.name || 'Not Assigned'
      ]),
      theme: 'grid',
      headStyles: { fillColor: [15, 76, 129], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 248, 252] },
      styles: { fontSize: 9, cellPadding: 2 },
    });

    doc.save('Course_Catalog_Report.pdf');
    enqueueSnackbar('Course report downloaded!', { variant: 'success' });
  };

  const generateFullReportPDF = () => {
    const doc = new jsPDF({ orientation: 'landscape' });
    doc.setFontSize(22);
    doc.setTextColor(15, 76, 129);
    doc.text('Registrar Management System - Comprehensive Report', 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(90, 106, 122);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
    doc.text('Institution: Addis Ababa University, Department of Computer Science', 14, 37);

    // Executive Summary
    autoTable(doc, {
      startY: 45,
      head: [['Metric', 'Value']],
      body: [
        ['Total Students', stats?.totalStudents || 0],
        ['Active Courses', stats?.totalCourses || 0],
        ['Total Enrollments', stats?.totalEnrollments || 0],
        ['Pending Documents', stats?.pendingDocs || 0],
        ['Active Students', stats?.activeStudents || 0],
        ['Graduated Students', stats?.graduatedStudents || 0],
        ['Total Grades Recorded', grades.length],
        ['Document Requests', docs.length],
      ],
      theme: 'grid',
      headStyles: { fillColor: [15, 76, 129], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 248, 252] },
    });

    // Top Students by GPA
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [['Rank', 'Student ID', 'Name', 'Program', 'GPA', 'Status']],
      body: [...students].sort((a, b) => (b.gpa || 0) - (a.gpa || 0)).slice(0, 10).map((s, i) => [
        i + 1, s.studentId, s.user?.name || '-', s.program, s.gpa?.toFixed(2) || '-', s.status?.toUpperCase()
      ]),
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 248, 252] },
      styles: { fontSize: 9, cellPadding: 2 },
    });

    // Course Summary
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [['Course Code', 'Title', 'Credits', 'Department', 'Instructor']],
      body: courses.map(c => [c.courseCode, c.title, c.credits, c.department, c.instructor?.name || '-']),
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 248, 252] },
      styles: { fontSize: 9, cellPadding: 2 },
    });

    doc.save('RMS_Comprehensive_Report.pdf');
    enqueueSnackbar('Comprehensive report downloaded!', { variant: 'success' });
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress size={48} sx={{ color: '#0f4c81' }} /></Box>;

  const pieData = stats ? [
    { name: 'Active', value: stats.activeStudents },
    { name: 'Graduated', value: stats.graduatedStudents },
    { name: 'Other', value: Math.max(0, stats.totalStudents - stats.activeStudents - stats.graduatedStudents) },
  ] : [];

  const barData = Object.keys(enrollmentByDept).map(k => ({ name: k.split(' ').slice(0, 2).join(' '), value: enrollmentByDept[k] }));

  const reportCards = [
    { title: 'Student Enrollment Report', desc: 'Complete list of all students with their programs, GPA, and status.', icon: <Group sx={{ fontSize: 32, color: '#0f4c81' }} />, color: '#e8f0fe', action: generateEnrollmentPDF },
    { title: 'Academic Grade Report', desc: 'All submitted and approved grades with student and course details.', icon: <Assessment sx={{ fontSize: 32, color: '#27ae60' }} />, color: '#e8f5e9', action: generateGradePDF },
    { title: 'Document Processing Report', desc: 'Document request status, processing times, and delivery tracking.', icon: <Description sx={{ fontSize: 32, color: '#f39c12' }} />, color: '#fff8e1', action: generateDocumentPDF },
    { title: 'Course Catalog Report', desc: 'Full course listing with instructors, credits, and department info.', icon: <School sx={{ fontSize: 32, color: '#2980b9' }} />, color: '#e0f2fe', action: generateCoursePDF },
    { title: 'Comprehensive Report', desc: 'Executive summary combining enrollment, grades, courses, and analytics.', icon: <PictureAsPdf sx={{ fontSize: 32, color: '#c0392b' }} />, color: '#ffebee', action: generateFullReportPDF },
  ];

  return (
    <Fade in timeout={400}>
      <Box ref={reportRef}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#1a2a3a', fontSize: { xs: '1.5rem', md: '2.125rem' } }}>Reports & Analytics</Typography>
          <Typography variant="body2" color="text.secondary">Generate and download institutional reports</Typography>
        </Box>

        {/* Stat Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            { title: 'Total Students', value: stats?.totalStudents || 0, icon: <Group sx={{ fontSize: 32, color: '#0f4c81' }} />, color: '#e8f0fe' },
            { title: 'Active Courses', value: stats?.totalCourses || 0, icon: <School sx={{ fontSize: 32, color: '#2980b9' }} />, color: '#e0f2fe' },
            { title: 'Total Enrollments', value: stats?.totalEnrollments || 0, icon: <TrendingUp sx={{ fontSize: 32, color: '#27ae60' }} />, color: '#e8f5e9' },
            { title: 'Pending Documents', value: stats?.pendingDocs || 0, icon: <Description sx={{ fontSize: 32, color: '#f39c12' }} />, color: '#fff8e1' },
          ].map((card, i) => (
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

        {/* Downloadable Reports */}
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#1a2a3a', mb: 3, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>Downloadable Reports</Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {reportCards.map((r, i) => (
            <Grid item xs={12} md={6} key={i}>
              <Card sx={{
                height: '100%', p: 1, borderRadius: 4,
                '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 40px rgba(0,0,0,0.10)' },
                transition: 'all 0.3s ease',
              }}>
                <CardContent sx={{ py: 3, display: 'flex', alignItems: 'flex-start', gap: 2.5 }}>
                  <Avatar sx={{ bgcolor: r.color, color: r.icon.props.sx.color, width: 56, height: 56, flexShrink: 0 }}>{r.icon}</Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a2a3a', mb: 0.5 }}>{r.title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, mb: 2 }}>{r.desc}</Typography>
                    <Button variant="contained" size="small" startIcon={<Download />} onClick={r.action}
                      sx={{ borderRadius: 2.5, textTransform: 'none', fontWeight: 600, bgcolor: '#0f4c81', '&:hover': { bgcolor: '#0a3560' } }}>
                      Download PDF
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Charts */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: { xs: 300, md: 380 }, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#1a2a3a', fontSize: { xs: '1.125rem', md: '1.25rem' } }}>Student Distribution</Typography>
              <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
                      {pieData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                {pieData.map((entry, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: COLORS[index] }} />
                    <Typography variant="caption" sx={{ color: '#5a6a7a' }}>{entry.name}</Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, height: { xs: 300, md: 380 } }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#1a2a3a', fontSize: { xs: '1.125rem', md: '1.25rem' } }}>Grade Distribution</Typography>
              <ResponsiveContainer width="100%" height="85%">
                <BarChart data={[
                  { grade: 'A+', count: grades.filter(g => g.grade === 'A+').length },
                  { grade: 'A', count: grades.filter(g => g.grade === 'A').length },
                  { grade: 'A-', count: grades.filter(g => g.grade === 'A-').length },
                  { grade: 'B+', count: grades.filter(g => g.grade === 'B+').length },
                  { grade: 'B', count: grades.filter(g => g.grade === 'B').length },
                  { grade: 'B-', count: grades.filter(g => g.grade === 'B-').length },
                  { grade: 'C+', count: grades.filter(g => g.grade === 'C+').length },
                  { grade: 'C', count: grades.filter(g => g.grade === 'C').length },
                  { grade: 'D', count: grades.filter(g => g.grade === 'D').length },
                  { grade: 'F', count: grades.filter(g => g.grade === 'F').length },
                ]}>
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
            <Paper sx={{ p: 3, height: { xs: 300, md: 340 } }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#1a2a3a', fontSize: { xs: '1.125rem', md: '1.25rem' } }}>Enrollments by Department</Typography>
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
            <Paper sx={{ p: 3, height: { xs: 300, md: 340 } }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#1a2a3a', fontSize: { xs: '1.125rem', md: '1.25rem' } }}>Monthly System Activity</Typography>
              <ResponsiveContainer width="100%" height="85%">
                <AreaChart data={[
                  { month: 'Jan', activity: 120 }, { month: 'Feb', activity: 180 }, { month: 'Mar', activity: 240 },
                  { month: 'Apr', activity: 200 }, { month: 'May', activity: 320 }, { month: 'Jun', activity: 400 },
                ]}>
                  <defs>
                    <linearGradient id="colorAct" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#27ae60" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#27ae60" stopOpacity={0} />
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
