package com.bhanusree.aiinterviewassistant.dto;

/**
 * Response DTO returned by the login endpoint.
 * Carries the JWT token and the authenticated user's name.
 */
public class AuthResponse {

    private String token;
    private String name;
    private String email;

    public AuthResponse() {}

    public AuthResponse(String token, String name, String email) {
        this.token = token;
        this.name = name;
        this.email = email;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
