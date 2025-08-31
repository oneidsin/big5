package com.big5.back.entity;

import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idx;

    @Column(nullable = false, unique = true)
    private String email;

    private String name;
    private String picture;

    private String provider;

    @Column(name = "provider_id")
    private String providerId;

    @Column(name = "join_at")
    @CreationTimestamp
    private LocalDateTime joinAt;

    // jpa 기본 생성자
    public Users() {
    }

    // 신규 생성용 생성자
    public Users(String email, String name, String picture,
                 String provider, String providerId) {
        this.email = email;
        this.name = name;
        this.picture = picture;
        this.provider = provider;
        this.providerId = providerId;
    }

    // 유저 정보 업데이트 메서드
    public void update(String name, String picture) {
        this.name = name;
        this.picture = picture;
    }

    public Long getIdx() {
        return idx;
    }

    public void setIdx(Long idx) {
        this.idx = idx;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPicture() {
        return picture;
    }

    public void setPicture(String picture) {
        this.picture = picture;
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public String getProviderId() {
        return providerId;
    }

    public void setProviderId(String providerId) {
        this.providerId = providerId;
    }

    public LocalDateTime getJoinAt() {
        return joinAt;
    }

    public void setJoinAt(LocalDateTime joinAt) {
        this.joinAt = joinAt;
    }
}
