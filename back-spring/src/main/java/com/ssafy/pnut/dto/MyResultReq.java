package com.ssafy.pnut.dto;

import com.ssafy.pnut.entity.User;
import com.ssafy.pnut.entity.category;
import com.ssafy.pnut.entity.question;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class MyResultReq {

    private Long questionId;

    private int degree;

    private Long categoryId;

    @Builder
    public MyResultReq(Long questionId, int degree, Long categoryId) {
        this.questionId = questionId;
        this.degree = degree;
        this.categoryId = categoryId;
    }
}
