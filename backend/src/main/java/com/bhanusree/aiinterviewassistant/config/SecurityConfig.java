package com.bhanusree.aiinterviewassistant.config;

import com.bhanusree.aiinterviewassistant.filter.JwtFilter;
import com.bhanusree.aiinterviewassistant.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Spring Security configuration.
 *
 * Public routes:  /api/auth/**  (register + login)
 * Protected:      /api/interview/**  (requires valid JWT)
 *
 * Session management is STATELESS – all auth state is carried in the JWT.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    // ── Password Encoder ─────────────────────────────────────────────────

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // ── Authentication Provider ──────────────────────────────────────────

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        // Spring Security 7 (Spring Boot 4): constructor requires UserDetailsService
        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider(customUserDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    // ── Authentication Manager ───────────────────────────────────────────

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // ── CORS ─────────────────────────────────────────────────────────────

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        corsConfig.setAllowedOrigins(List.of("http://localhost:3000"));
        corsConfig.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        corsConfig.setAllowedHeaders(List.of("*"));
        corsConfig.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);
        return source;
    }

    // ── Security Filter Chain ─────────────────────────────────────────────

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Use the centralised CORS config defined above
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // Disable CSRF – not needed for stateless JWT APIs
            .csrf(AbstractHttpConfigurer::disable)

            // Route authorization rules
            .authorizeHttpRequests(auth -> auth
                // Auth endpoints are public (register + login)
                .requestMatchers("/api/auth/**").permitAll()
                // Everything else requires authentication
                .anyRequest().authenticated()
            )

            // Stateless session – no HttpSession
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // Wire our auth provider
            .authenticationProvider(authenticationProvider())

            // Insert JWT filter before the standard username/password filter
            .addFilterBefore(jwtFilter,
                    UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
