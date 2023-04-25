package com.ssafy.pnut.dto;

import com.ssafy.pnut.entity.RecipeSteps;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
public class RecipeStepsDto {
    private long recipeStepsId;
    private long recipeId;
    private String imageUrl;
    private String content;
    private String recipeStepsCol;

    public static RecipeStepsDto toDto(RecipeSteps recipeSteps){
        return new RecipeStepsDto(
                recipeSteps.getRecipe_steps_id(),
                recipeSteps.getRecipe_id(),
                recipeSteps.getImage_url(),
                recipeSteps.getContent(),
                recipeSteps.getRecipe_stepscol()
        );
    }
    public RecipeSteps toEntity(){return new RecipeSteps(recipeStepsId, recipeId, imageUrl, content, recipeStepsCol);}
}
