package com.ssafy.pnut.service;

import com.ssafy.pnut.dto.CommentDto;
import com.ssafy.pnut.dto.CommentRes;
import com.ssafy.pnut.entity.board;
import com.ssafy.pnut.entity.comment;
import com.ssafy.pnut.repository.CommentRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.xml.stream.events.Comment;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@AllArgsConstructor
public class CommentServiceImpl implements CommentService{
    final CommentRepository commentRepository;

    public void save(comment Comment) {
        commentRepository.save(Comment);
    };

    public void deleteById(Long id) {
        commentRepository.deleteById(id);
    }

    public Optional<comment> findById(Long id) {
        return commentRepository.findById(id);
    }

    public List<CommentRes> findAllByBoardId(board Board) {
        List<comment> list = commentRepository.findAllByBoardId(Board);
        List<CommentRes> comments = new ArrayList<>();
        for(int i = 0; i < list.size(); i++) {
            CommentRes commentRes = new CommentRes(list.get(i).getUserEmail().getNickname(), list.get(i).getContent(), list.get(i).getCreateDate());
            comments.add(commentRes);
        }

        return comments;
    };

    public Long countByBoardId(board Board) {
        return commentRepository.countByBoardId(Board);
    }
}
