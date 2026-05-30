import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

const ThemeContext = createContext();

export const useThemeMode = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const stored = localStorage.getItem('rms-theme');
  const [mode, setMode] = useState(stored || 'dark');

  useEffect(() => {
    localStorage.setItem('rms-theme', mode);
  }, [mode]);

  const toggleMode = () => setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: {
        main: '#60a5fa',
        light: '#93c5fd',
        dark: '#3b82f6',
        contrastText: '#fff',
      },
      secondary: {
        main: '#f87171',
        light: '#fca5a5',
        dark: '#ef4444',
        contrastText: '#fff',
      },
      success: {
        main: '#34d399',
        light: '#6ee7b7',
        dark: '#10b981',
      },
      warning: {
        main: '#fbbf24',
        light: '#fcd34d',
        dark: '#f59e0b',
      },
      info: {
        main: '#38bdf8',
        light: '#7dd3fc',
        dark: '#0ea5e9',
      },
      background: {
        default: mode === 'dark' ? '#050b14' : '#f0f4f8',
        paper: mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#ffffff',
      },
      text: {
        primary: mode === 'dark' ? '#ffffff' : '#1a2a3a',
        secondary: mode === 'dark' ? 'rgba(255,255,255,0.6)' : '#5a6a7a',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 800, letterSpacing: '-0.025em' },
      h2: { fontWeight: 700, letterSpacing: '-0.02em' },
      h3: { fontWeight: 700, letterSpacing: '-0.015em' },
      h4: { fontWeight: 700 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
      button: { fontWeight: 600, textTransform: 'none', letterSpacing: '0.01em' },
      subtitle1: { fontWeight: 500 },
      body1: { lineHeight: 1.7 },
    },
    shape: {
      borderRadius: 16,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: mode === 'dark' ? '#050b14' : '#f0f4f8',
            color: mode === 'dark' ? '#ffffff' : '#1a2a3a',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            background: mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#ffffff',
            backdropFilter: mode === 'dark' ? 'blur(12px)' : 'none',
            borderRadius: 16,
            boxShadow: mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.15)' : '0 4px 20px rgba(0,0,0,0.06)',
            border: mode === 'dark' ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.04)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            color: mode === 'dark' ? '#ffffff' : '#1a2a3a',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            padding: '10px 24px',
            textTransform: 'none',
            fontWeight: 600,
          },
          contained: {
            boxShadow: mode === 'dark' ? '0 4px 20px rgba(96,165,250,0.25)' : '0 4px 12px rgba(15,76,129,0.25)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#ffffff',
            borderRadius: 16,
            border: mode === 'dark' ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.04)',
            color: mode === 'dark' ? '#ffffff' : '#1a2a3a',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 500,
          },
        },
      },
      MuiTableContainer: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.15)' : '0 4px 20px rgba(0,0,0,0.06)',
            background: mode === 'dark' ? 'rgba(255,255,255,0.02)' : '#ffffff',
            border: mode === 'dark' ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.04)',
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'dark' ? 'rgba(15,76,129,0.4)' : '#0f4c81',
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: mode === 'dark' ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.08)',
            color: mode === 'dark' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.87)',
          },
          head: {
            color: '#ffffff',
            fontWeight: 700,
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 20,
            background: mode === 'dark' ? 'linear-gradient(180deg, #0d1b2f 0%, #0a1525 100%)' : '#ffffff',
            border: mode === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.04)',
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.04)' : '#f8fafc',
            '& fieldset': {
              borderColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.15)',
            },
            '&:hover fieldset': {
              borderColor: mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.25)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#60a5fa',
            },
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: mode === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
            '&.Mui-focused': {
              color: '#60a5fa',
            },
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            background: mode === 'dark' ? '#0d1b2f' : '#ffffff',
            border: mode === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundImage: 'none',
            border: 'none',
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: mode === 'dark' ? '#0d1b2f' : '#1a2a3a',
            border: mode === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
            borderRadius: 8,
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
            borderRadius: 4,
          },
        },
      },
    },
  }), [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleMode }}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
