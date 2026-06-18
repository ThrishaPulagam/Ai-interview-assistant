import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, Typography, Box, Skeleton, Paper } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import API from '../services/api';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StarIcon from '@mui/icons-material/Star';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const MotionCard = motion(Card);

function Dashboard() {
    const [analytics, setAnalytics] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [dashboardRes, historyRes] = await Promise.all([
                    API.get('/api/interview/dashboard'),
                    API.get('/api/interview/history')
                ]);
                setAnalytics(dashboardRes.data);
                setHistory(historyRes.data);
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
                toast.error("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const scoreProgressData = history
        .map(session => ({
            date: new Date(session.createdAt).toLocaleDateString(),
            score: session.score,
            time: new Date(session.createdAt).getTime()
        }))
        .sort((a, b) => a.time - b.time);

    const categoryStats = history.reduce((acc, session) => {
        if (!acc[session.category]) {
            acc[session.category] = { totalScore: 0, count: 0 };
        }
        acc[session.category].totalScore += session.score;
        acc[session.category].count += 1;
        return acc;
    }, {});

    const categoryPerformanceData = Object.keys(categoryStats).map(category => ({
        category,
        avgScore: parseFloat((categoryStats[category].totalScore / categoryStats[category].count).toFixed(1))
    }));

    // Skeleton loaders for KPI cards
    const renderSkeletonCard = () => (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Skeleton variant="circular" width={24} height={24} sx={{ mr: 1 }} />
                    <Skeleton variant="text" width="60%" height={32} />
                </Box>
                <Skeleton variant="text" width="40%" height={60} />
            </CardContent>
        </Card>
    );

    return (
        <Container maxWidth="xl" sx={{ pb: 6 }}>
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <Box sx={{ mb: { xs: 4, md: 6 } }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.5px' }}>
                        Dashboard Overview
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                        Track your performance and see where you can improve.
                    </Typography>
                </Box>

                {/* KPI Cards */}
                <Grid container spacing={3} sx={{ mb: { xs: 4, md: 6 } }}>
                    <Grid item xs={12} sm={6} md={3}>
                        {loading ? renderSkeletonCard() : (
                            <MotionCard whileHover={{ y: -4 }} sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#eff6ff' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <AssessmentIcon sx={{ color: '#2563eb', mr: 1 }} />
                                        <Typography variant="h6" color="text.secondary" sx={{ fontSize: '0.95rem' }}>Total Interviews</Typography>
                                    </Box>
                                    <Typography variant="h3" sx={{ fontWeight: 800, color: '#1e3a8a' }}>
                                        {analytics?.totalInterviews || 0}
                                    </Typography>
                                </CardContent>
                            </MotionCard>
                        )}
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        {loading ? renderSkeletonCard() : (
                            <MotionCard whileHover={{ y: -4 }} sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#ecfdf5' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <TrendingUpIcon sx={{ color: '#10b981', mr: 1 }} />
                                        <Typography variant="h6" color="text.secondary" sx={{ fontSize: '0.95rem' }}>Average Score</Typography>
                                    </Box>
                                    <Typography variant="h3" sx={{ fontWeight: 800, color: '#064e3b' }}>
                                        {analytics?.averageScore || 0}<Typography component="span" variant="h5" color="text.secondary">/10</Typography>
                                    </Typography>
                                </CardContent>
                            </MotionCard>
                        )}
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        {loading ? renderSkeletonCard() : (
                            <MotionCard whileHover={{ y: -4 }} sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#fffbeb' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <StarIcon sx={{ color: '#f59e0b', mr: 1 }} />
                                        <Typography variant="h6" color="text.secondary" sx={{ fontSize: '0.95rem' }}>Strongest Topic</Typography>
                                    </Box>
                                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#78350f', mt: 1 }}>
                                        {analytics?.strongestTopic || "N/A"}
                                    </Typography>
                                </CardContent>
                            </MotionCard>
                        )}
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        {loading ? renderSkeletonCard() : (
                            <MotionCard whileHover={{ y: -4 }} sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#fef2f2' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <ErrorOutlineIcon sx={{ color: '#ef4444', mr: 1 }} />
                                        <Typography variant="h6" color="text.secondary" sx={{ fontSize: '0.95rem' }}>Weakest Topic</Typography>
                                    </Box>
                                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#7f1d1d', mt: 1 }}>
                                        {analytics?.weakestTopic || "N/A"}
                                    </Typography>
                                </CardContent>
                            </MotionCard>
                        )}
                    </Grid>
                </Grid>

                {/* Charts */}
                <Grid container spacing={4}>
                    <Grid item xs={12} md={7}>
                        {loading ? (
                            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 3 }} />
                        ) : (
                            <Paper elevation={1} sx={{ p: 3, height: 400, borderRadius: 3 }}>
                                <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
                                    Score Progress Over Time
                                </Typography>
                                {scoreProgressData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="85%">
                                        <LineChart data={scoreProgressData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dy={10} />
                                            <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dx={-10} />
                                            <RechartsTooltip 
                                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            />
                                            <Line type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6, stroke: '#1d4ed8', strokeWidth: 2 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80%' }}>
                                        <Typography color="text.secondary">No data available for chart.</Typography>
                                    </Box>
                                )}
                            </Paper>
                        )}
                    </Grid>

                    <Grid item xs={12} md={5}>
                        {loading ? (
                            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 3 }} />
                        ) : (
                            <Paper elevation={1} sx={{ p: 3, height: 400, borderRadius: 3 }}>
                                <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
                                    Category Performance
                                </Typography>
                                {categoryPerformanceData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="85%">
                                        <BarChart data={categoryPerformanceData} margin={{ top: 5, right: 0, bottom: 5, left: -20 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                            <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dy={10} />
                                            <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dx={-10} />
                                            <RechartsTooltip 
                                                cursor={{fill: '#f1f5f9'}}
                                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            />
                                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                            <Bar dataKey="avgScore" name="Avg Score" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={50} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80%' }}>
                                        <Typography color="text.secondary">No data available for chart.</Typography>
                                    </Box>
                                )}
                            </Paper>
                        )}
                    </Grid>
                </Grid>
            </motion.div>
        </Container>
    );
}

export default Dashboard;