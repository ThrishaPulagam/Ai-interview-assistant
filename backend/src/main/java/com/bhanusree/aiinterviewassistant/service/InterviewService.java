package com.bhanusree.aiinterviewassistant.service;

import com.bhanusree.aiinterviewassistant.entity.InterviewSession;
import com.bhanusree.aiinterviewassistant.entity.User;
import com.bhanusree.aiinterviewassistant.repository.InterviewSessionRepository;
import com.bhanusree.aiinterviewassistant.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Interview service.
 * User identity is resolved from the email extracted from the JWT token —
 * no manual userId passing required.
 */
@Service
public class InterviewService {

    @Autowired
    private InterviewSessionRepository sessionRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Start a new interview session for the currently authenticated user.
     *
     * @param category the interview category (e.g. "Java", "Spring Boot")
     * @param email    the email extracted from the JWT (via SecurityContext)
     * @return the persisted InterviewSession
     */
    public InterviewSession startInterview(String category, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException(
                        "Authenticated user not found: " + email));

        InterviewSession session = new InterviewSession();
        session.setCategory(category);
        session.setUser(user);

        return sessionRepository.save(session);
    }

    /**
     * Retrieve the interview history for the currently authenticated user.
     *
     * @param email the email extracted from the JWT (via SecurityContext)
     * @return list of all sessions belonging to this user
     */
    public List<InterviewSession> getUserHistory(String email) {
        return sessionRepository.findByUserEmail(email);
    }
}