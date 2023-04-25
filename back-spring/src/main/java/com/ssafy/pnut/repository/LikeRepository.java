package com.ssafy.pnut.repository;

import com.ssafy.pnut.entity.User;
import com.ssafy.pnut.entity.board;
import com.ssafy.pnut.entity.likeTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface LikeRepository extends JpaRepository<likeTable, Long> {
    Optional<likeTable> findByBoardIdAndUserEmail(board board, User user);

    Long countByBoardId(board Board);
    void deleteById(Long id);
}
