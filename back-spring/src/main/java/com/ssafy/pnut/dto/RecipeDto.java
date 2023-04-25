package com.ssafy.pnut.dto;

import com.ssafy.pnut.entity.Recipe;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class RecipeDto {
    private long recipeId;
    private String ingredients;
    private int time;
    private long foodId;
    private int quantity;

    public static RecipeDto toDto(Recipe recipe){
        return new RecipeDto(
                recipe.getRecipe_id(),
                recipe.getIngredients(),
                recipe.getTime(),
                recipe.getFood_id(),
                recipe.getQuantity()
        );
    }
    public Recipe toEntity(){ return new Recipe(recipeId, ingredients, time, foodId, quantity);}
}
