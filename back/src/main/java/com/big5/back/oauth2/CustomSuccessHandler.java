package com.big5.back.oauth2;

import java.io.IOException;
import java.util.Collection;
import java.util.Iterator;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.big5.back.dto.CustomOAuth2User;
import com.big5.back.jwt.JwtUtil;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class CustomSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
	private final JwtUtil jwtUtil;

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) throws IOException, ServletException {
		CustomOAuth2User customUserDetails = (CustomOAuth2User) authentication.getPrincipal();
		String name = customUserDetails.getName();
		String email = customUserDetails.getEmail();

		Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
		Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
		GrantedAuthority auth = iterator.next();
		String role = auth.getAuthority();

		String token = jwtUtil.createJwt(name, email, role, 3 * 24 * 60 * 60 * 1000L); // 3일, 밀리초

		// Authorization 쿠키 (HttpOnly)
		response.addCookie(createCookie("Authorization", token, true));
		// isLoggedIn 쿠키 (JavaScript로 접근 가능)
		response.addCookie(createCookie("isLoggedIn", "true", false));

		response.sendRedirect("http://localhost:3000/");
	}

	private Cookie createCookie(String key, String value, boolean httpOnly) {
		Cookie cookie = new Cookie(key, value);
		cookie.setMaxAge(3 * 24 * 60 * 60); // 3일, 초 단위
		cookie.setPath("/");
		cookie.setHttpOnly(httpOnly);
		// cookie.setSecure(true); // HTTPS 환경에서 활성화
		return cookie;
	}
}