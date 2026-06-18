package com.bhanusree.aiinterviewassistant.dto;

/**
 * Request body for starting an interview session.
 * userId is intentionally removed — the user is extracted from the JWT token.
 */
public class InterviewRequest {

    private String category;

    public InterviewRequest() {}

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
}