package com.ssafy.pnut.dto;

import com.ssafy.pnut.entity.NutIngre;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
public class NutIngreDto {
    private long nutIngreId;
    private long ingredientIngredientId;
    private long nutrientNutrientId;

    public static NutIngreDto toDto(NutIngre nutIngre){
        return new NutIngreDto(
                nutIngre.getNut_ingre_id(),
                nutIngre.getIngredient_ingredient_id(),
                nutIngre.getNut_ingre_id()
        );
    }

    public NutIngre toEntity(){return new NutIngre(nutIngreId, ingredientIngredientId, nutrientNutrientId);}
}
