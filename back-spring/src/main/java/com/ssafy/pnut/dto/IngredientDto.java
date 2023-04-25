package com.ssafy.pnut.dto;

import com.ssafy.pnut.entity.Ingredient;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class IngredientDto {
    private long ingredientId;
    private String name;

    public static IngredientDto toDto(Ingredient ingredient){
        return new IngredientDto(
                ingredient.getIngredientId(),
                ingredient.getName()
        );
    }
    public Ingredient toEntity(){return new Ingredient(ingredientId, name);}
}
