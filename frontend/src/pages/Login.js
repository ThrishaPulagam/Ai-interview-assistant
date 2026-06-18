import React, { useState, useContext } from 'react';
import { Container, Paper, TextField, Button, Typography, Box } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        const loadingToast = toast.loading('Signing in...');
        
        try {
            const res = await API.post("/api/auth/login", { email, password });
            if (res.data && res.data.token) {
                login(res.data.token, res.data.name, res.data.email);
                toast.success('Successfully logged in!', { id: loadingToast });
                navigate("/dashboard");
            }
        } catch (err) {
            toast.error(err.response?.data || "Invalid credentials. Please try again.", { id: loadingToast });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="xs" sx={{ mt: { xs: 8, md: 12 } }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Paper elevation={3} sx={{ p: { xs: 3, md: 4 }, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 3 }}>
                    <Typography component="h1" variant="h4" sx={{ mb: 1, fontWeight: 800, color: 'primary.main' }}>
                        Welcome Back
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
                        Sign in to continue to AI Interviewer
                    </Typography>

                    <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            InputProps={{ sx: { borderRadius: 2 } }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{ sx: { borderRadius: 2 } }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={loading}
                            sx={{ mt: 4, mb: 3, py: 1.5, borderRadius: 2 }}
                        >
                            {loading ? "Signing In..." : "Sign In"}
                        </Button>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                Don't have an account?{' '}
                                <Link to="/register" style={{ textDecoration: 'none', color: '#2563eb', fontWeight: 600 }}>
                                    Sign Up
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </motion.div>
        </Container>
    );
}

export default Login;