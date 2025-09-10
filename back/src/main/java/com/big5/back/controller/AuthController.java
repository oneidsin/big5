package com.big5.back.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.big5.back.dto.CustomOAuth2User;
import com.big5.back.dto.UserDTO;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

@RestController
public class AuthController {

	@GetMapping("/api/me")
	public ResponseEntity<?> getCurrentUser(Authentication authentication) {
		if (authentication == null || !(authentication.getPrincipal() instanceof CustomOAuth2User)) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증 정보가 없습니다.");
		}

		CustomOAuth2User customUser = (CustomOAuth2User) authentication.getPrincipal();
		UserDTO userDTO = customUser.getUserDTO();
		return ResponseEntity.ok(userDTO);
	}

	@PostMapping("/api/logout")
	public ResponseEntity<?> logout(HttpServletResponse response) {
		// Authorization 쿠키 삭제
		Cookie authCookie = new Cookie("Authorization", null);
		authCookie.setMaxAge(0);
		authCookie.setPath("/");
		authCookie.setHttpOnly(true);
		response.addCookie(authCookie);

		// isLoggedIn 쿠키 삭제
		Cookie isLoggedInCookie = new Cookie("isLoggedIn", null);
		isLoggedInCookie.setMaxAge(0);
		isLoggedInCookie.setPath("/");
		response.addCookie(isLoggedInCookie);

		// JSESSIONID 쿠키 삭제
		Cookie jsessionCookie = new Cookie("JSESSIONID", null);
		jsessionCookie.setMaxAge(0);
		jsessionCookie.setPath("/");
		response.addCookie(jsessionCookie);

		// SecurityContextHolder에서 인증 정보 제거
		SecurityContextHolder.clearContext();

		return ResponseEntity.ok("로그아웃 성공");
	}
}