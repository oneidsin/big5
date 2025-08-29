package com.big5.back.entity;

import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
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

    // 생성자
    public Users() {
    }

    // 생성자
    public Users(Long id, String name, String email, String picture, String provider, String providerId, LocalDateTime joinAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.picture = picture;
        this.provider = provider;
        this.providerId = providerId;
        this.joinAt = joinAt;
    }

    public Users update(String name, String picture) {
        this.name = name;
        this.picture = picture;
        return this;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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
