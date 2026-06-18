import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Skeleton, Box, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import API from '../services/api';

function History() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await API.get('/api/interview/history');
                setHistory(res.data);
            } catch (err) {
                console.error("Failed to fetch history", err);
                toast.error("Failed to load history data");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const renderSkeletonTable = () => (
        <TableContainer component={Paper} elevation={1} sx={{ borderRadius: 3 }}>
            <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                    <TableRow>
                        <TableCell><Skeleton width={80} /></TableCell>
                        <TableCell><Skeleton width={120} /></TableCell>
                        <TableCell><Skeleton width={150} /></TableCell>
                        <TableCell><Skeleton width={60} /></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {[1, 2, 3, 4, 5].map((item) => (
                        <TableRow key={item}>
                            <TableCell><Skeleton width={60} /></TableCell>
                            <TableCell><Skeleton width={100} /></TableCell>
                            <TableCell><Skeleton width={140} /></TableCell>
                            <TableCell><Skeleton width={40} /></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );

    return (
        <Container maxWidth="lg" sx={{ pb: 6 }}>
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <Box sx={{ mb: { xs: 4, md: 5 } }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.5px' }}>
                        Session History
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                        Review your past interview sessions and track your improvement.
                    </Typography>
                </Box>

                {loading ? renderSkeletonTable() : (
                    <TableContainer component={Paper} elevation={1} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                        <Table sx={{ minWidth: 650 }}>
                            <TableHead sx={{ bgcolor: '#f8fafc' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 600, color: 'text.secondary', borderBottom: '2px solid #e2e8f0' }}>Session ID</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: 'text.secondary', borderBottom: '2px solid #e2e8f0' }}>Topic Category</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: 'text.secondary', borderBottom: '2px solid #e2e8f0' }}>Date & Time</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: 'text.secondary', borderBottom: '2px solid #e2e8f0' }}>Score</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {history.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                                            <Typography variant="body1" color="text.secondary">
                                                No past interview sessions found. Start an interview to see it here!
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    history.map((session) => (
                                        <TableRow 
                                            key={session.id} 
                                            sx={{ 
                                                '&:last-child td, &:last-child th': { border: 0 },
                                                '&:hover': { bgcolor: '#f1f5f9' },
                                                transition: 'background-color 0.2s ease'
                                            }}
                                        >
                                            <TableCell component="th" scope="row" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                                                #{session.id}
                                            </TableCell>
                                            <TableCell>
                                                <Chip label={session.category} size="small" sx={{ bgcolor: '#e0e7ff', color: '#3730a3', fontWeight: 600 }} />
                                            </TableCell>
                                            <TableCell sx={{ color: 'text.secondary' }}>
                                                {new Date(session.createdAt).toLocaleDateString()} {new Date(session.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </TableCell>
                                            <TableCell>
                                                <Typography 
                                                    variant="body2" 
                                                    sx={{ 
                                                        fontWeight: 700, 
                                                        color: session.score >= 7 ? '#10b981' : session.score >= 4 ? '#f59e0b' : '#ef4444' 
                                                    }}
                                                >
                                                    {session.score}/10
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </motion.div>
        </Container>
    );
}

export default History;
