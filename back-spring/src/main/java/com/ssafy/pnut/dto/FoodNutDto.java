package com.ssafy.pnut.dto;

import com.ssafy.pnut.entity.FoodNut;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
public class FoodNutDto {
    private long fodNutId;
    private long nutrientNutrientId;
    private long foodFoodId;
    private float weight;

    public static FoodNutDto toDto(FoodNut foodNut){
        return new FoodNutDto(
                foodNut.getFood_nut_id(),
                foodNut.getNutrient_nutrient_id(),
                foodNut.getFood_food_id(),
                foodNut.getWeight()
        );
    }
    public FoodNut toEntity(){ return new FoodNut(fodNutId, nutrientNutrientId, foodFoodId, weight);}
}
