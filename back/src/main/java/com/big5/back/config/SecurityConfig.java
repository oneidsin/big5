package com.big5.back.config;

import com.big5.back.utils.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Spring Security 설정 클래스
 * JWT 기반 인증 시스템을 구성하고 URL별 접근 권한을 설정
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    // JWT 인증 필터 - 요청이 들어올 때마다 JWT 토큰을 검증
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    /**
     * Spring Security의 보안 필터 체인을 구성
     *
     * @param http HttpSecurity 객체 - 보안 설정을 구성하는데 사용
     * @return SecurityFilterChain 구성된 보안 필터 체인
     * @throws Exception 설정 중 발생할 수 있는 예외
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // CSRF 보호 비활성화 (REST API에서는 일반적으로 비활성화)
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {}) // cors 활성화
                // HTTP 요청에 대한 권한 설정
                .authorizeHttpRequests(auth -> auth
                        // 인증 없이 접근 가능한 경로 설정
                        // - /api/auth/** : 모든 인증 관련 API (구글 로그인 등)
                        // - /api/public/** : 공개 API 경로
                        .antMatchers("/**").permitAll()
                        // 위에 명시되지 않은 모든 요청은 JWT 인증 필요
                        .anyRequest().authenticated()
                )
                // JWT 인증 필터를 UsernamePasswordAuthenticationFilter 앞에 추가
                // 이렇게 하면 Spring의 기본 인증 처리 전에 JWT 토큰을 먼저 검증
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        // 구성된 보안 필터 체인 반환
        return http.build();
    }
}
