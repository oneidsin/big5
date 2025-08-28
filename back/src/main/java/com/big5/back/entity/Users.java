package com.big5.back.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Table(name = "users")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    private String picture;

    private String provider; // 소셜 로그인 제공자 (e.g., "google")
    private String providerId; // 소셜 로그인 제공자의 고유 ID

    @Column(name = "join_at", updatable = false)
    @CreationTimestamp
    private LocalDateTime joinAt;

}
