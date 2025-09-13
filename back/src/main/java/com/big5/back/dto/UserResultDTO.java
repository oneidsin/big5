package com.big5.back.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResultDTO {
    private Long id;
    private int a;
    private int c;
    private int e;
    private int n;
    private int o;
    private LocalDateTime date;
    private String email;
}
