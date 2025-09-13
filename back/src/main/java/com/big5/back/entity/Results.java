package com.big5.back.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "results")
public class Results {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Users 엔티티와 다대일 관계 설정
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;

    // 빅5 점수
    @Column(name = "openness")
    private int openness; // 개방성

    @Column(name = "conscientiousness")
    private int conscientiousness; // 성실성

    @Column(name = "extraversion")
    private int extraversion; // 외향성

    @Column(name = "agreeableness")
    private int agreeableness; // 친화성

    @Column(name = "neuroticism")
    private int neuroticism; // 신경성

    @Column(name = "test_result", columnDefinition = "TEXT")
    private String testResult;

    @Column(name = "test_date")
    @CreationTimestamp
    private LocalDateTime testDate;
}
