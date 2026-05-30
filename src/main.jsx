import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { SnackbarProvider } from 'notistack'
import axios from 'axios'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

// Set API base URL for production
axios.defaults.baseURL = import.meta.env.PROD
  ? 'https://registral-yordi-backend.onrender.com'
  : ''

const theme = createTheme({
  palette: {
    primary: {
      main: '#0f4c81',
      light: '#3e72a4',
      dark: '#0a3560',
      contrastText: '#fff',
    },
    secondary: {
      main: '#c0392b',
      light: '#d6584e',
      dark: '#8c2a1f',
      contrastText: '#fff',
    },
    success: {
      main: '#27ae60',
      light: '#4cd080',
      dark: '#1e8a4c',
    },
    warning: {
      main: '#f39c12',
      light: '#f5b043',
      dark: '#c27c0e',
    },
    info: {
      main: '#2980b9',
      light: '#4fa0d4',
      dark: '#1f6390',
    },
    background: {
      default: '#f0f4f8',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a2a3a',
      secondary: '#5a6a7a',
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
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0 1px 3px rgba(0,0,0,0.08)',
    '0 4px 12px rgba(0,0,0,0.08)',
    '0 8px 24px rgba(0,0,0,0.10)',
    '0 12px 32px rgba(0,0,0,0.12)',
    '0 16px 48px rgba(0,0,0,0.14)',
    '0 20px 64px rgba(0,0,0,0.16)',
    '0 24px 80px rgba(0,0,0,0.18)',
    '0 28px 96px rgba(0,0,0,0.20)',
    '0 32px 112px rgba(0,0,0,0.22)',
    '0 36px 128px rgba(0,0,0,0.24)',
    '0 40px 144px rgba(0,0,0,0.26)',
    '0 44px 160px rgba(0,0,0,0.28)',
    '0 48px 176px rgba(0,0,0,0.30)',
    '0 52px 192px rgba(0,0,0,0.32)',
    '0 56px 208px rgba(0,0,0,0.34)',
    '0 60px 224px rgba(0,0,0,0.36)',
    '0 64px 240px rgba(0,0,0,0.38)',
    '0 68px 256px rgba(0,0,0,0.40)',
    '0 72px 272px rgba(0,0,0,0.42)',
    '0 76px 288px rgba(0,0,0,0.44)',
    '0 80px 304px rgba(0,0,0,0.46)',
    '0 84px 320px rgba(0,0,0,0.48)',
    '0 88px 336px rgba(0,0,0,0.50)',
    '0 92px 352px rgba(0,0,0,0.52)',
  ],
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          border: '1px solid rgba(0,0,0,0.04)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 24px',
          textTransform: 'none',
          fontWeight: 600,
        },
        contained: {
          boxShadow: '0 4px 12px rgba(15,76,129,0.25)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
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
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        autoHideDuration={4000}
        style={{ fontWeight: 600 }}
      >
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </SnackbarProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
