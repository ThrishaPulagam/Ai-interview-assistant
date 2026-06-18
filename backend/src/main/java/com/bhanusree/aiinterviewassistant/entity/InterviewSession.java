package com.bhanusree.aiinterviewassistant.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Represents a single interview session belonging to a User.
 * The user is resolved from the JWT token — not passed manually.
 */
@Entity
@Table(name = "interview_sessions")
public class InterviewSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String category;

    private Double score;

    private LocalDateTime createdAt;

    /** Many sessions belong to one User (FK: user_id) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public InterviewSession() {
        this.createdAt = LocalDateTime.now();
        this.score = 0.0;
    }

    // ── Getters & Setters ────────────────────────────────────────────────

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}