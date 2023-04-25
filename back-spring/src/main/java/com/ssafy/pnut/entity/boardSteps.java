package com.ssafy.pnut.entity;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name="board_steps")
public class boardSteps {
    @Id
    @Column(name = "board_steps_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id = null;

    @ManyToOne
    @JoinColumn(name = "board_id")
    board boardId;

    String content;

    @Column(name = "image_url")
    String imageUrl;

    @Builder
    public boardSteps(board boardId, String content, String imageUrl) {
        this.boardId = boardId;
        this.content = content;
        this.imageUrl = imageUrl;
    }
}
