package com.bhanusree.aiinterviewassistant.dto;

/**
 * Response DTO for the dashboard analytics endpoint.
 *
 * Example:
 * {
 *   "totalInterviews": 10,
 *   "averageScore": 7.5,
 *   "strongestTopic": "Java",
 *   "weakestTopic": "DBMS"
 * }
 */
public class DashboardResponse {

    private long totalInterviews;
    private double averageScore;
    private String strongestTopic;
    private String weakestTopic;

    public DashboardResponse() {}

    public DashboardResponse(long totalInterviews,
                             double averageScore,
                             String strongestTopic,
                             String weakestTopic) {
        this.totalInterviews = totalInterviews;
        this.averageScore    = averageScore;
        this.strongestTopic  = strongestTopic;
        this.weakestTopic    = weakestTopic;
    }

    // ── Getters & Setters ────────────────────────────────────────────────

    public long getTotalInterviews() {
        return totalInterviews;
    }

    public void setTotalInterviews(long totalInterviews) {
        this.totalInterviews = totalInterviews;
    }

    public double getAverageScore() {
        return averageScore;
    }

    public void setAverageScore(double averageScore) {
        this.averageScore = averageScore;
    }

    public String getStrongestTopic() {
        return strongestTopic;
    }

    public void setStrongestTopic(String strongestTopic) {
        this.strongestTopic = strongestTopic;
    }

    public String getWeakestTopic() {
        return weakestTopic;
    }

    public void setWeakestTopic(String weakestTopic) {
        this.weakestTopic = weakestTopic;
    }
}
