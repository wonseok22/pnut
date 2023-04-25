import React from "react";
import RecipeCard from "../Components/RecipeCard";
import OrderBlock from "../Components/OrderBlock";
import axiosInterface from "../api/axiosInterface";

const RecipeDetailPage = () => {
  axiosInterface("get", "/foods/recipe-info/").then((res) => console.log(res));

  const thumbnail = "/assets/recipe_thumbnail.png/";
  const title = "닭도리탕";
  const description = "닭도리탕을 어쩌구 채소 어쩌구 양념장 어쩌구";
  const ingredients =
    "[재료] 구수한 사골육수 500ml(약 1/2팩), 김치 100g, 소시지 100g, 통조림햄 100g, 베이크드빈스 50g, 두부 1/4모(75g), 양파 1/4개(50g), 체다 치즈 1장, 대파 10g, 고춧가루 2큰술, 다진 마늘 1큰술";
  const heart = "0";
  const tag = ["탄수화물", "단백질", "지방"];
  const time = "20분";
  const quantity = "3";
  const cookingOrderInfos = [
    {
      imgPath: "/assets/cooking_order_img_1.png",
      text: "두부, 통조림햄, 소시지는 먹기 좋은 크기로 썰어주세요.",
      keyId: 1,
    },
    {
      imgPath: "/assets/cooking_order_img_1.png",
      text: "두부, 통조림햄, 소시지는 먹기 좋은 크기로 썰어주세요.",
      keyId: 2,
    },
  ];

  return (
    <div className="flex items-center w-full flex-col relative">
      <img src={thumbnail} alt="" className="w-873 h-591" />
      <RecipeCard
        title={title}
        description={description}
        heart={heart}
        tag={tag}
        time={time}
        quantity={quantity}
      />
      <div className="flex items-center flex-col mt-70">
        <div>재료</div>
        <div>{ingredients}</div>
      </div>
      <div className="flex items-center flex-col mt-70">
        <div>조리순서</div>
        {cookingOrderInfos.map((value, idx) => (
          <OrderBlock
            imgPath={value.imgPath}
            text={value.text}
            idx={idx + 1}
            key={`cookingOrderID-${value.keyId}`}
          />
        ))}
      </div>
    </div>
  );
};

export default RecipeDetailPage;
