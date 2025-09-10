package com.big5.back.jwt;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.big5.back.dto.CustomOAuth2User;
import com.big5.back.dto.UserDTO;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Slf4j
public class JwtFilter extends OncePerRequestFilter {
	private final JwtUtil jwtUtil;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		String authorization = null;
		Cookie[] cookies = request.getCookies();

		// 쿠키가 null이 아닌 경우에만 처리
		if (cookies != null) {
			for (Cookie cookie : cookies) {
				if (cookie.getName().equals("Authorization")) {
					authorization = cookie.getValue();
					break;
				}
			}
		}

		// Authorization 쿠키가 없거나 null인 경우
		if (authorization == null) {
			log.info("No Authorization cookie found");
			filterChain.doFilter(request, response);
			return;
		}

		// 토큰 소멸 시간 검증
		String token = authorization;
		if (jwtUtil.isExpired(token)) {
			log.info("Token expired");
			filterChain.doFilter(request, response);
			return;
		}

		// 토큰에서 userName, role, name, email 획득
		String userName = jwtUtil.getUsername(token);
		String role = jwtUtil.getRole(token);
		String name = jwtUtil.getName(token);
		String email = jwtUtil.getEmail(token);

		// userDTO 생성
		UserDTO userDTO = new UserDTO();
		userDTO.setUserName(userName);
		userDTO.setRole(role);
		userDTO.setName(name);
		userDTO.setEmail(email);

		// UserDetails에 회원 정보 객체 담기
		CustomOAuth2User customOAuth2User = new CustomOAuth2User(userDTO);

		// 스프링 시큐리티 인증 토큰 생성
		Authentication authToken = new UsernamePasswordAuthenticationToken(customOAuth2User, null,
				customOAuth2User.getAuthorities());
		// 세션에 사용자 등록
		SecurityContextHolder.getContext().setAuthentication(authToken);

		filterChain.doFilter(request, response);
	}

}
