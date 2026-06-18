package com.bhanusree.aiinterviewassistant.service;

import com.bhanusree.aiinterviewassistant.dto.AuthResponse;
import com.bhanusree.aiinterviewassistant.dto.LoginRequest;
import com.bhanusree.aiinterviewassistant.dto.RegisterRequest;
import com.bhanusree.aiinterviewassistant.entity.User;
import com.bhanusree.aiinterviewassistant.repository.UserRepository;
import com.bhanusree.aiinterviewassistant.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * User service handling registration and login with JWT generation.
 */
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // ── Register ─────────────────────────────────────────────────────────

    /**
     * Register a new user.
     * Encodes the password with BCrypt before saving.
     *
     * @return success/error message
     */
    public String register(RegisterRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return "Email already exists";
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        // Encode password before storing
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepository.save(user);
        return "User Registered Successfully";
    }

    // ── Login ─────────────────────────────────────────────────────────────

    /**
     * Authenticate a user and return a JWT token wrapped in AuthResponse.
     *
     * @return AuthResponse containing token, name and email
     * @throws RuntimeException if credentials are invalid
     */
    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(token, user.getName(), user.getEmail());
    }
}