package com.big5.back.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.big5.back.service.GeminiService; // 주입받는 서비스 변경

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/gemini") // URL 경로 변경
@RequiredArgsConstructor
@Slf4j
public class GeminiController {
	private final GeminiService geminiService;

	@PostMapping("/explain")
	public ResponseEntity<?> explainResult(@RequestBody Map<String, Object> scores) {
		log.info("body : {}", scores);
		String explanation = geminiService.getExplanation(scores.toString());
		return ResponseEntity.ok(Map.of("explanation", explanation));
	}

}