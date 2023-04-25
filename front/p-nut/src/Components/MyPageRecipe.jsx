import React, { useState, useEffect } from "react";
import MyPageRecipeBlock from "./MyPageRecipeBlock";

const MyPageRecipe = ({ myRecipe }) => {
  const [recipeNumber, setRecipeNumber] = useState(0);
  const [recipes, setRecipes] = useState(myRecipe);
  // console.log("recipes: ", recipes);
  const updateRecipe = (recipeId) => {
    // console.log("My Page Recipe: ", recipeId);
    const updatedRecipes = recipes.filter((recipe) => recipe.id !== recipeId);
    // console.log("updated recipes: ", updatedRecipes);
    setRecipes(updatedRecipes);
  };

  useEffect(() => {
    setRecipeNumber(recipes.length);
  }, [recipes]);
  return (
    <div>
      <div className="flex items-center">
        <p className="text-lg font-extrabold">내가 작성한 레시피</p>
        <p className="font-extrabold text-lg text-#FF6B6C ml-10">
          {recipeNumber}
        </p>
      </div>
      <div className="flex justify-center py-30">
        <div className="grid grid-cols-3 gap-20 ">
          {recipes.map((recipe) => (
            <MyPageRecipeBlock
              imgPath={recipe.thumbnail_image_url}
              recipeTitle={recipe.title}
              recipeId={recipe.id}
              key={`recipe-${recipe.id}`}
              onRecipeDelete={updateRecipe}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyPageRecipe;
