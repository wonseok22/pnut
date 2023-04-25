package com.ssafy.pnut.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class RecipeCreateReq {

//    private MultipartFile thumbnail_image_url;

    private String title;

    private String content;

    private int time;

    private int quantity;

    private String ingredients;

    private String userEmail;

    private List<String> recipe_steps;

    private List<Integer> stepNums;

}
