package com.big5.back.user.repository;

import com.big5.back.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<Users, Long> {
    // 이미 가입된 사용자인지 확인
    Optional<Users> findByEmail(String email);
}
