package com.big5.back.service;

import com.big5.back.dto.GoogleTokenResponseDTO;
import com.big5.back.dto.GoogleUserInfoResponseDTO;
import com.big5.back.entity.Users;
import com.big5.back.repository.UserRepo;
import com.big5.back.utils.JwtProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;
import java.util.Map;

@Service
public class GoogleAuthService {
    private final JwtProvider jwtProvider;
    private final UserRepo userRepo;

    public GoogleAuthService(JwtProvider jwtProvider, UserRepo userRepo) {
        this.jwtProvider = jwtProvider;
        this.userRepo = userRepo;
    }

    @Value("${google.client-id}")
    private String clientId;

    @Value("${google.client-secret}")
    private String clientSecret;

    @Value("${google.redirect-uri}")
    private String redirectUri;

    @Value("${google.token-uri}")
    private String tokenUri;

    @Value("${google.user-info-uri}")
    private String userInfoUri;

    public String loginWithGoogle(String code) {
        // 1. code로 토큰 요청
        GoogleTokenResponseDTO tokenResponse = WebClient.create()
                .post()
                .uri(tokenUri)
                .header("Content-Type", "application/x-www-form-urlencoded")
                .body(BodyInserters
                        .fromFormData("code", code)
                        .with("client_id", clientId)
                        .with("client_secret", clientSecret)
                        .with("redirect_uri", redirectUri)
                        .with("grant_type", "authorization_code")
                )
                .retrieve()
                .bodyToMono(GoogleTokenResponseDTO.class)
                .block();

        // 2. Access Token으로 유저정보 요청
        GoogleUserInfoResponseDTO userInfo = WebClient.create()
                .get()
                .uri(userInfoUri)
                .headers(headers -> headers.setBearerAuth(tokenResponse.getAccessToken()))
                .retrieve()
                .bodyToMono(GoogleUserInfoResponseDTO.class)
                .block();

        // 3. db 저장 및 업데이트
        Users user = userRepo.findByEmail(userInfo.getEmail())
                .orElse(new Users(
                        userInfo.getEmail(),
                        userInfo.getName(),
                        userInfo.getPicture(),
                        "google",
                        userInfo.getSub()
                ));

        // 기존 유저라면 업데이트
        if (user.getIdx() != null) {
            user.update(userInfo.getName(), userInfo.getPicture());
        }

        userRepo.save(user);

        // 4. 토큰 발급
        return jwtProvider.createToken(userInfo.getEmail());
    }


    private String buildTokenRequest(String code) {
        Map<String, String> params = new HashMap<>();
        params.put("code", code);
        params.put("client_id", clientId);
        params.put("client_secret", clientSecret);
        params.put("redirect_uri", redirectUri);
        params.put("grant_type", "authorization_code");
        return params.toString();
    }

}
