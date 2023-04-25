package com.ssafy.pnut.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import net.bytebuddy.asm.Advice;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class comment {
    @Id
    @Column(name = "comment_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id = null;

    @ManyToOne
    @JoinColumn(name = "user_email")
//    @Column(name = "user_email")
    User userEmail;

    @ManyToOne
    @JoinColumn(name = "board_id")
    board boardId;

    String content;

    @JsonFormat(pattern = "YYYY-MM-DD HH:mm:ss")
    @Column(name = "create_date")
    LocalDateTime createDate;

    @Builder
    public comment(User userEmail, board boardId, String content, LocalDateTime createDate) {
        this.userEmail = userEmail;
        this.boardId = boardId;
        this.content = content;
        this.createDate = createDate;
    }
}
