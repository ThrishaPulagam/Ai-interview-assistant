import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import API from '../services/api';

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        const loadingToast = toast.loading('Creating your account...');

        try {
            const res = await API.post("/api/auth/register", { name, email, password });
            if (res.status === 201) {
                toast.success("Account created successfully!", { id: loadingToast });
                setTimeout(() => navigate("/login"), 1500);
            } else {
                toast.error(res.data, { id: loadingToast });
            }
        } catch (err) {
            toast.error(err.response?.data || "Registration failed. Please try again.", { id: loadingToast });
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
                        Create Account
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
                        Start practicing your interview skills today.
                    </Typography>

                    <Box component="form" onSubmit={handleRegister} sx={{ width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label="Full Name"
                            name="name"
                            autoComplete="name"
                            autoFocus
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            InputProps={{ sx: { borderRadius: 2 } }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
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
                            autoComplete="new-password"
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
                            {loading ? "Creating Account..." : "Sign Up"}
                        </Button>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                Already have an account?{' '}
                                <Link to="/login" style={{ textDecoration: 'none', color: '#2563eb', fontWeight: 600 }}>
                                    Sign In
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </motion.div>
        </Container>
    );
}

export default Register;