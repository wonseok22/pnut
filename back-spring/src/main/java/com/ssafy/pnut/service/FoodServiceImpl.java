package com.ssafy.pnut.service;

import com.ssafy.pnut.dto.FoodDto;
import com.ssafy.pnut.dto.IngredientDto;
import com.ssafy.pnut.entity.Food;
import com.ssafy.pnut.entity.Ingredient;
import com.ssafy.pnut.repository.FoodRepository;
import com.ssafy.pnut.repository.IngredientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class FoodServiceImpl implements FoodService{
    @Autowired
    private FoodRepository foodRepository;
    @Autowired
    private IngredientRepository ingredientRepository;

    @Override
    public List<String> getIngredients() {
        List<String> ingredientName = new ArrayList<>();
        List<Ingredient> ingredients = ingredientRepository.findAll();
        ingredients.forEach(x->ingredientName.add(x.getName()));
        return ingredientName;
    }

    @Override
    public List<String> getFoods() {
        List<String> foodName = new ArrayList<>();
        List<Food> foods = foodRepository.findAll();
        System.out.println(foods.get(0));
        foods.forEach(x->foodName.add(x.getName()));

        return foodName;
    }
}
