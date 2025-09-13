package com.big5.back.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.big5.back.dto.UserResultDTO;
import com.big5.back.entity.Results;
import com.big5.back.entity.Users;

@Repository
public interface ResultsRepository extends JpaRepository<Results, Long> {

    // 특정 사용자의 모든 검사 결과 조회
    List<Results> findByUserOrderByTestDateDesc(Users user);

    // 특정 사용자의 가장 최근 검사 결과 조회
    Results findTopByUserOrderByTestDateDesc(Users user);

    // 이메일로 사용자의 검사 결과를 UserResultDTO로 직접 조회
    @Query("SELECT new com.big5.back.dto.UserResultDTO(r.id, r.agreeableness, r.conscientiousness, r.extraversion, r.neuroticism, r.openness, r.testDate, u.email) " +
            "FROM Results r JOIN r.user u WHERE u.email = :email ORDER BY r.testDate DESC")
    List<UserResultDTO> findUserResultsByEmail(@Param("email") String email);
}
