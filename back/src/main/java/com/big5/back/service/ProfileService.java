package com.big5.back.service;

import com.big5.back.dto.ProfileInfoDTO;
import com.big5.back.dto.ResultDetailDTO;
import com.big5.back.dto.UserResultDTO;
import com.big5.back.entity.Users;
import com.big5.back.repository.ResultsRepository;
import com.big5.back.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProfileService {
    private final UsersRepository usersRepository;
    private final ResultsRepository resultsRepository;


    public ProfileInfoDTO getProfile(String email) {
        Users user = usersRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("해당하는 유저가 없습니다."));

        return ProfileInfoDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .joinDate(user.getJoinDate())
                .build();
    }

    public List<UserResultDTO> getTestResult(String email) {
        return resultsRepository.findUserResultsByEmail(email);
    }

    public List<ResultDetailDTO> getTestResultDetail(Long id, String email) {
        return resultsRepository.findResultDetailByIdAndEmail(id, email);
    }
}
