import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  AppBar, Toolbar, Typography, Button, Box, Container, Grid, Card, CardContent,
  Stack, Paper, Chip, Fade, Slide, Avatar
} from '@mui/material';
import { School, Speed, Security, CloudDone, Assessment, Groups, AppShortcut, Verified } from '@mui/icons-material';

const LandingPage = () => {
  const { user } = useAuth();

  const features = [
    { icon: <Speed sx={{ fontSize: 40, color: '#0f4c81' }} />, title: 'Online Registration', desc: 'Instant course registration with real-time prerequisite validation and automated scheduling.' },
    { icon: <Security sx={{ fontSize: 40, color: '#27ae60' }} />, title: 'Secure Records', desc: 'Role-based access control with encrypted credentials and comprehensive audit trails.' },
    { icon: <CloudDone sx={{ fontSize: 40, color: '#2980b9' }} />, title: 'Grade Management', desc: 'Instructors submit grades through secure portals with registrar approval workflows.' },
    { icon: <Verified sx={{ fontSize: 40, color: '#c0392b' }} />, title: 'Document Requests', desc: 'Request transcripts, certificates, and clearance letters with real-time status tracking.' },
    { icon: <Assessment sx={{ fontSize: 40, color: '#8e44ad' }} />, title: 'Analytics Dashboard', desc: 'Interactive charts and reports for enrollment trends, performance metrics, and planning.' },
    { icon: <Groups sx={{ fontSize: 40, color: '#d35400' }} />, title: 'Multi-Role Access', desc: 'Tailored dashboards for Students, Instructors, Registrars, Admins, and Department Heads.' },
  ];

  return (
    <Box sx={{ overflow: 'hidden' }}>
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'transparent', color: '#1a2a3a', py: 1 }}>
        <Toolbar sx={{ maxWidth: 1280, mx: 'auto', width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ bgcolor: '#0f4c81', width: 40, height: 40, fontWeight: 800 }}>R</Avatar>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f4c81', letterSpacing: '-0.02em' }}>RMS</Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          {user ? (
            <Button variant="contained" component={Link} to="/dashboard" sx={{ borderRadius: 3, px: 3, boxShadow: '0 4px 12px rgba(15,76,129,0.3)' }}>Dashboard</Button>
          ) : (
            <Stack direction="row" spacing={2}>
              <Button component={Link} to="/login" sx={{ color: '#5a6a7a', textTransform: 'none', fontWeight: 600 }}>Sign In</Button>
              <Button component={Link} to="/register" variant="contained" sx={{ borderRadius: 3, px: 3, boxShadow: '0 4px 12px rgba(15,76,129,0.3)' }}>Get Started</Button>
            </Stack>
          )}
        </Toolbar>
      </AppBar>

      {/* Hero */}
      <Box sx={{
        background: 'linear-gradient(135deg, #0f4c81 0%, #1a5276 40%, #2980b9 100%)',
        color: 'white', py: { xs: 8, md: 14 }, position: 'relative', overflow: 'hidden'
      }}>
        <Box sx={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.04)', filter: 'blur(60px)' }} />
        <Box sx={{ position: 'absolute', bottom: -80, left: -80, width: 300, height: 300, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.06)', filter: 'blur(50px)' }} />
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <Fade in timeout={800}>
            <Box>
              <Chip label="Addis Ababa University" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'white', mb: 3, fontWeight: 500, backdropFilter: 'blur(4px)' }} />
              <Typography variant="h2" sx={{ fontWeight: 800, mb: 2, lineHeight: 1.15, letterSpacing: '-0.03em', fontSize: { xs: '2.2rem', md: '3.5rem' } }}>
                Registrar Management System
              </Typography>
              <Typography variant="h6" sx={{ mb: 5, opacity: 0.85, fontWeight: 400, maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}>
                A modern web-based digital solution designed to automate registrar operations, streamline academic records, and enhance the teaching-learning experience for private campuses and polytechnic colleges across Ethiopia.
              </Typography>
              <Stack direction="row" spacing={2} justifyContent="center">
                <Button variant="contained" size="large" sx={{ bgcolor: 'white', color: '#0f4c81', fontWeight: 700, borderRadius: 3, px: 4, py: 1.5, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', '&:hover': { bgcolor: '#f0f4f8' } }} component={Link} to="/register">
                  Get Started
                </Button>
                <Button variant="outlined" size="large" sx={{ borderColor: 'rgba(255,255,255,0.5)', color: 'white', fontWeight: 600, borderRadius: 3, px: 4, py: 1.5, '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }} component={Link} to="/login">
                  Sign In
                </Button>
              </Stack>
              <Box sx={{ mt: 5, display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap' }}>
                {['Unity University', 'St. Mary\'s', 'Wingate Polytechnic', 'Entoto Polytechnic'].map(tag => (
                  <Chip key={tag} label={tag} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.12)', color: 'white', fontWeight: 500, backdropFilter: 'blur(4px)' }} />
                ))}
              </Box>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Stats strip */}
      <Box sx={{ bgcolor: '#fff', py: 4, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            {[
              { num: '5', label: 'User Roles' },
              { num: '30+', label: 'Demo Students' },
              { num: '12', label: 'Courses' },
              { num: '24/7', label: 'Availability' },
            ].map((s, i) => (
              <Grid item xs={6} md={3} key={i} sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 800, color: '#0f4c81', mb: 0.5 }}>{s.num}</Typography>
                <Typography variant="body2" sx={{ color: '#5a6a7a', fontWeight: 500 }}>{s.label}</Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="overline" sx={{ color: '#2980b9', fontWeight: 700, letterSpacing: '0.15em' }}>FEATURES</Typography>
          <Typography variant="h3" sx={{ fontWeight: 800, color: '#1a2a3a', mt: 1 }}>Everything You Need</Typography>
          <Typography variant="body1" sx={{ color: '#5a6a7a', mt: 1.5, maxWidth: 500, mx: 'auto' }}>
            A comprehensive suite of tools to manage academic records, grades, documents, and communication.
          </Typography>
        </Box>
        <Grid container spacing={3}>
          {features.map((f, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Slide in direction="up" timeout={600 + i * 100}>
                <Card sx={{ height: '100%', p: 1, '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 12px 40px rgba(0,0,0,0.10)' } }}>
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <Box sx={{ mb: 2, display: 'inline-flex', p: 2, borderRadius: 3, bgcolor: 'rgba(15,76,129,0.06)' }}>{f.icon}</Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#1a2a3a' }}>{f.title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>{f.desc}</Typography>
                  </CardContent>
                </Card>
              </Slide>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Roles section */}
      <Box sx={{ bgcolor: '#f0f4f8', py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="overline" sx={{ color: '#2980b9', fontWeight: 700, letterSpacing: '0.15em' }}>ROLES</Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#1a2a3a', mt: 1 }}>Built for Everyone</Typography>
          </Box>
          <Grid container spacing={3}>
            {[
              { role: 'Student', color: '#27ae60', desc: 'Register courses, view grades, request documents, and track academic progress.' },
              { role: 'Instructor', color: '#2980b9', desc: 'Submit grades online, view assigned courses, and manage course materials.' },
              { role: 'Registrar', color: '#8e44ad', desc: 'Manage student records, verify grades, process documents, and generate reports.' },
              { role: 'Department Head', color: '#d35400', desc: 'Monitor departmental performance, assign instructors, and plan academics.' },
              { role: 'Administrator', color: '#c0392b', desc: 'Configure users, manage access permissions, and oversee system operations.' },
            ].map((r, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Card sx={{ height: '100%', borderLeft: `4px solid ${r.color}`, '&:hover': { boxShadow: '0 8px 32px rgba(0,0,0,0.08)' } }}>
                  <CardContent sx={{ py: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: r.color, mb: 1 }}>{r.role}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>{r.desc}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA */}
      <Box sx={{ py: { xs: 6, md: 10 }, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ fontWeight: 800, color: '#1a2a3a', mb: 2 }}>Ready to modernize your registrar office?</Typography>
          <Typography variant="body1" sx={{ color: '#5a6a7a', mb: 4, maxWidth: 500, mx: 'auto' }}>
            Join the digital transformation. No paperwork, no queues, just efficient academic management.
          </Typography>
          <Button variant="contained" size="large" component={Link} to="/register" sx={{ borderRadius: 3, px: 5, py: 1.5, fontWeight: 700, boxShadow: '0 8px 24px rgba(15,76,129,0.3)' }}>
            Create Free Account
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Paper sx={{ bgcolor: '#0f2b47', color: 'white', py: 4, borderRadius: 0, textAlign: 'center' }}>
        <Container maxWidth="lg">
          <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
            &copy; {new Date().getFullYear()} Registrar Management System
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.6, display: 'block' }}>
            Addis Ababa University | College of Natural & Computational Sciences | Dept. of Computer Science
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.6, display: 'block', mt: 0.5 }}>
            Group: Elham Namus &bull; Selamawit Shumbet &bull; Yordanos Zerihun | Advisor: Mr. Ashenafi
          </Typography>
        </Container>
      </Paper>
    </Box>
  );
};

export default LandingPage;
