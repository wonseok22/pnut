package com.ssafy.pnut.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity(name = "like_table")
@NoArgsConstructor
public class likeTable {
    @Id
    @Column(name = "like_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id = null;

    @ManyToOne
    @JoinColumn(name = "user_email")
//    @Column(name = "user_email")
    User userEmail;

    @ManyToOne
    @JoinColumn(name = "board_id")
    board boardId;

    @Builder
    public likeTable(User userEmail, board boardId) {
        this.userEmail = userEmail;
        this.boardId = boardId;
    }
}
