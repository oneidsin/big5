package com.big5.back.service;

import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.big5.back.dto.CustomOAuth2User;
import com.big5.back.dto.GoogleResponseDTO;
import com.big5.back.dto.NaverResponseDTO;
import com.big5.back.dto.OAuth2Response;
import com.big5.back.dto.UserDTO;
import com.big5.back.entity.Users;
import com.big5.back.repository.UsersRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

	private final UsersRepository usersRepository;

	@Override
	public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
		// OAuth2 공급자로부터 사용자 정보 로드
		OAuth2User oAuth2User = super.loadUser(userRequest);
		System.out.println("oAuth2User = " + oAuth2User);

		// 현재 로그인 진행 중인 서비스를 구분 (e.g., naver, google)
		String registrationId = userRequest.getClientRegistration().getRegistrationId();
		OAuth2Response oAuth2Response = null;

		// 서비스에 따라 적절한 응답 DTO 생성
		if (registrationId.equals("naver")) {
			oAuth2Response = new NaverResponseDTO(oAuth2User.getAttributes());
		} else if (registrationId.equals("google")) {
			oAuth2Response = new GoogleResponseDTO(oAuth2User.getAttributes());
		} else {
			return null; // 지원하지 않는 소셜 로그인
		}

		// 소셜 ID를 포함한 고유한 사용자 이름 생성
		String userName = oAuth2Response.getProvider() + " " + oAuth2Response.getProviderId();
		// 사용자가 DB에 이미 존재하는지 확인
		Users existData = usersRepository.findByUserName(userName);

		// 새로운 사용자인 경우
		if (existData == null) {
			// Users 엔티티 생성 및 정보 설정
			Users user = new Users();
			user.setUserName(userName);
			user.setEmail(oAuth2Response.getEmail());
			user.setName(oAuth2Response.getName());
			user.setProvider(oAuth2Response.getProvider());
			user.setProviderId(oAuth2Response.getProviderId());
			user.setRole("ROLE_USER");

			// DB에 사용자 저장
			usersRepository.save(user);

			// 세션에 저장할 UserDTO 생성
			UserDTO userDTO = new UserDTO();
			userDTO.setUserName(userName);
			userDTO.setName(oAuth2Response.getName());
			userDTO.setRole("ROLE_USER");
			userDTO.setEmail(oAuth2Response.getEmail());

			// 인증 객체로 사용할 CustomOAuth2User 반환
			return new CustomOAuth2User(userDTO);
		} else {
			// 기존 사용자인 경우, 정보 업데이트
			existData.setEmail(oAuth2Response.getEmail());
			existData.setName(oAuth2Response.getName());

			// 변경된 정보 DB에 저장
			usersRepository.save(existData);

			// 세션에 저장할 UserDTO 생성
			UserDTO userDTO = new UserDTO();
			// userDTO.setUserName(existData.getUserName());
			userDTO.setName(oAuth2Response.getName());
			userDTO.setRole(existData.getRole());
			userDTO.setEmail(existData.getEmail());

			// 인증 객체로 사용할 CustomOAuth2User 반환
			return new CustomOAuth2User(userDTO);
		}
	}

}