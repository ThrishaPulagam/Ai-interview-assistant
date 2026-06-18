package com.bhanusree.aiinterviewassistant.controller;

import com.bhanusree.aiinterviewassistant.dto.DashboardResponse;
import com.bhanusree.aiinterviewassistant.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * Dashboard analytics endpoint — protected by JWT.
 *
 * GET /api/interview/dashboard → returns user-specific analytics:
 *   totalInterviews, averageScore, strongestTopic, weakestTopic
 *
 * The user is extracted from the JWT token (no userId in URL).
 */
@RestController
@RequestMapping("/api/interview")
@CrossOrigin(origins = "http://localhost:3000")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardResponse> getDashboard(
            Authentication authentication) {

        String email = authentication.getName(); // from JWT subject
        DashboardResponse dashboard = dashboardService.getDashboard(email);
        return ResponseEntity.ok(dashboard);
    }
}
