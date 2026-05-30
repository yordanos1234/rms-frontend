import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  AppBar, Toolbar, Typography, Button, Box, Container, Grid, Card, CardContent,
  Stack, Paper, Chip, keyframes, Avatar, Divider, useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  School, Speed, Security, CloudDone, Assessment, Groups,
  ArrowForward, Star, TrendingUp, Verified, Public, Email, Phone,
  CheckCircle, Menu, Close, KeyboardArrowDown
} from '@mui/icons-material';

/* ─────────────── Keyframes ─────────────── */
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
`;
const floatSlow = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(5deg); }
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
const pulseRing = keyframes`
  0% { transform: scale(0.8); opacity: 0.5; }
  100% { transform: scale(2.2); opacity: 0; }
`;
const slideUpFade = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;
const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
`;

/* ─────────────── Animated Section (scroll reveal) ─────────────── */
const AnimatedSection = ({ children, delay = 0 }) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.12 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <Box ref={ref} sx={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(50px)',
      transition: `opacity 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms, transform 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms`,
    }}>
      {children}
    </Box>
  );
};

/* ─────────────── Particle Field ─────────────── */
const ParticleField = () => (
  <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
    {Array.from({ length: 30 }).map((_, i) => {
      const size = Math.random() * 5 + 2;
      return (
        <Box key={i} sx={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: '50%',
          background: Math.random() > 0.5 ? 'rgba(255,255,255,0.35)' : 'rgba(168,216,255,0.25)',
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animation: `${float} ${3 + Math.random() * 5}s ease-in-out infinite`,
          animationDelay: `${Math.random() * 3}s`,
        }} />
      );
    })}
  </Box>
);

/* ─────────────── Glass Card Component ─────────────── */
const GlassCard = ({ children, sx = {}, hover = true }) => (
  <Box sx={{
    background: 'rgba(255,255,255,0.03)',
    backdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 3,
    transition: hover ? 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : undefined,
    ...(hover && {
      '&:hover': {
        background: 'rgba(255,255,255,0.06)',
        borderColor: 'rgba(255,255,255,0.15)',
        transform: 'translateY(-6px)',
        boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
      }
    }),
    ...sx,
  }}>
    {children}
  </Box>
);

