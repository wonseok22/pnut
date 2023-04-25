package com.ssafy.pnut.dto;

import com.ssafy.pnut.entity.User;
import com.ssafy.pnut.entity.board;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class SelectAllRecipeRes {

    private long id;

    private String thumbnail_image_url;

    private String title;

    private int visit;

    private String nickName;

    private int likes;

    @Builder
    public SelectAllRecipeRes(long id, String thumbnail_image_url, String title, Integer visit, String nickName, int likes) {
        this.id = id;
        this.title = title;
        this.visit = visit;
        this.thumbnail_image_url = thumbnail_image_url;
        this.nickName = nickName;
        this.likes = likes;
    }

}
