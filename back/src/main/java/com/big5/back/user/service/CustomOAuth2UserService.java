package com.big5.back.user.service;

import com.big5.back.dto.OAuthAttribuesDTO;
import com.big5.back.entity.Users;
import com.big5.back.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.User;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {
    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2UserService<OAuth2UserRequest, OAuth2User> delegate = new DefaultOAuth2UserService();
        OAuth2User oAuth2User = delegate.loadUser(userRequest);

        // 현재 로그인 진행 중인 서비스를 구분
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        // OAuth2 로그인 진행 시 키가 되는 필드값
        String userNameAttributeName = userRequest.getClientRegistration().getProviderDetails()
                .getUserInfoEndpoint().getUserNameAttributeName();

        // 1. OAuth2User의 raw attributes를 DTO로 변환 (빌더 패턴 사용)
        OAuthAttribuesDTO attribues = toDto(registrationId, userNameAttributeName, oAuth2User.getAttributes());

        // 2. DTO 를 기반으로 User 엔티티를 저장 또는 업데이트
        User user = saveOrUpdate(attribues);

        return new DefaultOAuth2User(
                Collections.emptySet(),
                attribues.getAttributes(),
                attribues.getNameAttributeKey());
    }

    // DTO 를 기반으로 User 엔티티를 찾거나 새로 생성하여 저장(업데이트) 한다.
    private User saveOrUpdate(OAuthAttribuesDTO attribues) {
        User user = userRepository.findByEmail(attribues.getEmail())
                .map(entity -> entity.update(attribues.getName(), attribues.getPicture()))
                .orElseGet(() -> toEntity(attribues)); // User 가 없으면 엔티티로 변환

        return userRepository.save(user);
    }

    // 구글에서 받은 사용자 정보(Map)를 OAuthAttributes DTO로 변환합니다. (빌더 패턴 사용)
    private OAuthAttribuesDTO toDto(String registrationId, String userNameAttributeName, Map<String, Object> rawAttributes) {
        // 나중에 다른 소셜 로그인을 추가할 경우 여기서 분기 처리
        // if ("naver".equals(registrationId)) { ... }

        return OAuthAttribuesDTO.builder()
                .name((String) rawAttributes.get("name"))
                .email((String) rawAttributes.get("email"))
                .picture((String) rawAttributes.get("picture"))
                .provider(registrationId)
                .providerId((String) rawAttributes.get("sub"))
                .attributes(rawAttributes)
                .nameAttributeKey(userNameAttributeName)
                .build();
    }

    // OAuthAttributes DTO를 User 엔티티로 변환합니다. (빌더 패턴 사용)
    // 이 메소드는 새로운 사용자를 생성할 때만 호출됩니다.
    private Users toEntity(OAuthAttribuesDTO attributes) {
        return Users.builder()
                .name(attributes.getName())
                .email(attributes.getEmail())
                .picture(attributes.getPicture())
                .provider(attributes.getProvider())
                .providerId(attributes.getProviderId())
                .build();
    }
}
