import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import CodeIcon from '@mui/icons-material/Code';

const Navbar = () => {
    const { token, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <AppBar position="static" elevation={0} sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
            <Toolbar>
                <CodeIcon sx={{ mr: 2 }} />
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                    AI Interviewer
                </Typography>
                <Box>
                    {token ? (
                        <>
                            <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
                            <Button color="inherit" component={Link} to="/interview">Interview</Button>
                            <Button color="inherit" component={Link} to="/history">History</Button>
                            <Button color="inherit" onClick={handleLogout} sx={{ ml: 2, border: '1px solid rgba(255,255,255,0.5)' }}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button color="inherit" component={Link} to="/login">Login</Button>
                            <Button color="inherit" component={Link} to="/register">Register</Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
