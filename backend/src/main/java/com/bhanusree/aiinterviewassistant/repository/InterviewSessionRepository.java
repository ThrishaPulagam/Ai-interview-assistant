package com.bhanusree.aiinterviewassistant.repository;

import com.bhanusree.aiinterviewassistant.entity.InterviewSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface InterviewSessionRepository
        extends JpaRepository<InterviewSession, Long> {

    /** History by userId (kept for backward-compat) */
    List<InterviewSession> findByUserId(Long userId);

    /** History for currently logged-in user (resolved by email from JWT) */
    List<InterviewSession> findByUserEmail(String email);

    // ── Analytics Queries ────────────────────────────────────────────────

    /** Total number of sessions for a user */
    long countByUserEmail(String email);

    /**
     * Average score across all sessions for a user.
     * Returns null if the user has no sessions.
     */
    @Query("SELECT AVG(s.score) FROM InterviewSession s WHERE s.user.email = :email")
    Double findAverageScoreByUserEmail(@Param("email") String email);

    /**
     * Returns [category, avgScore] pairs ordered by avgScore DESC.
     * First row → strongest topic.
     */
    @Query("""
            SELECT s.category, AVG(s.score) AS avgScore
            FROM InterviewSession s
            WHERE s.user.email = :email
            GROUP BY s.category
            ORDER BY avgScore DESC
            """)
    List<Object[]> findCategoryScoresByUserEmailOrderedDesc(@Param("email") String email);
}