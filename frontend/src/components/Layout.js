import React, { useContext, useState } from 'react';
import { Box, Drawer, AppBar, Toolbar, List, Typography, Divider, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import HistoryIcon from '@mui/icons-material/History';
import LogoutIcon from '@mui/icons-material/Logout';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { motion, AnimatePresence } from 'framer-motion';

const drawerWidth = 260;

const Layout = ({ children }) => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
        { text: 'Practice Interview', icon: <QuestionAnswerIcon />, path: '/interview' },
        { text: 'Session History', icon: <HistoryIcon />, path: '/history' }
    ];

    const drawerContent = (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: 'background.paper' }}>
            <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                    <SmartToyIcon />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', letterSpacing: '-0.5px' }}>
                    AI Interviewer
                </Typography>
            </Box>
            <Divider sx={{ mx: 2, mb: 2, borderColor: 'rgba(0,0,0,0.06)' }} />
            
            <List sx={{ px: 2, flexGrow: 1 }}>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                            <ListItemButton
                                onClick={() => {
                                    navigate(item.path);
                                    if (mobileOpen) setMobileOpen(false);
                                }}
                                sx={{
                                    borderRadius: 2,
                                    bgcolor: isActive ? 'primary.50' : 'transparent',
                                    color: isActive ? 'primary.main' : 'text.secondary',
                                    '&:hover': {
                                        bgcolor: isActive ? 'primary.100' : 'rgba(0,0,0,0.04)',
                                    }
                                }}
                            >
                                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText 
                                    primary={item.text} 
                                    primaryTypographyProps={{ 
                                        fontWeight: isActive ? 600 : 500,
                                        fontSize: '0.95rem'
                                    }} 
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            <Box sx={{ p: 2 }}>
                <Box sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 2, mb: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        {user?.name || 'User'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', wordBreak: 'break-all' }}>
                        {user?.email || 'user@example.com'}
                    </Typography>
                </Box>
                <ListItemButton 
                    onClick={handleLogout}
                    sx={{ borderRadius: 2, color: 'error.main', '&:hover': { bgcolor: 'error.50' } }}
                >
                    <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                        <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText primary="Log out" primaryTypographyProps={{ fontWeight: 600 }} />
                </ListItemButton>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
            {/* App Bar (Mobile only or Top Header) */}
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    bgcolor: 'background.default',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    display: { sm: 'none' } // Only show AppBar on mobile since Desktop has the Sidebar
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' }, color: 'text.primary' }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ color: 'text.primary', fontWeight: 600 }}>
                        {menuItems.find(i => i.path === location.pathname)?.text || 'AI Interviewer'}
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* Navigation Drawer */}
            <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: 'none' },
                    }}
                >
                    {drawerContent}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid rgba(0,0,0,0.08)' },
                    }}
                    open
                >
                    {drawerContent}
                </Drawer>
            </Box>

            {/* Main Content Area */}
            <Box
                component="main"
                sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, width: { sm: `calc(100% - ${drawerWidth}px)` }, pt: { xs: 10, sm: 4 } }}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        style={{ height: '100%' }}
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </Box>
        </Box>
    );
};

export default Layout;
