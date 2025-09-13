package com.big5.back.controller;

import com.big5.back.dto.ProfileInfoDTO;
import com.big5.back.dto.UserResultDTO;
import com.big5.back.service.ProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@Slf4j
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    // 프로필 불러오기
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestParam String email) {
        log.info("프로필 불러오기 : {}", email);
        ProfileInfoDTO profile = profileService.getProfile(email);
        return ResponseEntity.ok(profile);
    }

    // 검사 내역 불러오기
    @GetMapping("/profile/test-result")
    public ResponseEntity<?> getTestResult(@RequestParam String email) {
        log.info("검사 내역 불러오기 : {}", email);
        List<UserResultDTO> results = profileService.getTestResult(email);
        return ResponseEntity.ok(results);
    }
}
