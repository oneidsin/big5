package com.big5.back.entity;

import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.sql.Date;

@Entity
@Data
@Table(name = "users")
public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idx;

    @Column(unique = true)
    private String email;

    @Column(length = 100)
    private String name;

    @Column(name = "picture_url", columnDefinition = "TEXT")
    private String pictureUrl;

    @Column(length = 10)
    private String provider;

    @Column(name = "privider_id")
    private String providerId;

    @Column(name = "join_at")
    @CreationTimestamp
    private Date joinAt;
}
