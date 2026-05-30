import React, { useState, useEffect } from 'react';
import { Box, Typography, keyframes } from '@mui/material';

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.15); opacity: 0.7; }
`;

const slideUp = keyframes`
  0% { transform: translateY(20px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
`;

const barGrow = keyframes`
  0% { width: 0%; }
  50% { width: 70%; }
  100% { width: 100%; }
`;

const PageLoader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => { setFadeOut(true); setTimeout(onComplete, 600); }, 400);
          return 100;
        }
        return prev + Math.random() * 18 + 2;
      });
    }, 120);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <Box sx={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f4c81 0%, #1a5276 30%, #2980b9 100%)',
      zIndex: 9999,
      transition: 'opacity 0.6s ease',
      opacity: fadeOut ? 0 : 1,
      pointerEvents: fadeOut ? 'none' : 'all',
    }}>
      <Box sx={{
        width: 80, height: 80, borderRadius: '24px',
        background: 'rgba(255,255,255,0.15)',
        backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: `${pulse} 2s ease-in-out infinite`,
        border: '2px solid rgba(255,255,255,0.25)',
        mb: 3,
      }}>
        <Typography sx={{ color: 'white', fontWeight: 800, fontSize: 28, letterSpacing: '-0.02em' }}>RMS</Typography>
      </Box>

      <Typography sx={{
        color: 'white', fontWeight: 700, fontSize: '1.25rem', letterSpacing: '0.05em',
        textTransform: 'uppercase', mb: 4, animation: `${slideUp} 0.6s ease forwards`,
        textShadow: '0 2px 12px rgba(0,0,0,0.2)',
      }}>
        Registrar Management System
      </Typography>

      <Box sx={{ width: 220, height: 4, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.15)', overflow: 'hidden', position: 'relative' }}>
        <Box sx={{
          height: '100%', borderRadius: 2,
          background: 'linear-gradient(90deg, #ffffff, #a8d8ff)',
          boxShadow: '0 0 12px rgba(255,255,255,0.4)',
          transition: 'width 0.15s linear',
          width: `${Math.min(progress, 100)}%`,
        }} />
      </Box>

      <Typography sx={{
        color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', mt: 2,
        fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase',
      }}>
        {Math.min(Math.round(progress), 100)}% loaded
      </Typography>
    </Box>
  );
};

export default PageLoader;
