package com.ssafy.pnut.dto;

import com.ssafy.pnut.entity.FoodIngre;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class FoodIngreDto {
    private long foodIngreId;
    private long ingredientIngredientId;
    private long foodFoodId;
    public static FoodIngreDto toDto(FoodIngre foodIngre){
        return new FoodIngreDto(
                foodIngre.getFood_ingre_id(),
                foodIngre.getIngredient_ingredient_id(),
                foodIngre.getFood_food_id()
        );
    }
    public FoodIngre toEntity(){return new FoodIngre(foodIngreId, ingredientIngredientId, foodFoodId);}
}
