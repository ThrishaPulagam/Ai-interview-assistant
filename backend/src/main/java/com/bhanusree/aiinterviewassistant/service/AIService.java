package com.bhanusree.aiinterviewassistant.service;

import com.bhanusree.aiinterviewassistant.config.OpenRouterConfig;
import com.bhanusree.aiinterviewassistant.dto.EvaluationResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Service that communicates with the OpenRouter AI API.
 *
 *  - generateQuestion():  returns a plain-text interview question
 *  - evaluateAnswer():    returns a structured EvaluationResponse
 */
@Service
public class AIService {

    @Autowired
    private OpenRouterConfig openRouterConfig;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    // ── Generate Question (plain text) ───────────────────────────────────

    public String generateQuestion(String category) {

        String prompt =
                "Act as a technical interviewer. " +
                        "Generate one interview question for " +
                        category +
                        ". Return only the question.";

        return callAI(prompt);
    }

    // ── Evaluate Answer (structured JSON) ────────────────────────────────

    /**
     * Evaluate a candidate's answer and return a structured response.
     * The AI is instructed to return strict JSON which is then parsed
     * into an EvaluationResponse DTO.
     */
    public EvaluationResponse evaluateAnswer(String question, String answer) {

        String prompt =
                "You are a technical interviewer evaluating a candidate's answer.\n\n" +
                "Question: " + question + "\n" +
                "Candidate Answer: " + answer + "\n\n" +
                "Evaluate the answer and respond ONLY with valid JSON in this exact format " +
                "(no markdown, no code fences, no extra text):\n" +
                "{\n" +
                "  \"score\": <number from 1 to 10>,\n" +
                "  \"strengths\": [\"strength1\", \"strength2\"],\n" +
                "  \"weaknesses\": [\"weakness1\", \"weakness2\"],\n" +
                "  \"improvedAnswer\": \"A better answer would be...\"\n" +
                "}";

        String rawResponse = callAI(prompt);
        return parseEvaluationResponse(rawResponse);
    }

    // ── Internal: call the OpenRouter API ─────────────────────────────────

    private String callAI(String prompt) {

        String url =
                "https://openrouter.ai/api/v1/chat/completions";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(openRouterConfig.getApiKey());

        String requestBody = """
        {
          "model": "deepseek/deepseek-chat-v3",
          "messages": [
            {
              "role": "user",
              "content": "%s"
            }
          ],
          "temperature": 0.7
        }
        """.formatted(
                prompt.replace("\"", "\\\"")
                        .replace("\n", "\\n")
        );

        HttpEntity<String> entity =
                new HttpEntity<>(requestBody, headers);

        try {

            ResponseEntity<Map> response =
                    restTemplate.exchange(
                            url,
                            HttpMethod.POST,
                            entity,
                            Map.class
                    );

            List<Map<String, Object>> choices =
                    (List<Map<String, Object>>)
                            response.getBody().get("choices");

            Map<String, Object> choice = choices.get(0);

            Map<String, Object> message =
                    (Map<String, Object>) choice.get("message");

            return message.get("content").toString();

        } catch (Exception e) {
            e.printStackTrace();
            return "Error: " + e.getMessage();
        }
    }

    // ── Internal: parse AI response into EvaluationResponse ──────────────

    /**
     * Parses the AI's raw text into an EvaluationResponse.
     * Handles cases where the AI wraps JSON in markdown code fences.
     * Falls back to a default response if parsing fails.
     */
    private EvaluationResponse parseEvaluationResponse(String rawResponse) {
        try {
            // Strip markdown code fences if the AI included them
            String json = rawResponse.trim();
            if (json.startsWith("```")) {
                // Remove opening fence (```json or ```)
                json = json.replaceFirst("```[a-zA-Z]*\\s*", "");
                // Remove closing fence
                json = json.replaceFirst("```\\s*$", "");
                json = json.trim();
            }

            JsonNode root = objectMapper.readTree(json);

            int score = root.has("score") ? root.get("score").asInt() : 0;

            List<String> strengths = new ArrayList<>();
            if (root.has("strengths") && root.get("strengths").isArray()) {
                for (JsonNode item : root.get("strengths")) {
                    strengths.add(item.asText());
                }
            }

            List<String> weaknesses = new ArrayList<>();
            if (root.has("weaknesses") && root.get("weaknesses").isArray()) {
                for (JsonNode item : root.get("weaknesses")) {
                    weaknesses.add(item.asText());
                }
            }

            String improvedAnswer = root.has("improvedAnswer")
                    ? root.get("improvedAnswer").asText()
                    : "";

            return new EvaluationResponse(score, strengths, weaknesses, improvedAnswer);

        } catch (Exception e) {
            // Fallback: return the raw AI response as the improved answer
            // so no data is lost even if JSON parsing fails
            return new EvaluationResponse(
                    0,
                    List.of("Could not parse AI response"),
                    List.of("Could not parse AI response"),
                    rawResponse
            );
        }
    }
}