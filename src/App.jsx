import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import PageLoader from './components/PageLoader';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Courses from './pages/Courses';
import Grades from './pages/Grades';
import Documents from './pages/Documents';
import Reports from './pages/Reports';
import Announcements from './pages/Announcements';
import Users from './pages/Users';
import Profile from './pages/Profile';
import { CircularProgress, Box } from '@mui/material';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/dashboard" />;
  return <Layout>{children}</Layout>;
};

const App = () => {
  const [loaderDone, setLoaderDone] = useState(false);

  // Show page loader on first visit
  const showLoader = !loaderDone && !window.location.pathname.startsWith('/login');

  return (
    <>
      {showLoader && <PageLoader onComplete={() => setLoaderDone(true)} />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Navigate to="/login" replace />} />
        <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['student','instructor','registrar','admin','department_head']}><Dashboard /></ProtectedRoute>} />
        <Route path="/students" element={<ProtectedRoute allowedRoles={['registrar','admin','department_head']}><Students /></ProtectedRoute>} />
        <Route path="/courses" element={<ProtectedRoute allowedRoles={['student','instructor','registrar','admin','department_head']}><Courses /></ProtectedRoute>} />
        <Route path="/grades" element={<ProtectedRoute allowedRoles={['student','instructor','registrar','admin','department_head']}><Grades /></ProtectedRoute>} />
        <Route path="/documents" element={<ProtectedRoute allowedRoles={['student','registrar','admin']}><Documents /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute allowedRoles={['registrar','admin','department_head']}><Reports /></ProtectedRoute>} />
        <Route path="/announcements" element={<ProtectedRoute allowedRoles={['student','instructor','registrar','admin','department_head']}><Announcements /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute allowedRoles={['admin']}><Users /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute allowedRoles={['student','instructor','registrar','admin','department_head']}><Profile /></ProtectedRoute>} />
      </Routes>
    </>
  );
};

export default App;
