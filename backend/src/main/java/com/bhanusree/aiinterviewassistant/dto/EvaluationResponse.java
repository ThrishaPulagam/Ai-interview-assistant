package com.bhanusree.aiinterviewassistant.dto;

import java.util.List;

/**
 * Structured response from AI answer evaluation.
 *
 * Example:
 * {
 *   "score": 8,
 *   "strengths": ["Good understanding of core concepts", "Clear explanation"],
 *   "weaknesses": ["Missing edge case handling"],
 *   "improvedAnswer": "A more comprehensive answer would be..."
 * }
 */
public class EvaluationResponse {

    private int score;
    private List<String> strengths;
    private List<String> weaknesses;
    private String improvedAnswer;

    public EvaluationResponse() {}

    public EvaluationResponse(int score,
                              List<String> strengths,
                              List<String> weaknesses,
                              String improvedAnswer) {
        this.score = score;
        this.strengths = strengths;
        this.weaknesses = weaknesses;
        this.improvedAnswer = improvedAnswer;
    }

    // ── Getters & Setters ────────────────────────────────────────────────

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public List<String> getStrengths() {
        return strengths;
    }

    public void setStrengths(List<String> strengths) {
        this.strengths = strengths;
    }

    public List<String> getWeaknesses() {
        return weaknesses;
    }

    public void setWeaknesses(List<String> weaknesses) {
        this.weaknesses = weaknesses;
    }

    public String getImprovedAnswer() {
        return improvedAnswer;
    }

    public void setImprovedAnswer(String improvedAnswer) {
        this.improvedAnswer = improvedAnswer;
    }
}
