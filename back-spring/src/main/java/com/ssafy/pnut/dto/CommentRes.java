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
public class CommentRes {
    private String nickName;

    private String content;

    private LocalDateTime createDate;

    @Builder
    public CommentRes(String nickName, String content, LocalDateTime createDate) {
        this.nickName = nickName;
        this.content = content;
        this.createDate = createDate;
    }

}

