package com.bhanusree.aiinterviewassistant.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.function.Function;

/**
 * Utility class for JWT operations: generation, parsing, and validation.
 * Uses JJWT 0.12.x API with HMAC-SHA256 signing.
 */
@Component
public class JwtUtil {

    // Minimum 32-byte key required for HS256
    private static final String SECRET =
            "mySecretKeyForJWTmySecretKeyForJWT12";

    // 1 hour expiration in milliseconds
    private static final long EXPIRATION_MS = 1000L * 60 * 60;

    private final SecretKey signingKey =
            Keys.hmacShaKeyFor(SECRET.getBytes());

    // ── Token Generation ──────────────────────────────────────────────────

    /**
     * Generate a signed JWT for the given username (email).
     */
    public String generateToken(String username) {
        return Jwts.builder()
                .subject(username)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
                .signWith(signingKey)
                .compact();
    }

    // ── Token Parsing ────────────────────────────────────────────────────

    /**
     * Extract the username (subject) from a JWT.
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extract the expiration date from a JWT.
     */
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Generic claim extractor using a resolver function.
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // ── Token Validation ─────────────────────────────────────────────────

    /**
     * Returns true if the token is valid and not expired for the given user.
     */
    public boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }
}
