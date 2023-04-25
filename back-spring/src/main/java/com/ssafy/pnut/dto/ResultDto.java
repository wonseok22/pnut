package com.ssafy.pnut.dto;


import com.ssafy.pnut.entity.User;
import com.ssafy.pnut.entity.question;
import com.ssafy.pnut.entity.result;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ResultDto {

    private User userEmail;

    private question questionId;

    private int degree;

    @Builder
    public ResultDto(User userEmail, question questionId, int degree) {
        this.userEmail = userEmail;
        this.questionId = questionId;
        this.degree = degree;
    }

    public result toEntity() {
        return result.builder().userEmail(userEmail).questionId(questionId).degree(degree).build();
    }

}
