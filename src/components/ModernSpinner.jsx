import React from 'react';
import { Box, Typography, keyframes } from '@mui/material';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const spinReverse = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(-360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.4; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.1); }
`;

/**
 * Modern full-page loader with gradient double-ring animation.
 * Use this for page-level loading states.
 */
export const ModernSpinner = ({ message = 'Loading...', fullPage = true, size = 64 }) => (
  <Box sx={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    ...(fullPage && { minHeight: '60vh', mt: 0 }),
    ...(fullPage === false && { py: 6 }),
    gap: 2.5,
  }}>
    {/* Double ring spinner */}
    <Box sx={{
      position: 'relative',
      width: size,
      height: size,
    }}>
      {/* Outer ring */}
      <Box sx={{
        position: 'absolute', inset: 0,
        borderRadius: '50%',
        border: '3px solid transparent',
        borderTopColor: '#60a5fa',
        borderRightColor: '#0f4c81',
        animation: `${spin} 1.2s linear infinite`,
      }} />
      {/* Inner ring */}
      <Box sx={{
        position: 'absolute',
        top: '15%', left: '15%', right: '15%', bottom: '15%',
        borderRadius: '50%',
        border: '3px solid transparent',
        borderBottomColor: '#34d399',
        borderLeftColor: '#2980b9',
        animation: `${spinReverse} 0.8s linear infinite`,
      }} />
      {/* Center dot */}
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: size * 0.18,
        height: size * 0.18,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #60a5fa, #34d399)',
        animation: `${pulse} 1.5s ease-in-out infinite`,
        boxShadow: '0 0 16px rgba(96,165,250,0.4)',
      }} />
    </Box>

    {/* Message */}
    <Typography variant="body2" sx={{
      color: '#5a6a7a',
      fontWeight: 600,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      fontSize: '0.8rem',
    }}>
      {message}
    </Typography>
  </Box>
);

/**
 * Skeleton shimmer placeholder for tables/cards while loading.
 */
export const ShimmerBlock = ({ width = '100%', height = 20, borderRadius = 8 }) => (
  <Box sx={{
    width, height, borderRadius,
    background: 'linear-gradient(90deg, #f0f4f8 25%, #e2e8f0 50%, #f0f4f8 75%)',
    backgroundSize: '200% 100%',
    animation: `${keyframes`
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    `} 1.5s ease-in-out infinite`,
  }} />
);

export default ModernSpinner;
