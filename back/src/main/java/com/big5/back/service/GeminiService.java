package com.big5.back.service;

// JsonPath 임포트 추가
import com.jayway.jsonpath.JsonPath; 

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;

import com.big5.back.dto.GeminiRequestDTO;

import lombok.RequiredArgsConstructor;

import java.net.URI;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GeminiService {
    private final WebClient webClient;

    @Value("${gemini.api-key}")
    private String apiKey;

    @Value("${gemini.url}")
    private String apiUrl;

    public String getExplanation(String resultSummary) {
        String prompt = "너는 성격심리학 전문가다. Big5 검사 결과를 분석하고 해설한다. 다음 Big5 결과를 해설해줘: " + resultSummary;

        GeminiRequestDTO.Part part = new GeminiRequestDTO.Part(prompt);
        GeminiRequestDTO.Content content = new GeminiRequestDTO.Content(List.of(part));
        GeminiRequestDTO requestDTO = new GeminiRequestDTO(List.of(content));
        
        // 1. apiUrl과 apiKey를 조합하여 최종 URI를 생성
        URI uri = UriComponentsBuilder.fromUriString(apiUrl)
        		.queryParam("key", apiKey)
        		.build()
        		.toUri();

        // 2. API 요청해서 응답받기
        String jsonResponse = webClient.post()
                .uri(uri)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestDTO)
                .retrieve()
                .bodyToMono(String.class) // DTO 대신 String.class로 변경
                .block();

        // 3. 응답에서 원하는 텍스트만 추출
        if (jsonResponse != null) {
            try {
                // 2. JsonPath를 사용하여 원하는 텍스트만 정확히 추출
                String explanation = JsonPath.read(jsonResponse, "$.candidates[0].content.parts[0].text");
                return explanation;
            } catch (Exception e) {
                // 경로에 해당하는 데이터가 없거나 json 파싱 실패 시 예외 처리
                return "결과를 해석하는 중 오류가 발생했습니다.";
            }
        } else {
            return "API로부터 응답을 받지 못했습니다.";
        }
    }
}