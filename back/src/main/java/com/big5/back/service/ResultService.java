package com.big5.back.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.big5.back.entity.Results;
import com.big5.back.entity.Users;
import com.big5.back.repository.ResultsRepository;
import com.big5.back.repository.UsersRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ResultService {
  private final ResultsRepository resultsRepository;
  private final UsersRepository usersRepository;

  /**
   * 검사 결과를 저장합니다.
   * 
   * @param userName    사용자명 (OAuth2에서 받은 username)
   * @param scores      빅5 점수 Map
   * @param explanation 해석 결과
   */
  public void saveTestResult(String userName, Map<String, Object> scores, String explanation) {
      log.info("userName : {}", userName);
    try {
      // 사용자 찾기
      Users user = usersRepository.findByName(userName);
      if (user == null) {
        log.error("사용자를 찾을 수 없음: {}", userName);
        return;
      }

      // 결과 엔티티 생성
      Results result = new Results();
      result.setUser(user);

      // 점수 매핑 (프론트에서 보낸 키 이름에 맞게 조정)
      // Map의 값이 Integer가 아닐 수 있으므로 안전하게 변환
      result.setOpenness(convertToInteger(scores.get("O")));
      result.setConscientiousness(convertToInteger(scores.get("C")));
      result.setExtraversion(convertToInteger(scores.get("E")));
      result.setAgreeableness(convertToInteger(scores.get("A")));
      result.setNeuroticism(convertToInteger(scores.get("N")));

      result.setTestResult(explanation);

      // 저장
      resultsRepository.save(result);
      log.info("검사 결과 저장 완료: 사용자={}", userName);

    } catch (Exception e) {
      log.error("검사 결과 저장 중 오류 발생: {}", e.getMessage(), e);
    }
  }

  /**
   * 특정 사용자의 모든 검사 결과를 조회합니다.
   * 
   * @param userName 사용자명
   * @return 검사 결과 목록 (최신 순)
   */
  public List<Results> getUserResults(String userName) {
    try {
      Users user = usersRepository.findByUserName(userName);
      if (user == null) {
        log.error("사용자를 찾을 수 없음: {}", userName);
        return List.of();
      }

      return resultsRepository.findByUserOrderByTestDateDesc(user);

    } catch (Exception e) {
      log.error("검사 결과 조회 중 오류 발생: {}", e.getMessage(), e);
      return List.of();
    }
  }

  /**
   * 특정 사용자의 가장 최근 검사 결과를 조회합니다.
   * 
   * @param userName 사용자명
   * @return 가장 최근 검사 결과
   */
  public Results getLatestUserResult(String userName) {
    try {
      Users user = usersRepository.findByUserName(userName);
      if (user == null) {
        log.error("사용자를 찾을 수 없음: {}", userName);
        return null;
      }

      return resultsRepository.findTopByUserOrderByTestDateDesc(user);

    } catch (Exception e) {
      log.error("최신 검사 결과 조회 중 오류 발생: {}", e.getMessage(), e);
      return null;
    }
  }

  /**
   * Object를 Integer로 안전하게 변환합니다.
   * 
   * @param value 변환할 값
   * @return 변환된 Integer 값 (변환 실패 시 0)
   */
  private Integer convertToInteger(Object value) {
    if (value == null) {
      return 0;
    }

    try {
      if (value instanceof Integer) {
        return (Integer) value;
      } else if (value instanceof Number) {
        return ((Number) value).intValue();
      } else if (value instanceof String) {
        return Integer.parseInt((String) value);
      } else {
        log.warn("예상치 못한 타입의 점수 값: {} (타입: {})", value, value.getClass().getSimpleName());
        return 0;
      }
    } catch (NumberFormatException e) {
      log.warn("점수 값을 숫자로 변환할 수 없음: {}", value);
      return 0;
    }
  }
}
