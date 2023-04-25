import React, { useState, useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import RecipeThumbnail from "../Components/RecipeThumbnail";

import getSymptomsCategoryAPI from "../api/getSymptomsCategoryAPI";
import getUserInfo from "../api/getUserInfo";

const SymptomsRecommendPage = () => {
  const btnIcons = [
    {
      imgPath: "/assets/cate_all.png",
      title: "전체",
      id: 0,
    },
    {
      imgPath: "/assets/cate_mind.png",
      title: "마음",
      id: 1,
    },

    {
      imgPath: "/assets/cate_skin.png",
      title: "피부",
      id: 2,
    },

    {
      imgPath: "/assets/cate_teeth.png",
      title: "구강관리",
      id: 3,
    },

    {
      imgPath: "/assets/cate_diet.png",
      title: "다이어트",
      id: 4,
    },

    {
      imgPath: "/assets/cate_bone.png",
      title: "뼈/관절",
      id: 5,
    },

    {
      imgPath: "/assets/cate_power.png",
      title: "피로/활력",
      id: 6,
    },

    {
      imgPath: "/assets/cate_liver.png",
      title: "간 건강",
      id: 7,
    },

    {
      imgPath: "/assets/cate_organ.png",
      title: "장 건강",
      id: 8,
    },
    {
      imgPath: "/assets/cate_hair.png",
      title: "모발/두피",
      id: 9,
    },

    {
      imgPath: "/assets/cate_stomach.png",
      title: "위/소화",
      id: 10,
    },

    {
      imgPath: "/assets/cate_immune.png",
      title: "면역력",
      id: 11,
    },
  ];

  const loadedData = useLoaderData();
  const [userEmail, setUserEmail] = useState("admin@ssafy.com");
  const changeUserEmail = () => {
    console.log("loadedData: ", loadedData);
    if (loadedData.userInfo !== "token does not exist") {
      setUserEmail(loadedData.userInfo.email);
    }
  };

  // Symptom 바꾸기
  const [symptomsId, setSymptomsId] = useState(0);

  // getSymptomsCategoryAPI
  const [foodData, setFoodData] = useState([]);

  const getSymptomsCategory = async () => {
    try {
      const response = await getSymptomsCategoryAPI(symptomsId);
      console.log("symptom: ", response);

      setFoodData(response ?? []);
    } catch (err) {
      console.log("error: ", err);
    }
  };

  useEffect(() => {
    changeUserEmail();
    console.log("userEmail: ", userEmail);
    getSymptomsCategory();
  }, [symptomsId]);

  const handleSymptomClick = (id) => {
    setSymptomsId(id);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-col w-1200 items-center py-100 border-b border-#535453">
        <div className="text-4xl font-bold">
          고민이 있으신가요? <strong className=" text-#FF6B6C ">피넛</strong>
          에게 물어보세요!
        </div>
        <div className="text-xl text-#AEAFAE pt-10">
          궁금한 카테고리를 선택하면 증상별로 맞춤 음식을 볼 수 있어요
        </div>
      </div>
      <div className="flex py-50">
        {btnIcons.map((values, index) => (
          <div
            className="
            flex flex-col items-center justify-center mx-14"
            key={`symptoms${index}`}
            onClick={() => handleSymptomClick(values.id)}
          >
            <div
              className={`cursor-pointer rounded-25 w-72 h-72 flex items-center justify-center hover:border-2 hover:border-white  ${
                values.id === symptomsId
                  ? "bg-#FF6B6C"
                  : "bg-#535453/20 hover:bg-#FF6B6C/20"
              }`}
            >
              <img src={values.imgPath} alt="" />
            </div>
            <div>{values.title}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-56 w-1248 pb-50">
        {foodData.map((food) => (
          <RecipeThumbnail
            imgPath={food.url}
            title={food.name}
            kcal={food.cal}
            mainIngredients={food.ingredients}
            time={food.time}
            foodId={food.food_id}
            key={`${food.food_id}`}
            userEmail={userEmail}
          />
        ))}
      </div>
    </div>
  );
};

export default SymptomsRecommendPage;

export async function loader() {
  console.log("Loading SymptomRecommend Page...");
  const userInfo = await getUserInfo();
  const data = {
    userInfo: userInfo,
  };
  return data;
}
