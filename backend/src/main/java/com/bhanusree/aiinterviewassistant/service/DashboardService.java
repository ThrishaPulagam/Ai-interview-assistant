package com.bhanusree.aiinterviewassistant.service;

import com.bhanusree.aiinterviewassistant.dto.DashboardResponse;
import com.bhanusree.aiinterviewassistant.repository.InterviewSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service that computes per-user dashboard analytics:
 *  - total interview sessions
 *  - average score across all sessions
 *  - strongest topic (category with highest avg score)
 *  - weakest topic  (category with lowest  avg score)
 *
 * The user is always identified by their email, extracted from the JWT.
 */
@Service
public class DashboardService {

    @Autowired
    private InterviewSessionRepository sessionRepository;

    /**
     * Build a full DashboardResponse for the given user email.
     *
     * @param email the authenticated user's email (from JWT subject)
     * @return DashboardResponse with all four analytics fields
     */
    public DashboardResponse getDashboard(String email) {

        // ── Total interviews ─────────────────────────────────────────────
        long total = sessionRepository.countByUserEmail(email);

        // ── Average score ────────────────────────────────────────────────
        Double avg = sessionRepository.findAverageScoreByUserEmail(email);
        // Round to 1 decimal; default 0.0 when no sessions exist
        double averageScore = (avg != null)
                ? Math.round(avg * 10.0) / 10.0
                : 0.0;

        // ── Strongest & weakest topic ────────────────────────────────────
        // Returns rows ordered by avgScore DESC  →  first = strongest, last = weakest
        List<Object[]> categoryScores =
                sessionRepository.findCategoryScoresByUserEmailOrderedDesc(email);

        String strongestTopic = "N/A";
        String weakestTopic   = "N/A";

        if (!categoryScores.isEmpty()) {
            // First row has the highest average → strongest
            strongestTopic = (String) categoryScores.get(0)[0];
            // Last row has the lowest average → weakest
            weakestTopic = (String) categoryScores.get(categoryScores.size() - 1)[0];
        }

        return new DashboardResponse(total, averageScore, strongestTopic, weakestTopic);
    }
}
