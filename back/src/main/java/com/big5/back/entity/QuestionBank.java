package com.big5.back.entity;

import lombok.Data;

import javax.persistence.*;

@Entity
@Data
@Table(name = "question_bank")
public class QuestionBank {
    @Id
    @Column(name = "question_no", nullable = false)
    private Integer questionNo;

    @Column(name = "question_text", columnDefinition = "TEXT", nullable = false)
    private String questionText;

    @Column(name = "trait", length = 30, nullable = false)
    private Trait trait;

    @Column(name = "reverse_scored", nullable = false)
    private boolean reverseScored;

    public enum Trait {
        NEUROTICISM, // 신경성
        EXTRAVERSION, // 외향성
        OPENNESS, // 개방성
        AGREEABLENESS, // 우호성
        CONSCIENTIOUSNESS // 성실성
    }
}
