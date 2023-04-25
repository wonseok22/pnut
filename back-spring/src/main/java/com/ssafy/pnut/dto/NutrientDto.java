package com.ssafy.pnut.dto;

import com.ssafy.pnut.entity.Nutrient;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class NutrientDto {
    private long nutrientId;
    private String name;
    private String guide;
    private String description;
    private String tag1;
    private String tag2;
    private String unit;
    public static NutrientDto nutrientDto(Nutrient nutrient){
        return new NutrientDto(
                nutrient.getNutrient_id(),
                nutrient.getName(),
                nutrient.getGuide(),
                nutrient.getDescription(),
                nutrient.getTag1(),
                nutrient.getTag2(),
                nutrient.getUnit()
        );
    }
    public Nutrient toEntity(){return new Nutrient(nutrientId, name, guide, description, tag1, tag2, unit);}
}
