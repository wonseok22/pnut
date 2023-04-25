package com.ssafy.pnut.dto;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
public class SelectOneRecipeRes {
    private String thumbnailImageUrl;

    private String title;

    private String content;

    private int time;

    private int quantity;

    private String ingredients;

    private String nickName;

    private int visit;

    private Map<String, String> recipeSteps;

    private Long likes;

    private List<CommentRes> comments;

    private int likeOrNot;

    @Builder
    public SelectOneRecipeRes(Integer visit, String thumbnailImageUrl, String title, String content, int time, int quantity, String ingredients, String nickName, HashMap<String, String> recipeSteps, Long likes, List<CommentRes> comments, int likeOrNot) {
        this.content = content;
        this.title = title;
        this.ingredients = ingredients;
        this.quantity = quantity;
        this.time = time;
        this.thumbnailImageUrl = thumbnailImageUrl;
        this.nickName = nickName;
        this.visit = visit;
        this.recipeSteps = recipeSteps;
        this.likes = likes;
        this.comments = comments;
        this.likeOrNot = likeOrNot;
    }
}
