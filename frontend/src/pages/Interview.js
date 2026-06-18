import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Paper, Divider, Chip, Grid } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import API from '../services/api';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';

function Interview() {
    const [category, setCategory] = useState("");
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [feedback, setFeedback] = useState(null);
    const [loadingQuestion, setLoadingQuestion] = useState(false);
    const [loadingFeedback, setLoadingFeedback] = useState(false);

    const generateQuestion = async () => {
        if (!category.trim()) {
            toast.error("Please enter a topic category first");
            return;
        }
        setLoadingQuestion(true);
        setQuestion("");
        setAnswer("");
        setFeedback(null);
        
        const loadingToast = toast.loading('Generating interview question...');
        
        try {
            await API.post("/api/interview/start", { category });
            const res = await API.post("/api/interview/generate-question", { category });
            setQuestion(res.data.question);
            toast.success("Question generated!", { id: loadingToast });
        } catch (err) {
            toast.error("Failed to generate question. Please try again.", { id: loadingToast });
            console.error(err);
        } finally {
            setLoadingQuestion(false);
        }
    };

    const evaluateAnswer = async () => {
        if (!answer.trim()) {
            toast.error("Please provide an answer before submitting");
            return;
        }
        setLoadingFeedback(true);
        const loadingToast = toast.loading('AI is evaluating your answer...');
        
        try {
            const res = await API.post("/api/interview/evaluate", { question, answer });
            setFeedback(res.data);
            toast.success("Evaluation complete!", { id: loadingToast });
        } catch (err) {
            toast.error("Failed to evaluate answer.", { id: loadingToast });
            console.error(err);
        } finally {
            setLoadingFeedback(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ pb: 6 }}>
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <Box sx={{ mb: { xs: 4, md: 5 } }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.5px' }}>
                        Practice Interview
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                        Choose a topic, get an AI-generated question, and receive instant, structured feedback.
                    </Typography>
                </Box>

                <Paper elevation={1} sx={{ p: { xs: 3, md: 4 }, mb: 4, borderRadius: 3, borderLeft: '6px solid', borderColor: 'primary.main' }}>
                    <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' }, alignItems: { sm: 'flex-start' } }}>
                        <TextField
                            fullWidth
                            label="Interview Topic (e.g., Java, React, System Design)"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            disabled={loadingQuestion}
                            InputProps={{ sx: { borderRadius: 2 } }}
                        />
                        <Button 
                            variant="contained" 
                            size="large" 
                            onClick={generateQuestion}
                            disabled={loadingQuestion}
                            startIcon={<PlayArrowIcon />}
                            sx={{ minWidth: { sm: 200 }, height: 56, borderRadius: 2 }}
                        >
                            {loadingQuestion ? "Starting..." : "Start Session"}
                        </Button>
                    </Box>
                </Paper>

                <AnimatePresence>
                    {question && (
                        <motion.div
                            initial={{ opacity: 0, height: 0, y: 20 }}
                            animate={{ opacity: 1, height: 'auto', y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <Paper elevation={1} sx={{ p: { xs: 3, md: 4 }, mb: 4, borderRadius: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Chip label="Question" color="primary" size="small" sx={{ fontWeight: 600, mr: 2 }} />
                                    <Typography variant="subtitle2" color="text.secondary">AI Interviewer</Typography>
                                </Box>
                                <Typography variant="body1" sx={{ mb: 4, fontSize: '1.15rem', color: 'text.primary', lineHeight: 1.6 }}>
                                    {question}
                                </Typography>

                                <TextField
                                    fullWidth
                                    multiline
                                    rows={6}
                                    label="Your Answer"
                                    placeholder="Type your response here as if you were speaking in an interview..."
                                    variant="outlined"
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    disabled={loadingFeedback}
                                    sx={{ mb: 3 }}
                                    InputProps={{ sx: { borderRadius: 2 } }}
                                />
                                
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button 
                                        variant="contained" 
                                        color="secondary"
                                        size="large" 
                                        onClick={evaluateAnswer}
                                        disabled={loadingFeedback || !answer.trim()}
                                        endIcon={<SendIcon />}
                                        sx={{ minWidth: 200, borderRadius: 2 }}
                                    >
                                        {loadingFeedback ? "Evaluating..." : "Submit Answer"}
                                    </Button>
                                </Box>
                            </Paper>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {feedback && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <Paper elevation={1} sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, overflow: 'hidden' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                    <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
                                        Evaluation Results
                                    </Typography>
                                    <Chip 
                                        label={`Score: ${feedback.score}/10`} 
                                        sx={{ 
                                            fontWeight: 800, fontSize: '1rem', py: 2.5, px: 1,
                                            bgcolor: feedback.score >= 7 ? '#d1fae5' : feedback.score >= 4 ? '#fef3c7' : '#fee2e2',
                                            color: feedback.score >= 7 ? '#065f46' : feedback.score >= 4 ? '#92400e' : '#991b1b'
                                        }} 
                                    />
                                </Box>
                                
                                <Divider sx={{ my: 3 }} />
                                
                                <Grid container spacing={4}>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="h6" sx={{ mb: 2, color: '#059669', display: 'flex', alignItems: 'center', fontWeight: 700 }}>
                                            <CheckCircleOutlineIcon sx={{ mr: 1 }} /> Strengths
                                        </Typography>
                                        <Box component="ul" sx={{ pl: 2, m: 0 }}>
                                            {feedback.strengths?.map((s, i) => (
                                                <Typography component="li" variant="body1" key={i} sx={{ mb: 1, color: 'text.secondary' }}>{s}</Typography>
                                            ))}
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="h6" sx={{ mb: 2, color: '#dc2626', display: 'flex', alignItems: 'center', fontWeight: 700 }}>
                                            <LightbulbOutlinedIcon sx={{ mr: 1 }} /> Areas for Improvement
                                        </Typography>
                                        <Box component="ul" sx={{ pl: 2, m: 0 }}>
                                            {feedback.weaknesses?.map((w, i) => (
                                                <Typography component="li" variant="body1" key={i} sx={{ mb: 1, color: 'text.secondary' }}>{w}</Typography>
                                            ))}
                                        </Box>
                                    </Grid>
                                </Grid>

                                <Box sx={{ mt: 4, p: 3, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 700, color: '#334155' }}>
                                        Ideal Answer Example:
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.6 }}>
                                        {feedback.improvedAnswer}
                                    </Typography>
                                </Box>
                            </Paper>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </Container>
    );
}

export default Interview;
