import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  AppBar, Toolbar, Typography, Button, Box, Container, Grid, Card, CardContent,
  Stack, Paper, Chip, Fade, Slide, Zoom, keyframes, Avatar, Divider
} from '@mui/material';
import {
  School, Speed, Security, CloudDone, Assessment, Groups,
  ArrowForward, Star, TrendingUp, Verified, Public, Email, Phone
} from '@mui/icons-material';

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
`;
const floatSlow = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(3deg); }
`;
const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.1); opacity: 1; }
`;
const gradientMove = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;
const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;
const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;
const slideUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;
const scrollReveal = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const AnimatedSection = ({ children, delay = 0 }) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <Box ref={ref} sx={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(40px)',
      transition: `all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms`,
    }}>
      {children}
    </Box>
  );
};

const ParticleBackground = () => (
  <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
    {Array.from({ length: 20 }).map((_, i) => (
      <Box key={i} sx={{
        position: 'absolute',
        width: Math.random() * 6 + 2,
        height: Math.random() * 6 + 2,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.3)',
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animation: `${float} ${3 + Math.random() * 4}s ease-in-out infinite`,
        animationDelay: `${Math.random() * 2}s`,
      }} />
    ))}
  </Box>
);

const LandingPage = () => {
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    { icon: <Speed sx={{ fontSize: 44 }} />, title: 'Online Registration', desc: 'Instant course registration with real-time prerequisite validation and automated scheduling.', color: '#0f4c81', bg: '#e8f0fe' },
    { icon: <Security sx={{ fontSize: 44 }} />, title: 'Secure Records', desc: 'Role-based access control with encrypted credentials and comprehensive audit trails.', color: '#27ae60', bg: '#e8f5e9' },
    { icon: <CloudDone sx={{ fontSize: 44 }} />, title: 'Grade Management', desc: 'Instructors submit grades through secure portals with registrar approval workflows.', color: '#2980b9', bg: '#e0f2fe' },
    { icon: <Verified sx={{ fontSize: 44 }} />, title: 'Document Requests', desc: 'Request transcripts, certificates, and clearance letters with real-time status tracking.', color: '#c0392b', bg: '#ffebee' },
    { icon: <Assessment sx={{ fontSize: 44 }} />, title: 'Analytics Dashboard', desc: 'Interactive charts and reports for enrollment trends, performance metrics, and planning.', color: '#8e44ad', bg: '#f3e5f5' },
    { icon: <Groups sx={{ fontSize: 44 }} />, title: 'Multi-Role Access', desc: 'Tailored dashboards for Students, Instructors, Registrars, Admins, and Department Heads.', color: '#d35400', bg: '#fff8e1' },
  ];

  const stats = [
    { num: '5', label: 'User Roles', icon: <Groups sx={{ fontSize: 28 }} /> },
    { num: '30+', label: 'Demo Students', icon: <School sx={{ fontSize: 28 }} /> },
    { num: '12', label: 'Courses', icon: <CloudDone sx={{ fontSize: 28 }} /> },
    { num: '24/7', label: 'Availability', icon: <Speed sx={{ fontSize: 28 }} /> },
  ];

  const testimonials = [
    { name: 'Elham Namus', role: 'Student', text: 'The RMS made my final year so much easier. I can request my transcript in seconds instead of waiting in line for hours.', avatar: 'EN' },
    { name: 'Mr. Ashenafi Tadesse', role: 'Instructor', text: 'Submitting grades online has reduced my workload tremendously. The approval workflow keeps everything organized.', avatar: 'AT' },
    { name: 'Ato Mekonnen Kebede', role: 'Registrar', text: 'We went from stacks of paper to a completely digital system. Processing documents now takes minutes instead of days.', avatar: 'MK' },
  ];

  return (
    <Box sx={{ overflow: 'hidden', position: 'relative' }}>
      {/* Navbar */}
      <AppBar position="fixed" elevation={scrolled ? 2 : 0} sx={{
        bgcolor: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        transition: 'all 0.4s ease',
        color: scrolled ? '#1a2a3a' : 'white',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : 'none',
      }}>
        <Toolbar sx={{ maxWidth: 1280, mx: 'auto', width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ bgcolor: '#0f4c81', width: 40, height: 40, fontWeight: 800, fontSize: 16, boxShadow: '0 4px 12px rgba(15,76,129,0.3)' }}>R</Avatar>
            <Typography variant="h6" sx={{ fontWeight: 800, color: scrolled ? '#0f4c81' : 'white', letterSpacing: '-0.02em' }}>RMS</Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          {user ? (
            <Button variant="contained" component={Link} to="/dashboard" sx={{ borderRadius: 3, px: 3, boxShadow: '0 4px 12px rgba(15,76,129,0.3)', textTransform: 'none', fontWeight: 600 }}>Dashboard</Button>
          ) : (
            <Stack direction="row" spacing={2}>
              <Button component={Link} to="/login" sx={{ color: scrolled ? '#5a6a7a' : 'white', textTransform: 'none', fontWeight: 600 }}>Sign In</Button>
              <Button component={Link} to="/login" variant="contained" sx={{ borderRadius: 3, px: 3, boxShadow: '0 4px 12px rgba(15,76,129,0.3)', textTransform: 'none', fontWeight: 600 }}>Get Started</Button>
            </Stack>
          )}
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box sx={{
        background: 'linear-gradient(135deg, #0f4c81 0%, #1a5276 30%, #2980b9 70%, #27ae60 100%)',
        color: 'white', py: { xs: 14, md: 20 }, position: 'relative', overflow: 'hidden',
        backgroundSize: '400% 400%', animation: `${gradientMove} 15s ease infinite`,
      }}>
        <ParticleBackground />
        <Box sx={{ position: 'absolute', top: '10%', right: '10%', width: 300, height: 300, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.03)', filter: 'blur(80px)', animation: `${floatSlow} 8s ease-in-out infinite` }} />
        <Box sx={{ position: 'absolute', bottom: '5%', left: '5%', width: 250, height: 250, borderRadius: '50%', bgcolor: 'rgba(39,174,96,0.08)', filter: 'blur(60px)', animation: `${floatSlow} 10s ease-in-out infinite reverse` }} />
        <Box sx={{ position: 'absolute', top: '20%', left: '15%', width: 80, height: 80, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.1)', animation: `${rotate} 20s linear infinite` }} />

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <Fade in timeout={1000}>
            <Box>
              <Chip label="Addis Ababa University" size="small" sx={{
                bgcolor: 'rgba(255,255,255,0.15)', color: 'white', mb: 3, fontWeight: 600,
                backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)',
                px: 1.5, py: 0.5, animation: `${slideUp} 0.8s ease forwards`,
              }} />
              <Typography variant="h2" sx={{
                fontWeight: 900, mb: 3, lineHeight: 1.1, letterSpacing: '-0.03em',
                fontSize: { xs: '2.5rem', md: '4rem' },
                background: 'linear-gradient(90deg, #ffffff, #a8d8ff, #ffffff)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: `${shimmer} 5s linear infinite`,
              }}>
                Registrar Management System
              </Typography>
              <Typography variant="h6" sx={{
                mb: 5, opacity: 0.9, fontWeight: 400, maxWidth: 650, mx: 'auto',
                lineHeight: 1.6, fontSize: { xs: '1rem', md: '1.25rem' },
              }}>
                A modern web-based digital solution designed to automate registrar operations,
                streamline academic records, and enhance the teaching-learning experience
                for private campuses and polytechnic colleges across Ethiopia.
              </Typography>
              <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 5 }}>
                <Button variant="contained" size="large" component={Link} to="/login" sx={{
                  bgcolor: 'white', color: '#0f4c81', fontWeight: 800, borderRadius: 3,
                  px: 5, py: 1.5, boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                  '&:hover': { bgcolor: '#f0f4f8', transform: 'translateY(-2px)' },
                  transition: 'all 0.3s ease', textTransform: 'none',
                }}>
                  Get Started <ArrowForward sx={{ ml: 1, fontSize: 20 }} />
                </Button>
                <Button variant="outlined" size="large" component={Link} to="/login" sx={{
                  borderColor: 'rgba(255,255,255,0.5)', color: 'white', fontWeight: 600,
                  borderRadius: 3, px: 4, py: 1.5, textTransform: 'none',
                  '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
                }}>
                  Sign In
                </Button>
              </Stack>
              <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap' }}>
                {['Unity University', "St. Mary's", 'Wingate Polytechnic', 'Entoto Polytechnic'].map(tag => (
                  <Chip key={tag} label={tag} size="small" sx={{
                    bgcolor: 'rgba(255,255,255,0.12)', color: 'white', fontWeight: 500,
                    backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.15)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.2)', transform: 'translateY(-2px)', transition: '0.3s' },
                  }} />
                ))}
              </Box>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Stats strip with counter animation */}
      <Box sx={{ bgcolor: '#fff', py: 5, borderBottom: '1px solid rgba(0,0,0,0.06)', position: 'relative' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            {stats.map((s, i) => (
              <Grid item xs={6} md={3} key={i}>
                <AnimatedSection delay={i * 150}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Avatar sx={{ bgcolor: '#0f4c8108', color: '#0f4c81', width: 56, height: 56, mx: 'auto', mb: 1.5 }}>{s.icon}</Avatar>
                    <Typography variant="h3" sx={{ fontWeight: 900, color: '#0f4c81', mb: 0.5 }}>{s.num}</Typography>
                    <Typography variant="body2" sx={{ color: '#5a6a7a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</Typography>
                  </Box>
                </AnimatedSection>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <AnimatedSection>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="overline" sx={{ color: '#2980b9', fontWeight: 800, letterSpacing: '0.2em', display: 'block', mb: 1 }}>FEATURES</Typography>
            <Typography variant="h3" sx={{ fontWeight: 900, color: '#1a2a3a', mb: 2 }}>Everything You Need</Typography>
            <Typography variant="body1" sx={{ color: '#5a6a7a', maxWidth: 550, mx: 'auto', lineHeight: 1.7 }}>
              A comprehensive suite of tools to manage academic records, grades, documents, and communication.
            </Typography>
          </Box>
        </AnimatedSection>
        <Grid container spacing={3}>
          {features.map((f, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <AnimatedSection delay={i * 100}>
                <Card sx={{
                  height: '100%', p: 1, borderRadius: 4,
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 48px rgba(0,0,0,0.12)',
                    borderColor: f.color + '30',
                  },
                  transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  border: '1px solid rgba(0,0,0,0.04)',
                  cursor: 'default',
                }}>
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <Box sx={{
                      mb: 2.5, display: 'inline-flex', p: 2.5, borderRadius: 3,
                      bgcolor: f.bg, color: f.color,
                      animation: `${float} 3s ease-in-out ${i * 0.3}s infinite`,
                    }}>{f.icon}</Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5, color: '#1a2a3a' }}>{f.title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>{f.desc}</Typography>
                  </CardContent>
                </Card>
              </AnimatedSection>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Roles Section */}
      <Box sx={{ bgcolor: '#f0f4f8', py: { xs: 8, md: 12 }, position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', bgcolor: 'rgba(15,76,129,0.03)', filter: 'blur(80px)' }} />
        <Container maxWidth="lg">
          <AnimatedSection>
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography variant="overline" sx={{ color: '#2980b9', fontWeight: 800, letterSpacing: '0.2em' }}>ROLES</Typography>
              <Typography variant="h3" sx={{ fontWeight: 900, color: '#1a2a3a', mt: 1 }}>Built for Everyone</Typography>
            </Box>
          </AnimatedSection>
          <Grid container spacing={3} justifyContent="center">
            {[
              { role: 'Student', color: '#27ae60', desc: 'Register courses, view grades, request documents, and track academic progress.' },
              { role: 'Instructor', color: '#2980b9', desc: 'Submit grades online, view assigned courses, and manage course materials.' },
              { role: 'Registrar', color: '#8e44ad', desc: 'Manage student records, verify grades, process documents, and generate reports.' },
              { role: 'Department Head', color: '#d35400', desc: 'Monitor departmental performance, assign instructors, and plan academics.' },
              { role: 'Administrator', color: '#c0392b', desc: 'Configure users, manage access permissions, and oversee system operations.' },
            ].map((r, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <AnimatedSection delay={i * 120}>
                  <Card sx={{
                    height: '100%', borderLeft: `5px solid ${r.color}`,
                    '&:hover': { boxShadow: '0 12px 40px rgba(0,0,0,0.10)', transform: 'translateX(4px)' },
                    transition: 'all 0.4s ease',
                  }}>
                    <CardContent sx={{ py: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                        <Avatar sx={{ bgcolor: r.color + '15', color: r.color, width: 44, height: 44, fontWeight: 800, fontSize: 18 }}>{r.role[0]}</Avatar>
                        <Typography variant="h6" sx={{ fontWeight: 800, color: r.color }}>{r.role}</Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>{r.desc}</Typography>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <AnimatedSection>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="overline" sx={{ color: '#2980b9', fontWeight: 800, letterSpacing: '0.2em' }}>TESTIMONIALS</Typography>
            <Typography variant="h3" sx={{ fontWeight: 900, color: '#1a2a3a', mt: 1 }}>What People Say</Typography>
          </Box>
        </AnimatedSection>
        <Grid container spacing={3}>
          {testimonials.map((t, i) => (
            <Grid item xs={12} md={4} key={i}>
              <AnimatedSection delay={i * 150}>
                <Card sx={{
                  height: '100%', p: 1, borderRadius: 4, position: 'relative',
                  '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 16px 48px rgba(0,0,0,0.10)' },
                  transition: 'all 0.4s ease',
                }}>
                  <Box sx={{ position: 'absolute', top: 16, right: 20, color: '#e2e8f0' }}><Star sx={{ fontSize: 40 }} /></Box>
                  <CardContent sx={{ py: 3 }}>
                    <Typography variant="body1" sx={{ color: '#5a6a7a', lineHeight: 1.8, mb: 3, fontStyle: 'italic' }}>"{t.text}"</Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ bgcolor: '#0f4c81', width: 40, height: 40, fontWeight: 700, fontSize: 14 }}>{t.avatar}</Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#1a2a3a' }}>{t.name}</Typography>
                        <Typography variant="caption" sx={{ color: '#2980b9', fontWeight: 600 }}>{t.role}</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </AnimatedSection>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{
        background: 'linear-gradient(135deg, #0f4c81 0%, #1a5276 50%, #2980b9 100%)',
        color: 'white', py: { xs: 8, md: 12 }, textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <Box sx={{ position: 'absolute', top: -50, left: -50, width: 200, height: 200, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.05)', filter: 'blur(40px)', animation: `${floatSlow} 7s ease-in-out infinite` }} />
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <AnimatedSection>
            <Typography variant="h3" sx={{ fontWeight: 900, mb: 2, letterSpacing: '-0.02em' }}>Ready to modernize your registrar office?</Typography>
            <Typography variant="body1" sx={{ opacity: 0.85, mb: 4, maxWidth: 550, mx: 'auto', lineHeight: 1.7 }}>
              Join the digital transformation. No paperwork, no queues, just efficient academic management.
            </Typography>
            <Button variant="contained" size="large" component={Link} to="/login" sx={{
              bgcolor: 'white', color: '#0f4c81', fontWeight: 800, borderRadius: 3, px: 6, py: 1.8,
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)', textTransform: 'none', fontSize: '1.1rem',
              '&:hover': { bgcolor: '#f0f4f8', transform: 'translateY(-3px)' }, transition: 'all 0.3s ease',
            }}>
              Sign In to RMS
            </Button>
          </AnimatedSection>
        </Container>
      </Box>

      {/* Footer */}
      <Paper sx={{ bgcolor: '#0a1f35', color: 'white', py: 6, borderRadius: 0, textAlign: 'center' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mb: 2 }}>
            <Avatar sx={{ bgcolor: '#0f4c81', width: 36, height: 36, fontWeight: 800, fontSize: 14 }}>R</Avatar>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>Registrar Management System</Typography>
          </Box>
          <Typography variant="body2" sx={{ opacity: 0.7, mb: 1 }}>Addis Ababa University | College of Natural & Computational Sciences | Dept. of Computer Science</Typography>
          <Typography variant="caption" sx={{ opacity: 0.5, display: 'block' }}>
            Group: Elham Namus &bull; Selamawit Shumbet &bull; Yordanos Zerihun | Advisor: Mr. Ashenafi
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
            <Email sx={{ opacity: 0.5, fontSize: 18 }} />
            <Phone sx={{ opacity: 0.5, fontSize: 18 }} />
            <Public sx={{ opacity: 0.5, fontSize: 18 }} />
          </Box>
          <Typography variant="caption" sx={{ opacity: 0.4, display: 'block', mt: 3 }}>
            &copy; {new Date().getFullYear()} RMS. All rights reserved.
          </Typography>
        </Container>
      </Paper>
    </Box>
  );
};

export default LandingPage;
