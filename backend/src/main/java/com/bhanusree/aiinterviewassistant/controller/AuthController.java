package com.bhanusree.aiinterviewassistant.controller;

import com.bhanusree.aiinterviewassistant.dto.AuthResponse;
import com.bhanusree.aiinterviewassistant.dto.LoginRequest;
import com.bhanusree.aiinterviewassistant.dto.RegisterRequest;
import com.bhanusree.aiinterviewassistant.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Public authentication endpoints (no JWT required).
 *
 *  POST /api/auth/register  – create a new account
 *  POST /api/auth/login     – authenticate and receive a JWT
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserService userService;

    // ── Register ──────────────────────────────────────────────────────────

    @PostMapping("/register")
    public ResponseEntity<String> register(
            @RequestBody RegisterRequest request) {

        String result = userService.register(request);

        if (result.equals("Email already exists")) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(result);
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    // ── Login ─────────────────────────────────────────────────────────────

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request) {

        try {
            AuthResponse response = userService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(e.getMessage());
        }
    }
}