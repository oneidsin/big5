package com.big5.back.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.big5.back.entity.Users;

public interface UsersRepository extends JpaRepository<Users, Long> {
	Users findByUserName(String userName);
}
