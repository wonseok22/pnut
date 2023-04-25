package com.ssafy.pnut.service;

import com.ssafy.pnut.dto.LikeDto;
import com.ssafy.pnut.entity.User;
import com.ssafy.pnut.entity.board;
import com.ssafy.pnut.entity.likeTable;

import java.util.Optional;

public interface LikeService {
    void save(LikeDto likeDto);

    Optional<likeTable> findByBoardIdAndUserEmail(board Board, User user);

    void deleteById(Long id);

    Long countByBoardId(board Board);
}
