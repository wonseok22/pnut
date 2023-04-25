package com.ssafy.pnut.service;
import com.ssafy.pnut.entity.User;
import com.ssafy.pnut.dto.LikeDto;
import com.ssafy.pnut.entity.board;
import com.ssafy.pnut.entity.likeTable;
import com.ssafy.pnut.repository.BoardRepository;
import com.ssafy.pnut.repository.LikeRepository;
import com.ssafy.pnut.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Slf4j
@AllArgsConstructor
public class LikeServiceImpl implements LikeService{
    final LikeRepository likeRepository;

    final UserRepository userRepository;

    final BoardRepository boardRepository;
    public void save(LikeDto likeDto) {
        likeTable LikeTable = new likeTable(likeDto.getUserEmail(), likeDto.getBoardId());
        likeRepository.save(LikeTable);
    }

    public Optional<likeTable> findByBoardIdAndUserEmail(board Board, User user) {
        return likeRepository.findByBoardIdAndUserEmail(Board, user);
    }

    public void deleteById(Long id) {
        likeRepository.deleteById(id);
    }

    public Long countByBoardId(board Board) {
        return likeRepository.countByBoardId(Board);
    }
}
