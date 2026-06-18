package com.bhanusree.aiinterviewassistant.controller;

import com.bhanusree.aiinterviewassistant.dto.EvaluateRequest;
import com.bhanusree.aiinterviewassistant.dto.EvaluationResponse;
import com.bhanusree.aiinterviewassistant.dto.GenerateQuestionRequest;
import com.bhanusree.aiinterviewassistant.dto.InterviewRequest;
import com.bhanusree.aiinterviewassistant.entity.InterviewSession;
import com.bhanusree.aiinterviewassistant.service.AIService;
import com.bhanusree.aiinterviewassistant.service.InterviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Interview endpoints — all protected by JWT (configured in SecurityConfig).
 *
 * The logged-in user's identity is extracted from the JWT via the
 * Authentication object injected by Spring Security.
 *
 *  POST /api/interview/start            – start a new session
 *  GET  /api/interview/history          – get current user's history
 *  POST /api/interview/generate-question – generate an AI question
 *  POST /api/interview/evaluate         – evaluate answer (structured JSON)
 */
@RestController
@RequestMapping("/api/interview")
@CrossOrigin(origins = "http://localhost:3000")
public class InterviewController {

    @Autowired
    private InterviewService interviewService;

    @Autowired
    private AIService aiService;

    // ── Start Interview ───────────────────────────────────────────────────

    /**
     * Start a new interview session.
     * The user is resolved from the JWT — no userId needed in the request body.
     *
     * @param request        { "category": "Java" }
     * @param authentication injected by Spring Security from the JWT
     */
    @PostMapping("/start")
    public ResponseEntity<InterviewSession> startInterview(
            @RequestBody InterviewRequest request,
            Authentication authentication) {

        String email = authentication.getName();
        InterviewSession session =
                interviewService.startInterview(request.getCategory(), email);
        return ResponseEntity.ok(session);
    }

    // ── Interview History ─────────────────────────────────────────────────

    /**
     * Get interview history for the currently logged-in user.
     *
     * @param authentication injected by Spring Security from the JWT
     */
    @GetMapping("/history")
    public ResponseEntity<List<InterviewSession>> history(
            Authentication authentication) {

        String email = authentication.getName();
        List<InterviewSession> history =
                interviewService.getUserHistory(email);
        return ResponseEntity.ok(history);
    }

    // ── Generate Question ────────────────────────────────────────────────

    /**
     * Ask the AI to generate an interview question for the given category.
     *
     * Request:  { "category": "Java" }
     * Response: { "question": "What is the difference between..." }
     */
    @PostMapping("/generate-question")
    public ResponseEntity<Map<String, String>> generateQuestion(
            @RequestBody GenerateQuestionRequest request) {

        String question = aiService.generateQuestion(request.getCategory());
        return ResponseEntity.ok(Map.of("question", question));
    }

    // ── Evaluate Answer (Structured JSON) ─────────────────────────────────

    /**
     * Evaluate a candidate's answer using AI.
     *
     * Request:  { "question": "...", "answer": "..." }
     * Response: { "score": 8, "strengths": [...], "weaknesses": [...], "improvedAnswer": "..." }
     */
    @PostMapping("/evaluate")
    public ResponseEntity<EvaluationResponse> evaluateAnswer(
            @RequestBody EvaluateRequest request) {

        EvaluationResponse response =
                aiService.evaluateAnswer(request.getQuestion(), request.getAnswer());
        return ResponseEntity.ok(response);
    }
}