/* ─────────────── Main Page ─────────────── */
const LandingPage = () => {
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    { icon: <Speed sx={{ fontSize: 36 }} />, title: 'Online Registration', desc: 'Instant course registration with real-time prerequisite validation and automated scheduling.', color: '#60a5fa', bg: 'rgba(96,165,250,0.08)' },
    { icon: <Security sx={{ fontSize: 36 }} />, title: 'Secure Records', desc: 'Role-based access control with encrypted credentials and comprehensive audit trails.', color: '#34d399', bg: 'rgba(52,211,153,0.08)' },
    { icon: <CloudDone sx={{ fontSize: 36 }} />, title: 'Grade Management', desc: 'Instructors submit grades through secure portals with registrar approval workflows.', color: '#38bdf8', bg: 'rgba(56,189,248,0.08)' },
    { icon: <Verified sx={{ fontSize: 36 }} />, title: 'Document Requests', desc: 'Request transcripts, certificates, and clearance letters with real-time status tracking.', color: '#f87171', bg: 'rgba(248,113,113,0.08)' },
    { icon: <Assessment sx={{ fontSize: 36 }} />, title: 'Analytics Dashboard', desc: 'Interactive charts and reports for enrollment trends, performance metrics, and planning.', color: '#a78bfa', bg: 'rgba(167,139,250,0.08)' },
    { icon: <Groups sx={{ fontSize: 36 }} />, title: 'Multi-Role Access', desc: 'Tailored dashboards for Students, Instructors, Registrars, Admins, and Department Heads.', color: '#fbbf24', bg: 'rgba(251,191,36,0.08)' },
  ];

  const stats = [
    { num: '5', suffix: '', label: 'User Roles', icon: <Groups sx={{ fontSize: 24 }} /> },
    { num: '30', suffix: '+', label: 'Demo Students', icon: <School sx={{ fontSize: 24 }} /> },
    { num: '12', suffix: '', label: 'Courses', icon: <CloudDone sx={{ fontSize: 24 }} /> },
    { num: '24/7', suffix: '', label: 'Availability', icon: <Speed sx={{ fontSize: 24 }} /> },
  ];

  const testimonials = [
    { name: 'Elham Namus', role: 'Student', text: 'The RMS made my final year so much easier. I can request my transcript in seconds instead of waiting in line for hours.', avatar: 'EN', stars: 5 },
    { name: 'Mr. Ashenafi Tadesse', role: 'Instructor', text: 'Submitting grades online has reduced my workload tremendously. The approval workflow keeps everything organized.', avatar: 'AT', stars: 5 },
    { name: 'Ato Mekonnen Kebede', role: 'Registrar', text: 'We went from stacks of paper to a completely digital system. Processing documents now takes minutes instead of days.', avatar: 'MK', stars: 5 },
  ];

  const roles = [
    { role: 'Student', color: '#34d399', desc: 'Register courses, view grades, request documents, and track academic progress.' },
    { role: 'Instructor', color: '#38bdf8', desc: 'Submit grades online, view assigned courses, and manage course materials.' },
    { role: 'Registrar', color: '#a78bfa', desc: 'Manage student records, verify grades, process documents, and generate reports.' },
    { role: 'Department Head', color: '#fbbf24', desc: 'Monitor departmental performance, assign instructors, and plan academics.' },
    { role: 'Administrator', color: '#f87171', desc: 'Configure users, manage access permissions, and oversee system operations.' },
  ];

  return (
    <Box sx={{ overflow: 'hidden', position: 'relative', bgcolor: '#050b14' }}>
      {/* ═══════════ Navbar ═══════════ */}
      <AppBar position="fixed" elevation={0} sx={{
        bgcolor: scrolled ? 'rgba(5,11,20,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        transition: 'all 0.5s ease',
        color: 'white',
      }}>
        <Toolbar sx={{ maxWidth: 1400, mx: 'auto', width: '100%', px: { xs: 2, md: 4 }, py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{
              width: 40, height: 40, borderRadius: 2.5,
              background: 'linear-gradient(135deg, #0f4c81, #2980b9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: 18, color: 'white',
              boxShadow: '0 4px 20px rgba(15,76,129,0.4)',
            }}>R</Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'white', letterSpacing: '-0.03em', fontSize: '1.35rem' }}>RMS</Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          {!isMobile ? (
            <Stack direction="row" spacing={1} alignItems="center">
              {['Features', 'Roles', 'Testimonials'].map((item) => (
                <Button key={item} href={`#${item.toLowerCase()}`} sx={{ color: 'rgba(255,255,255,0.7)', textTransform: 'none', fontWeight: 500, '&:hover': { color: 'white' } }}>{item}</Button>
              ))}
              {user ? (
                <Button variant="contained" component={Link} to="/dashboard" sx={{
                  ml: 1, borderRadius: 3, px: 3, py: 0.8,
                  background: 'linear-gradient(135deg, #0f4c81, #2980b9)',
                  textTransform: 'none', fontWeight: 700,
                  boxShadow: '0 4px 20px rgba(15,76,129,0.35)',
                }}>Dashboard</Button>
              ) : (
                <Button variant="contained" component={Link} to="/login" sx={{
                  ml: 1, borderRadius: 3, px: 3, py: 0.8,
                  background: 'linear-gradient(135deg, #0f4c81, #2980b9)',
                  textTransform: 'none', fontWeight: 700,
                  boxShadow: '0 4px 20px rgba(15,76,129,0.35)',
                }}>Sign In</Button>
              )}
            </Stack>
          ) : (
            <Button onClick={() => setMobileOpen(!mobileOpen)} sx={{ color: 'white' }}>
              {mobileOpen ? <Close /> : <Menu />}
            </Button>
          )}
        </Toolbar>
        {isMobile && mobileOpen && (
          <Box sx={{ px: 3, pb: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
            {['Features', 'Roles', 'Testimonials'].map((item) => (
              <Button key={item} href={`#${item.toLowerCase()}`} sx={{ color: 'rgba(255,255,255,0.8)', textTransform: 'none', justifyContent: 'flex-start' }}>{item}</Button>
            ))}
            <Button variant="contained" component={Link} to="/login" fullWidth sx={{
              mt: 1, borderRadius: 3,
              background: 'linear-gradient(135deg, #0f4c81, #2980b9)',
              textTransform: 'none', fontWeight: 700,
            }}>Sign In</Button>
          </Box>
        )}
      </AppBar>

      {/* ═══════════ Hero ═══════════ */}
      <Box sx={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        pt: 10,
        pb: 8,
      }}>
        {/* Background layers */}
        <Box sx={{
          position: 'absolute', inset: 0,
          background: `
            radial-gradient(ellipse at 20% 40%, rgba(15,76,129,0.35) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 10%, rgba(41,128,185,0.25) 0%, transparent 50%),
            radial-gradient(ellipse at 60% 90%, rgba(39,174,96,0.15) 0%, transparent 50%),
            linear-gradient(180deg, #050b14 0%, #0a1525 60%, #0d1b2f 100%)
          `,
        }} />
        <Box sx={{
          position: 'absolute', inset: 0, opacity: 0.4,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '256px',
          mixBlendMode: 'overlay',
          pointerEvents: 'none',
        }} />

        {/* Animated orbs */}
        <Box sx={{ position: 'absolute', top: '15%', left: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(15,76,129,0.25) 0%, transparent 70%)', filter: 'blur(60px)', animation: `${floatSlow} 10s ease-in-out infinite` }} />
        <Box sx={{ position: 'absolute', top: '50%', right: '0%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(41,128,185,0.2) 0%, transparent 70%)', filter: 'blur(50px)', animation: `${floatSlow} 12s ease-in-out infinite reverse` }} />
        <Box sx={{ position: 'absolute', bottom: '10%', left: '30%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(39,174,96,0.12) 0%, transparent 70%)', filter: 'blur(50px)', animation: `${floatSlow} 14s ease-in-out infinite` }} />

        <ParticleField />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={6} alignItems="center">
            {/* Left text */}
            <Grid item xs={12} md={7}>
              <Box sx={{ animation: `${slideUpFade} 0.8s ease-out` }}>
                <Chip label="Addis Ababa University" size="small" sx={{
                  bgcolor: 'rgba(15,76,129,0.3)', color: '#a8d8ff', mb: 3, fontWeight: 600,
                  border: '1px solid rgba(168,216,255,0.15)', px: 1.5, py: 0.5,
                  backdropFilter: 'blur(8px)',
                }} />

                <Typography variant="h1" sx={{
                  fontWeight: 900, mb: 3, lineHeight: 1.05, letterSpacing: '-0.04em',
                  fontSize: { xs: '2.8rem', sm: '3.8rem', md: '4.8rem' },
                  color: 'white',
                }}>
                  The Future of{' '}
                  <Box component="span" sx={{
                    background: 'linear-gradient(90deg, #60a5fa, #34d399, #60a5fa)',
                    backgroundSize: '200% auto',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    animation: `${shimmer} 5s linear infinite`,
                  }}>Academic</Box>{' '}
                  Management
                </Typography>

                <Typography variant="h5" sx={{
                  mb: 5, color: 'rgba(255,255,255,0.65)', fontWeight: 400,
                  maxWidth: 560, lineHeight: 1.7, fontSize: { xs: '1.05rem', md: '1.25rem' },
                }}>
                  A modern digital platform automating registrar operations, streamlining academic records, and elevating the teaching-learning experience for campuses across Ethiopia.
                </Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} sx={{ mb: 6 }}>
                  <Button variant="contained" size="large" component={Link} to="/login" sx={{
                    bgcolor: 'white', color: '#0a1525', fontWeight: 800, borderRadius: 3.5,
                    px: 5, py: 1.8, boxShadow: '0 8px 32px rgba(255,255,255,0.15)',
                    '&:hover': { bgcolor: '#f0f4f8', transform: 'translateY(-3px)' },
                    transition: 'all 0.3s ease', textTransform: 'none', fontSize: '1.05rem',
                  }}>
                    Get Started <ArrowForward sx={{ ml: 1, fontSize: 20 }} />
                  </Button>
                  <Button variant="outlined" size="large" href="#features" sx={{
                    borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.85)', fontWeight: 600,
                    borderRadius: 3.5, px: 4, py: 1.8, textTransform: 'none', fontSize: '1.05rem',
                    '&:hover': { borderColor: 'rgba(255,255,255,0.4)', bgcolor: 'rgba(255,255,255,0.04)' },
                  }}>
                    Explore Features <KeyboardArrowDown sx={{ ml: 0.5 }} />
                  </Button>
                </Stack>

                <Stack direction="row" spacing={3} alignItems="center" sx={{ opacity: 0.6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CheckCircle sx={{ fontSize: 16, color: '#34d399' }} />
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>Free to use</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CheckCircle sx={{ fontSize: 16, color: '#34d399' }} />
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>No credit card</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CheckCircle sx={{ fontSize: 16, color: '#34d399' }} />
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>Demo data included</Typography>
                  </Box>
                </Stack>
              </Box>
            </Grid>

            {/* Right visual */}
            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box sx={{ position: 'relative', animation: `${scaleIn} 1s ease-out 0.2s both` }}>
                {/* Main glass card */}
                <GlassCard sx={{ p: 3, mb: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#f87171' }} />
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#fbbf24' }} />
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#34d399' }} />
                    <Typography variant="caption" sx={{ ml: 'auto', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>dashboard.jsx</Typography>
                  </Box>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    {[ { t: 'Total Students', v: '36', c: '#60a5fa' }, { t: 'Courses', v: '12', c: '#34d399' }, { t: 'Pending Docs', v: '3', c: '#fbbf24' }, { t: 'GPA Avg', v: '3.42', c: '#a78bfa' } ].map((s, i) => (
                      <Box key={i} sx={{
                        p: 2, borderRadius: 2,
                        bgcolor: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.06)',
                      }}>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 500, display: 'block', mb: 0.5 }}>{s.t}</Typography>
                        <Typography variant="h5" sx={{ color: s.c, fontWeight: 800 }}>{s.v}</Typography>
                      </Box>
                    ))}
                  </Box>
                  <Box sx={{ mt: 2.5, p: 2, borderRadius: 2, bgcolor: 'rgba(15,76,129,0.15)', border: '1px solid rgba(15,76,129,0.2)' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <TrendingUp sx={{ fontSize: 16, color: '#34d399' }} />
                      <Typography variant="caption" sx={{ color: '#34d399', fontWeight: 700 }}>Enrollment +12% this month</Typography>
                    </Box>
                    <Box sx={{ height: 4, bgcolor: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                      <Box sx={{ width: '65%', height: '100%', bgcolor: 'linear-gradient(90deg, #0f4c81, #34d399)', borderRadius: 2 }} />
                    </Box>
                  </Box>
                </GlassCard>

                {/* Floating badge */}
                <Box sx={{
                  position: 'absolute', bottom: -20, left: -30,
                  p: 2, borderRadius: 3,
                  bgcolor: 'rgba(5,11,20,0.9)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(12px)',
                  animation: `${float} 4s ease-in-out infinite`,
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#34d399', fontSize: 12, fontWeight: 800 }}>R</Avatar>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', fontWeight: 500 }}>Grade Approved</Typography>
                      <Typography variant="body2" sx={{ color: 'white', fontWeight: 700 }}>CS401 - A+</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ═══════════ Stats Band ═══════════ */}
      <Box sx={{
        position: 'relative', zIndex: 2,
        background: 'linear-gradient(180deg, #0d1b2f 0%, #0a1525 100%)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        py: 5,
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            {stats.map((s, i) => (
              <Grid item xs={6} md={3} key={i}>
                <AnimatedSection delay={i * 120}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box sx={{
                      width: 52, height: 52, borderRadius: 3, mx: 'auto', mb: 2,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      bgcolor: 'rgba(15,76,129,0.1)',
                      color: '#60a5fa',
                      border: '1px solid rgba(96,165,250,0.15)',
                    }}>{s.icon}</Box>
                    <Typography variant="h3" sx={{ fontWeight: 900, color: 'white', mb: 0.5, fontSize: '2.2rem' }}>{s.num}<Box component="span" sx={{ color: '#60a5fa' }}>{s.suffix}</Box></Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.45)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem' }}>{s.label}</Typography>
                  </Box>
                </AnimatedSection>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ═══════════ Features (Bento Grid) ═══════════ */}
      <Box id="features" sx={{ bgcolor: '#050b14', py: { xs: 10, md: 14 }, position: 'relative' }}>
        <Container maxWidth="lg">
          <AnimatedSection>
            <Box sx={{ textAlign: 'center', mb: 10 }}>
              <Chip label="Features" size="small" sx={{
                bgcolor: 'rgba(96,165,250,0.1)', color: '#60a5fa', mb: 2, fontWeight: 700,
                border: '1px solid rgba(96,165,250,0.15)', letterSpacing: '0.15em', textTransform: 'uppercase',
              }} />
              <Typography variant="h2" sx={{ fontWeight: 900, color: 'white', mb: 2, letterSpacing: '-0.03em', fontSize: { xs: '2rem', md: '3rem' } }}>
                Everything You Need
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.5)', maxWidth: 550, mx: 'auto', lineHeight: 1.8, fontSize: '1.05rem' }}>
                A comprehensive suite of tools designed to streamline academic management from enrollment to graduation.
              </Typography>
            </Box>
          </AnimatedSection>

          <Grid container spacing={2.5}>
            {/* Featured large card */}
            <Grid item xs={12} md={6}>
              <AnimatedSection delay={100}>
                <GlassCard sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Box>
                    <Box sx={{
                      width: 60, height: 60, borderRadius: 2.5, mb: 3,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      bgcolor: 'rgba(96,165,250,0.1)', color: '#60a5fa',
                      border: '1px solid rgba(96,165,250,0.15)',
                    }}>
                      <Speed sx={{ fontSize: 32 }} />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: 'white', mb: 1.5 }}>Online Registration</Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.8 }}>
                      Instant course registration with real-time prerequisite validation and automated scheduling. Students can register for courses in seconds without standing in queues.
                    </Typography>
                  </Box>
                  <Box sx={{ mt: 3, p: 2.5, borderRadius: 2, bgcolor: 'rgba(96,165,250,0.05)', border: '1px solid rgba(96,165,250,0.1)' }}>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block', mb: 1 }}>Registration Time</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                      <Typography variant="h4" sx={{ color: '#60a5fa', fontWeight: 900 }}>~30s</Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)' }}>vs. 2+ hours manually</Typography>
                    </Box>
                  </Box>
                </GlassCard>
              </AnimatedSection>
            </Grid>

            {/* Right column stack */}
            <Grid item xs={12} md={6}>
              <Grid container spacing={2.5}>
                {features.slice(1).map((f, i) => (
                  <Grid item xs={12} sm={6} key={i}>
                    <AnimatedSection delay={150 + i * 80}>
                      <GlassCard sx={{ p: 3, height: '100%' }}>
                        <Box sx={{
                          width: 48, height: 48, borderRadius: 2, mb: 2.5,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          bgcolor: f.bg, color: f.color,
                        }}>{f.icon}</Box>
                        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: 'white', fontSize: '1.1rem' }}>{f.title}</Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>{f.desc}</Typography>
                      </GlassCard>
                    </AnimatedSection>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ═══════════ Roles Section ═══════════ */}
      <Box id="roles" sx={{
        py: { xs: 10, md: 14 }, position: 'relative',
        background: 'linear-gradient(180deg, #050b14 0%, #0a1525 50%, #050b14 100%)',
      }}>
        <Box sx={{ position: 'absolute', inset: 0, opacity: 0.3, backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.03) 1px, transparent 0)`, backgroundSize: '40px 40px', pointerEvents: 'none' }} />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <AnimatedSection>
            <Box sx={{ textAlign: 'center', mb: 10 }}>
              <Chip label="Roles" size="small" sx={{
                bgcolor: 'rgba(167,139,250,0.1)', color: '#a78bfa', mb: 2, fontWeight: 700,
                border: '1px solid rgba(167,139,250,0.15)', letterSpacing: '0.15em', textTransform: 'uppercase',
              }} />
              <Typography variant="h2" sx={{ fontWeight: 900, color: 'white', mb: 2, letterSpacing: '-0.03em', fontSize: { xs: '2rem', md: '3rem' } }}>
                Built for Everyone
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.5)', maxWidth: 550, mx: 'auto', lineHeight: 1.8 }}>
                Tailored experiences designed specifically for each member of the academic community.
              </Typography>
            </Box>
          </AnimatedSection>

          <Grid container spacing={2.5}>
            {roles.map((r, i) => (
              <Grid item xs={12} sm={6} lg={4} key={i} sx={{ ...(i === 4 && { xs: 12, sm: 6, lg: { span: 4, offset: 2 } }) }}>
                <AnimatedSection delay={i * 100}>
                  <GlassCard sx={{ p: 3.5, height: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5 }}>
                      <Box sx={{
                        width: 48, height: 48, borderRadius: 2,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        bgcolor: `${r.color}15`, color: r.color,
                        fontWeight: 800, fontSize: 20,
                      }}>{r.role[0]}</Box>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: 'white', fontSize: '1.15rem' }}>{r.role}</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.8 }}>{r.desc}</Typography>
                    <Box sx={{ mt: 2.5, pt: 2.5, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                      {['View', 'Edit', 'Manage', 'Report'].slice(0, 3 + (i % 2)).map((tag, ti) => (
                        <Chip key={ti} label={tag} size="small" sx={{
                          bgcolor: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)',
                          border: '1px solid rgba(255,255,255,0.06)', fontWeight: 500, fontSize: '0.7rem',
                        }} />
                      ))}
                    </Box>
                  </GlassCard>
                </AnimatedSection>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ═══════════ Testimonials ═══════════ */}
      <Box id="testimonials" sx={{ bgcolor: '#050b14', py: { xs: 10, md: 14 } }}>
        <Container maxWidth="lg">
          <AnimatedSection>
            <Box sx={{ textAlign: 'center', mb: 10 }}>
              <Chip label="Testimonials" size="small" sx={{
                bgcolor: 'rgba(251,191,36,0.1)', color: '#fbbf24', mb: 2, fontWeight: 700,
                border: '1px solid rgba(251,191,36,0.15)', letterSpacing: '0.15em', textTransform: 'uppercase',
              }} />
              <Typography variant="h2" sx={{ fontWeight: 900, color: 'white', mb: 2, letterSpacing: '-0.03em', fontSize: { xs: '2rem', md: '3rem' } }}>
                What People Say
              </Typography>
            </Box>
          </AnimatedSection>

          <Grid container spacing={3}>
            {testimonials.map((t, i) => (
              <Grid item xs={12} md={4} key={i}>
                <AnimatedSection delay={i * 150}>
                  <GlassCard sx={{ p: 3.5, height: '100%' }}>
                    <Box sx={{ display: 'flex', gap: 0.3, mb: 2.5 }}>
                      {Array.from({ length: t.stars }).map((_, si) => (
                        <Star key={si} sx={{ fontSize: 18, color: '#fbbf24' }} />
                      ))}
                    </Box>
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.85, mb: 3, fontStyle: 'italic', fontSize: '0.95rem' }}>
                      &ldquo;{t.text}&rdquo;
                    </Typography>
                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mb: 2.5 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ bgcolor: 'rgba(15,76,129,0.4)', width: 42, height: 42, fontWeight: 700, fontSize: 14 }}>{t.avatar}</Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: 'white' }}>{t.name}</Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>{t.role}</Typography>
                      </Box>
                    </Box>
                  </GlassCard>
                </AnimatedSection>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ═══════════ CTA ═══════════ */}
      <Box sx={{
        py: { xs: 10, md: 14 }, position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, #0a1525 0%, #0f4c81 50%, #0a1525 100%)',
      }}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(96,165,250,0.12) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <AnimatedSection>
            <Typography variant="h2" sx={{
              fontWeight: 900, mb: 3, color: 'white',
              letterSpacing: '-0.03em', fontSize: { xs: '2rem', md: '3.2rem' },
            }}>
              Ready to modernize your registrar office?
            </Typography>
            <Typography variant="h6" sx={{
              mb: 5, color: 'rgba(255,255,255,0.6)', maxWidth: 560, mx: 'auto',
              lineHeight: 1.8, fontWeight: 400, fontSize: '1.15rem',
            }}>
              Join hundreds of students and staff already using RMS. No paperwork, no queues, just efficient academic management.
            </Typography>
            <Button variant="contained" size="large" component={Link} to="/login" sx={{
              bgcolor: 'white', color: '#0a1525', fontWeight: 800, borderRadius: 3.5,
              px: 6, py: 2, boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
              textTransform: 'none', fontSize: '1.1rem',
              '&:hover': { bgcolor: '#f0f4f8', transform: 'translateY(-4px)', boxShadow: '0 20px 56px rgba(0,0,0,0.3)' },
              transition: 'all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}>
              Sign In to RMS
            </Button>
          </AnimatedSection>
        </Container>
      </Box>

      {/* ═══════════ Footer ═══════════ */}
      <Box sx={{ bgcolor: '#02050a', borderTop: '1px solid rgba(255,255,255,0.05)', py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            <Grid item xs={12} md={5}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Box sx={{
                  width: 40, height: 40, borderRadius: 2.5,
                  background: 'linear-gradient(135deg, #0f4c81, #2980b9)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: 18, color: 'white',
                }}>R</Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>RMS</Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', lineHeight: 1.8, maxWidth: 340, mb: 3 }}>
                A modern digital solution for registrar management, developed as a Final Year Project at Addis Ababa University.
              </Typography>
              <Stack direction="row" spacing={1.5}>
                {[Email, Phone, Public].map((Icon, i) => (
                  <Box key={i} sx={{
                    width: 40, height: 40, borderRadius: 2,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    bgcolor: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.08)', color: 'white' },
                    transition: 'all 0.2s',
                  }}>
                    <Icon sx={{ fontSize: 18 }} />
                  </Box>
                ))}
              </Stack>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 700, mb: 2.5, letterSpacing: '0.05em' }}>PLATFORM</Typography>
              {['Features', 'Roles', 'Testimonials', 'Documentation'].map((item) => (
                <Typography key={item} variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', mb: 1.5, cursor: 'pointer', '&:hover': { color: 'rgba(255,255,255,0.7)' } }}>{item}</Typography>
              ))}
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 700, mb: 2.5, letterSpacing: '0.05em' }}>TEAM</Typography>
              {['Elham Namus', 'Selamawit Shumbet', 'Yordanos Zerihun', 'Mr. Ashenafi'].map((item) => (
                <Typography key={item} variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', mb: 1.5 }}>{item}</Typography>
              ))}
            </Grid>
          </Grid>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', my: 5 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)' }}>
              &copy; {new Date().getFullYear()} Registrar Management System. All rights reserved.
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)' }}>
              Addis Ababa University | Dept. of Computer Science
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
