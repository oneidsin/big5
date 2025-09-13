package com.big5.back.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@Table(name = "users")
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "provider", columnDefinition = "varchar(10)")
    private String provider;

    @Column(name = "provider_id")
    private String providerId;

    // username은 여전히 고유해야 하므로 provider + providerId 조합으로 저장
    @Column(name = "user_name")
    private String userName;

    private String name;

    private String email;

    @Column(columnDefinition = "varchar(20)")
    private String role;

    @Column(name = "join_date")
    @CreationTimestamp
    private LocalDate joinDate;
}
