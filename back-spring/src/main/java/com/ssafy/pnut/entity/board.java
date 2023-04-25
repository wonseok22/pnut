package com.ssafy.pnut.entity;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;

import javax.persistence.*;
import java.time.LocalDateTime;

@DynamicInsert
@Entity
@Getter
@Setter
@NoArgsConstructor
public class board {
    @Id
    @Column(name = "board_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne
    @JoinColumn(name = "user_email")
//    @Column(name = "user_email")
    User userEmail;

    String content;

    @JsonFormat(pattern = "YYYY-MM-DD HH:mm:ss")
    @Column(name = "create_date")
    LocalDateTime createDate;

    @ColumnDefault("0")
    Integer visit;

    @Column(name = "thumbnail_image_url")
    String thumbnailImageUrl;

    String title;

    String ingredients;

    Integer quantity;

    Integer time;

    int likes;

    @Builder
    public board(Integer visit, String thumbnail_image_url, String title, String content, int time, int quantity, String ingredients, User userEmail, LocalDateTime createDate) {
        this.content = content;
        this.title = title;
        this.thumbnailImageUrl = thumbnail_image_url;
        this.ingredients = ingredients;
        this.userEmail = userEmail;
        this.createDate = createDate;
        this.time = time;
        this.quantity = quantity;
        this.visit = visit;
    }


}
