package com.ssafy.pnut.service;

import com.ssafy.pnut.dto.CommentDto;
import com.ssafy.pnut.dto.CommentRes;
import com.ssafy.pnut.entity.board;
import com.ssafy.pnut.entity.comment;

import java.util.List;
import java.util.Optional;

public interface CommentService {
    void save(comment Comment);

    void deleteById(Long id);

    Optional<comment> findById(Long id);

    List<CommentRes> findAllByBoardId(board Board);

    Long countByBoardId(board Board);
}
