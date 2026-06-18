package com.bhanusree.aiinterviewassistant.service;

import com.bhanusree.aiinterviewassistant.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * Spring Security UserDetailsService implementation.
 * Loads user credentials from the database by email (used as username).
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        com.bhanusree.aiinterviewassistant.entity.User appUser =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new UsernameNotFoundException(
                                        "User not found with email: " + email));

        // Build a Spring Security UserDetails with a single ROLE_USER authority
        return User.builder()
                .username(appUser.getEmail())
                .password(appUser.getPassword())   // already BCrypt-encoded
                .roles("USER")
                .build();
    }
}
