package com.ssafy.pnut.dto;

import com.ssafy.pnut.entity.User;
import com.ssafy.pnut.entity.board;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class BoardDto {

    private long id;
    private String thumbnail_image_url;

    private String title;

    private String content;

    private int time;

    private int quantity;

    private String ingredients;

    private User userEmail;

    private int visit;

    private LocalDateTime currentTime = LocalDateTime.now();

    private int likes;

    @Builder
    public BoardDto(Integer visit, String thumbnail_image_url, String title, String content, int time, int quantity, String ingredients, User userEmail) {
        this.id = id;
        this.content = content;
        this.title = title;
        this.ingredients = ingredients;
        this.quantity = quantity;
        this.time = time;
        this.thumbnail_image_url = thumbnail_image_url;
        this.userEmail = userEmail;
        this.visit = visit;
    }

    public board toEntity() {
        return board.builder().content(content).
                ingredients(ingredients).
                quantity(quantity).
                time(time).
                userEmail(userEmail).
                createDate(currentTime).
                title(title).
                thumbnail_image_url(thumbnail_image_url).
                visit(visit).build();
    }


}
