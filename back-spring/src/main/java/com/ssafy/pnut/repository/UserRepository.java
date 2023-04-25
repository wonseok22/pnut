package com.ssafy.pnut.repository;

import com.ssafy.pnut.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);

    User findByNickname(String nickname);

    int deleteByEmail(String email);
}
