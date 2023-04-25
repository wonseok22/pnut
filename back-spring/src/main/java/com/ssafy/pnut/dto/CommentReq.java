package com.ssafy.pnut.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CommentReq {
    private String content;

    @Builder
    public CommentReq(String content) {
        this.content = content;
    }
}
