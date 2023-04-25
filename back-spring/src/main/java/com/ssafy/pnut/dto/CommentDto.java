package com.ssafy.pnut.dto;

import com.ssafy.pnut.entity.User;
import com.ssafy.pnut.entity.board;
import com.ssafy.pnut.entity.comment;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class CommentDto {

    private User userEmail;

    private board boardId;

    private String content;

    private LocalDateTime createDate;

    @Builder
    public CommentDto(User userEmail, board boardId, String content, LocalDateTime createDate) {
        this.userEmail = userEmail;
        this.boardId = boardId;
        this.content = content;
        this.createDate = createDate;
    }

    public comment toEntity() {
        return comment.builder().boardId(boardId).content(content).userEmail(userEmail).createDate(createDate).build();
    }
}
