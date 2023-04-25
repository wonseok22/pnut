package com.ssafy.pnut.service;

import com.ssafy.pnut.dto.FoodDto;
import com.ssafy.pnut.dto.IngredientDto;

import java.util.List;

public interface FoodService {
    List<String> getIngredients();
    List<String> getFoods();
}
