package com.ssafy.pnut.dto;

import com.ssafy.pnut.entity.User;
import com.ssafy.pnut.entity.board;
import com.ssafy.pnut.entity.likeTable;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class LikeDto {

    private User userEmail;

    private board BoardId;

    @Builder
    public LikeDto(User userEmail, board BoardId) {
        this.userEmail = userEmail;
        this.BoardId = BoardId;
    }

    public likeTable toEntity() {
        return likeTable.builder().userEmail(userEmail).boardId(BoardId).build();
    }}
