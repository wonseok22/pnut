package com.ssafy.pnut.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity
@NoArgsConstructor
public class result {
    @Id
    @Column(name = "result_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id = null;

    @ManyToOne
    @JoinColumn(name = "user_email")
    User userEmail;

    @ManyToOne
    @JoinColumn(name = "question_id")
    question questionId;

    int degree;

    @Builder
    public result(User userEmail, question questionId, int degree) {
        this.userEmail = userEmail;
        this.questionId = questionId;
        this.degree = degree;
    }
}
