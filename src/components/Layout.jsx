import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  AppBar, Toolbar, Typography, Box, Drawer, List, ListItem,
  ListItemButton, ListItemIcon, ListItemText, IconButton, Avatar, Menu, MenuItem, Divider, Tooltip, Button
} from '@mui/material';
import {
  Menu as MenuIcon, Dashboard, School, Book, Grade, Description,
  Assessment, Campaign, People, Logout, Home, Person, ChevronLeft, ChevronRight
} from '@mui/icons-material';

const drawerWidth = 280;

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleProfileMenu = (e) => setAnchorEl(e.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);
  const doLogout = () => { logout(); navigate('/'); };

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard', roles: ['student', 'instructor', 'registrar', 'admin', 'department_head'] },
    { text: 'Students', icon: <School />, path: '/students', roles: ['registrar', 'admin', 'department_head'] },
    { text: 'Courses', icon: <Book />, path: '/courses', roles: ['student', 'instructor', 'registrar', 'admin', 'department_head'] },
    { text: 'Grades', icon: <Grade />, path: '/grades', roles: ['student', 'instructor', 'registrar', 'admin', 'department_head'] },
    { text: 'Documents', icon: <Description />, path: '/documents', roles: ['student', 'registrar', 'admin'] },
    { text: 'Reports', icon: <Assessment />, path: '/reports', roles: ['registrar', 'admin', 'department_head'] },
    { text: 'Announcements', icon: <Campaign />, path: '/announcements', roles: ['student', 'instructor', 'registrar', 'admin', 'department_head'] },
    { text: 'Users', icon: <People />, path: '/users', roles: ['admin'] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(user?.role));

  const activeStyle = {
    bgcolor: 'rgba(255,255,255,0.15)',
    borderLeft: '4px solid #fff',
    '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
  };

  const inactiveStyle = {
    borderLeft: '4px solid transparent',
    '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' }
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#0f4c81', color: 'white' }}>
      <Box sx={{ p: 3, pb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ bgcolor: '#fff', color: '#0f4c81', width: 44, height: 44, fontWeight: 800, fontSize: 18 }}>RMS</Avatar>
        {!collapsed && (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.02em' }}>RMS</Typography>
            <Typography variant="caption" sx={{ opacity: 0.8, lineHeight: 1 }}>Registrar System</Typography>
          </Box>
        )}
        <IconButton onClick={() => setCollapsed(!collapsed)} sx={{ ml: 'auto', color: 'white', opacity: 0.7, '&:hover': { opacity: 1 } }} size="small">
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
      </Box>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)', mx: 2 }} />
      <List sx={{ pt: 2, px: 1 }}>
        {filteredItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <Tooltip title={collapsed ? item.text : ''} placement="right" arrow>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={isActive}
                  sx={{ borderRadius: 2, color: 'white', py: 1, ...(isActive ? activeStyle : inactiveStyle) }}
                >
                  <ListItemIcon sx={{ color: 'white', minWidth: collapsed ? 0 : 40, mr: collapsed ? 0 : undefined }}>{item.icon}</ListItemIcon>
                  {!collapsed && <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: isActive ? 600 : 400, fontSize: 15 }} />}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>
      <Box sx={{ mt: 'auto', p: 2 }}>
        {!collapsed && (
          <Box sx={{ bgcolor: 'rgba(255,255,255,0.08)', borderRadius: 2, p: 2 }}>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>Logged in as</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{user?.name}</Typography>
            <Typography variant="caption" sx={{ opacity: 0.6, textTransform: 'capitalize' }}>{user?.role?.replace('_', ' ')}</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" elevation={0} sx={{
        width: { md: `calc(100% - ${collapsed ? 80 : drawerWidth}px)` },
        ml: { md: `${collapsed ? 80 : drawerWidth}px` },
        bgcolor: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        color: '#1a2a3a',
        transition: 'width 0.3s, margin-left 0.3s',
      }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { md: 'none' } }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#5a6a7a' }}>
              {menuItems.find(m => m.path === location.pathname)?.text || 'Page'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button component={Link} to="/" sx={{ color: '#5a6a7a', textTransform: 'none', fontWeight: 500 }} startIcon={<Home fontSize="small" />}>Home</Button>
            <IconButton onClick={handleProfileMenu} sx={{ p: 0.5 }}>
              <Avatar sx={{ width: 36, height: 36, bgcolor: '#c0392b', fontWeight: 700, fontSize: 15 }}>{user?.name?.split(' ').map(n=>n[0]).slice(0,2).join('')}</Avatar>
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu} PaperProps={{ sx: { borderRadius: 3, mt: 1.5, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' } }}>
              <MenuItem onClick={() => { handleCloseMenu(); navigate('/profile'); }}><Person sx={{ mr: 1.5, color: '#0f4c81' }} /> Profile</MenuItem>
              <Divider />
              <MenuItem onClick={doLogout} sx={{ color: '#c0392b' }}><Logout sx={{ mr: 1.5 }} /> Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: collapsed ? 80 : drawerWidth }, flexShrink: { md: 0 }, transition: 'width 0.3s' }}>
        <Drawer variant="temporary" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, border: 'none' } }}>
          {drawer}
        </Drawer>
        <Drawer variant="permanent" sx={{ display: { xs: 'none', md: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: collapsed ? 80 : drawerWidth, border: 'none', overflowX: 'hidden', transition: 'width 0.3s' } }} open>
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, width: { md: `calc(100% - ${collapsed ? 80 : drawerWidth}px)` }, mt: 8, minHeight: '100vh', bgcolor: '#f0f4f8', transition: 'width 0.3s' }}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
