import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeContext';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import {
  AppBar, Toolbar, Typography, Box, Drawer, List, ListItem,
  ListItemButton, ListItemIcon, ListItemText, IconButton, Avatar, Menu, MenuItem, Divider, Tooltip, Button, Badge
} from '@mui/material';
import {
  Menu as MenuIcon, Dashboard, School, Book, Grade, Description,
  Assessment, Campaign, People, Logout, Home, Person, ChevronLeft, ChevronRight,
  Notifications as NotificationsIcon, DarkMode, LightMode, Circle
} from '@mui/icons-material';

const drawerWidth = 280;

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const { mode, toggleMode } = useThemeMode();
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isDark = mode === 'dark';

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifAnchor, setNotifAnchor] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifCount, setNotifCount] = useState(0);

  // Fetch latest announcements as notifications
  useEffect(() => {
    axios.get('/api/announcements').then(res => {
      const latest = res.data.slice(0, 5);
      setNotifications(latest);
      setNotifCount(latest.length);
    }).catch(() => {});
  }, []);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleProfileMenu = (e) => setAnchorEl(e.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);
  const handleNotifOpen = (e) => setNotifAnchor(e.currentTarget);
  const handleNotifClose = () => setNotifAnchor(null);
  const markRead = () => { setNotifCount(0); handleNotifClose(); };
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
    bgcolor: isDark ? 'rgba(96,165,250,0.15)' : 'rgba(15,76,129,0.08)',
    borderLeft: `4px solid ${isDark ? '#60a5fa' : '#0f4c81'}`,
    '&:hover': { bgcolor: isDark ? 'rgba(96,165,250,0.22)' : 'rgba(15,76,129,0.12)' }
  };

  const inactiveStyle = {
    borderLeft: '4px solid transparent',
    '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }
  };

  const drawerBg = isDark ? '#050b14' : '#ffffff';
  const drawerText = isDark ? 'white' : '#1a2a3a';
  const drawerBorder = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)';
  const dividerColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const iconInactive = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)';
  const iconActive = isDark ? '#60a5fa' : '#0f4c81';
  const textInactive = isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)';
  const textActive = isDark ? '#ffffff' : '#1a2a3a';
  const userCardBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';
  const userCardBorder = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  const drawer = (
    <Box sx={{
      height: '100%', display: 'flex', flexDirection: 'column',
      bgcolor: drawerBg, color: drawerText,
      borderRight: `1px solid ${drawerBorder}`,
    }}>
      <Box sx={{
        p: collapsed ? 1.5 : 3,
        pb: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : undefined,
        gap: 2,
        position: 'relative',
      }}>
        <Box sx={{
          width: 44, height: 44, borderRadius: 2.5,
          background: 'linear-gradient(135deg, #0f4c81, #2980b9)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, fontSize: 18, color: 'white',
          boxShadow: '0 4px 20px rgba(15,76,129,0.4)',
          flexShrink: 0,
        }}>R</Box>
        {!collapsed && (
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.02em', color: drawerText }}>RMS</Typography>
            <Typography variant="caption" sx={{ opacity: 0.5, lineHeight: 1, color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)' }}>Registrar System</Typography>
          </Box>
        )}
        <IconButton
          onClick={() => setCollapsed(!collapsed)}
          sx={{
            color: drawerText,
            opacity: 0.6,
            '&:hover': { opacity: 1 },
            ...(collapsed && {
              position: 'absolute',
              right: 4,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 28,
              height: 28,
            }),
          }}
          size="small"
        >
          {collapsed ? <ChevronRight fontSize="small" /> : <ChevronLeft fontSize="small" />}
        </IconButton>
      </Box>
      <Divider sx={{ borderColor: dividerColor, mx: 2 }} />
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
                  sx={{ borderRadius: 2, color: textInactive, py: 1, ...(isActive ? activeStyle : inactiveStyle) }}
                >
                  <ListItemIcon sx={{ color: isActive ? iconActive : iconInactive, minWidth: collapsed ? 0 : 40, mr: collapsed ? 0 : undefined }}>{item.icon}</ListItemIcon>
                  {!collapsed && <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: isActive ? 600 : 400, fontSize: 15, color: isActive ? textActive : textInactive }} />}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>
      <Box sx={{ mt: 'auto', p: 2 }}>
        {!collapsed && (
          <Box sx={{
            bgcolor: userCardBg, borderRadius: 2, p: 2,
            border: `1px solid ${userCardBorder}`,
          }}>
            <Typography variant="caption" sx={{ opacity: 0.5, color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)' }}>Logged in as</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: drawerText }}>{user?.name}</Typography>
            <Typography variant="caption" sx={{ opacity: 0.5, textTransform: 'capitalize', color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>{user?.role?.replace('_', ' ')}</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );

  const appBarBg = isDark ? 'rgba(5,11,20,0.85)' : 'rgba(255,255,255,0.85)';
  const appBarBorder = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const appBarText = isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)';
  const menuBg = isDark ? '#0d1b2f' : '#ffffff';
  const menuBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const menuText = isDark ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)';
  const mainBg = isDark ? '#050b14' : '#f0f4f8';

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" elevation={0} sx={{
        width: { md: `calc(100% - ${collapsed ? 80 : drawerWidth}px)` },
        ml: { md: `${collapsed ? 80 : drawerWidth}px` },
        bgcolor: appBarBg,
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${appBarBorder}`,
        color: isDark ? '#ffffff' : '#1a2a3a',
        transition: 'width 0.3s, margin-left 0.3s',
      }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { md: 'none' } }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: appBarText }}>
              {menuItems.find(m => m.path === location.pathname)?.text || 'Page'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {/* Notification Bell */}
            <IconButton onClick={handleNotifOpen} sx={{ color: appBarText }}>
              <Badge badgeContent={notifCount} color="error" overlap="circular">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Menu
              anchorEl={notifAnchor}
              open={Boolean(notifAnchor)}
              onClose={handleNotifClose}
              PaperProps={{
                sx: {
                  width: 340,
                  maxHeight: 420,
                  mt: 1.5,
                  borderRadius: 3,
                  bgcolor: menuBg,
                  border: `1px solid ${menuBorder}`,
                  boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.12)',
                  overflow: 'hidden',
                }
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <Box sx={{ p: 2.5, borderBottom: `1px solid ${menuBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: drawerText }}>Notifications</Typography>
                {notifCount > 0 && (
                  <Button size="small" onClick={markRead} sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.75rem', color: '#60a5fa' }}>
                    Mark all read
                  </Button>
                )}
              </Box>
              {notifications.length === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <NotificationsIcon sx={{ fontSize: 40, color: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)', mb: 1 }} />
                  <Typography variant="body2" sx={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}>No notifications</Typography>
                </Box>
              ) : (
                notifications.map((n) => (
                  <MenuItem
                    key={n._id}
                    onClick={() => { handleNotifClose(); navigate('/announcements'); }}
                    sx={{
                      py: 1.5, px: 2.5,
                      borderBottom: `1px solid ${menuBorder}`,
                      '&:last-child': { borderBottom: 'none' },
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', width: '100%' }}>
                      <Circle sx={{ fontSize: 10, color: '#60a5fa', mt: 0.8 }} />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: drawerText, lineHeight: 1.4, mb: 0.3 }} noWrap>{n.title}</Typography>
                        <Typography variant="caption" sx={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', display: 'block' }} noWrap>{n.content?.substring(0, 60)}...</Typography>
                        <Typography variant="caption" sx={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)', mt: 0.5, display: 'block' }}>{new Date(n.createdAt).toLocaleDateString('en-GB')}</Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))
              )}
            </Menu>

            {/* Dark/Light Toggle */}
            <Tooltip title={isDark ? 'Switch to light mode' : 'Switch to dark mode'} arrow>
              <IconButton onClick={toggleMode} sx={{ color: appBarText }}>
                {isDark ? <LightMode /> : <DarkMode />}
              </IconButton>
            </Tooltip>

            <Button component={Link} to="/" sx={{ color: appBarText, textTransform: 'none', fontWeight: 500, '&:hover': { color: isDark ? 'white' : '#0f4c81' } }} startIcon={<Home fontSize="small" />}>Home</Button>
            <IconButton onClick={handleProfileMenu} sx={{ p: 0.5 }}>
              <Avatar sx={{ width: 36, height: 36, bgcolor: '#0f4c81', fontWeight: 700, fontSize: 15, border: `2px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` }}>{user?.name?.split(' ').map(n=>n[0]).slice(0,2).join('')}</Avatar>
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu} PaperProps={{ sx: {
              borderRadius: 3, mt: 1.5,
              bgcolor: menuBg,
              border: `1px solid ${menuBorder}`,
              boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.12)',
            } }}>
              <MenuItem onClick={() => { handleCloseMenu(); navigate('/profile'); }} sx={{ color: menuText }}><Person sx={{ mr: 1.5, color: '#60a5fa' }} /> Profile</MenuItem>
              <Divider sx={{ borderColor: dividerColor }} />
              <MenuItem onClick={doLogout} sx={{ color: '#f87171' }}><Logout sx={{ mr: 1.5 }} /> Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: collapsed ? 80 : drawerWidth }, flexShrink: { md: 0 }, transition: 'width 0.3s' }}>
        <Drawer variant="temporary" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, border: 'none', bgcolor: drawerBg } }}>
          {drawer}
        </Drawer>
        <Drawer variant="permanent" sx={{ display: { xs: 'none', md: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: collapsed ? 80 : drawerWidth, border: 'none', overflowX: 'hidden', transition: 'width 0.3s', bgcolor: drawerBg } }} open>
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{
        flexGrow: 1,
        p: { xs: 2, md: 4 },
        width: { md: `calc(100% - ${collapsed ? 80 : drawerWidth}px)` },
        mt: 8,
        minHeight: '100vh',
        bgcolor: mainBg,
        transition: 'width 0.3s',
      }}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
