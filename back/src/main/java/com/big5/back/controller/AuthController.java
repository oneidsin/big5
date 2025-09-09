package com.big5.back.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.big5.back.dto.CustomOAuth2User;
import com.big5.back.dto.UserDTO;

@RestController
public class AuthController {

    /**
     * 현재 로그인된 사용자의 정보를 반환하는 API
     * 프론트엔드(Next.js)에서 사용자의 로그인 상태를 확인하고, 사용자 정보를 UI에 표시하기 위해 사용됩니다.
     * @param customOAuth2User Spring Security가 Security Context에서 가져온 현재 사용자 정보 객체
     * @return ResponseEntity<UserDTO> 로그인된 사용자의 정보(UserDTO)를 포함한 응답
     */
    @GetMapping("/api/me")
    public ResponseEntity<UserDTO> getCurrentUser(@AuthenticationPrincipal CustomOAuth2User customOAuth2User) {
        // @AuthenticationPrincipal 어노테이션이 SecurityContext에서 인증된 사용자 정보를 직접 주입해줍니다.
        // JwtFilter에서 사용자 정보를 SecurityContext에 저장했기 때문에 여기서 받아올 수 있습니다.
        
        // CustomOAuth2User에서 UserDTO를 가져옵니다.
        // (참고: 이를 위해 CustomOAuth2User 클래스에 getUserDTO() 메소드가 필요합니다.)
        UserDTO userDTO = customOAuth2User.getUserDTO(); 

        return ResponseEntity.ok(userDTO);
    }
}