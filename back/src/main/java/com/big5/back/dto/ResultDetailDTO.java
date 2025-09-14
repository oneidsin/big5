package com.big5.back.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class ResultDetailDTO {
    private Long id;
    private int agreeableness;
    private int conscientiousness;
    private int extraversion;
    private int neuroticism;
    private int openness;
    private String testResult;
    private LocalDateTime testDate;
    private String email;
}
