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
public class question {
    @Id
    @Column(name = "question_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id = null;

    String content;

    @ManyToOne
    @JoinColumn(name = "category_id")
    category categoryId;

    @Builder
    public question(String content, category categoryId) {
        this.content = content;
        this.categoryId = categoryId;
    }

}
