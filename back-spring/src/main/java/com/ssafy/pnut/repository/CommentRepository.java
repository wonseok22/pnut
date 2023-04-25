package com.ssafy.pnut.repository;

import com.ssafy.pnut.dto.CommentDto;
import com.ssafy.pnut.entity.board;
import com.ssafy.pnut.entity.comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface CommentRepository extends JpaRepository<comment, Long> {

    List<comment> findAllByBoardId(board Board);

    Long countByBoardId(board Board);
}
