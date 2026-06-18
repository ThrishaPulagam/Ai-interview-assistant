package com.bhanusree.aiinterviewassistant.repository;

import com.bhanusree.aiinterviewassistant.entity.InterviewQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InterviewQuestionRepository
        extends JpaRepository<InterviewQuestion, Long> {
}