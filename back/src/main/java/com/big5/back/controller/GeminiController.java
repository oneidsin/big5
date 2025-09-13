package com.big5.back.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.big5.back.jwt.JwtUtil;
import com.big5.back.service.GeminiService;
import com.big5.back.service.ResultService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/gemini")
@RequiredArgsConstructor
@Slf4j
public class GeminiController {
	private final GeminiService geminiService;
	private final ResultService resultService;
	private final JwtUtil jwtUtil;

	@PostMapping("/explain")
	public ResponseEntity<?> explainResult(@RequestBody Map<String, Object> scores, HttpServletRequest request) {
		log.info("검사 결과: {}", scores);

		String explanation = geminiService.getExplanation(scores.toString());

		// JWT 토큰에서 사용자 정보 추출 (로그인한 경우에만)
		String userName = getUserNameFromJwt(request);
		if (userName != null) {
			// 로그인한 사용자인 경우 결과 저장
			resultService.saveTestResult(userName, scores, explanation);
			log.info("로그인된 사용자 {}의 검사 결과를 저장했습니다.", userName);
		} else {
			log.info("비로그인 사용자의 검사 결과 요청입니다.");
		}

		return ResponseEntity.ok(Map.of("explanation", explanation));
	}

	private String getUserNameFromJwt(HttpServletRequest request) {
		try {
			Cookie[] cookies = request.getCookies();
			if (cookies != null) {
				for (Cookie cookie : cookies) {
					if ("Authorization".equals(cookie.getName())) {
						String token = cookie.getValue();
						if (!jwtUtil.isExpired(token)) {
							return jwtUtil.getName(token);
						}
					}
				}
			}
		} catch (Exception e) {
			log.debug("JWT 토큰 파싱 중 오류 (정상적인 경우): {}", e.getMessage());
		}
		return null;
	}
}