package com.big5.back.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.big5.back.entity.Users;

import java.util.Optional;

public interface UsersRepository extends JpaRepository<Users, Long> {
    Users findByName(String userName);

    Users findByUserName(String userName);

    Optional<Users> findByEmail(String email);
}
