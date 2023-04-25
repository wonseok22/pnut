import React, { useEffect, useState } from "react";
import SurveyCard from "../Components/SurveyCard";
import SurveyCardThumbnail from "../Components/SurveyCardThumbnail";

import getUserInfo from "../api/getUserInfo";
import getTotalFoodAPI from "../api/getTotalFoodAPI";
import getFoodNutrientAPI from "../api/getFoodNutrientAPI";
import { useNavigateToTop } from "../hooks/useNavigateToTop";

import { useLoaderData } from "react-router-dom";
import AlertModal from "../UI/AlertModal";
import { useSelector } from "react-redux";

const SurveyRecommendPage = (props) => {
  // 개인정보 받아오기
  const data = useLoaderData();
  const navigate = useNavigateToTop();
  const [modalOpen, setModalOpen] = useState(false);
  const email = useSelector((state) => state.auth.authentication.email);

  const loginPageHandler = () => {
    if (!email) {
      navigate("/login");
      return;
    }
    navigate("/newsurvey");
  };

  const modalClosedHandler = () => {
    navigate("/");
  };

  console.log("data: ", data);
  const [ment, setMent] = useState("로그인이 필요한 서비스입니다.");
  useEffect(() => {
    if (data.foodNutrient.length === 0) {
      if (email) {
        setMent(
          "맞춤형 음식 추천을 받으시고 싶으시다면, 설문조사를 먼저 진행해주시길바랍니다."
        );
      }
      setModalOpen(true);
    }
  }, []);

  return (
    <div className="w-full py-50 flex justify-center text-#2B2C2B ">
      {modalOpen && (
        <AlertModal
          open={modalOpen}
          close={modalClosedHandler}
          onCheck={loginPageHandler}
        >
          {ment}
        </AlertModal>
      )}
      {!modalOpen && (
        <div className="flex flex-col w-1200">
          {/* # 건강설문 결과표 */}
          <div className="w-full px-40 pb-20 bg-#FF6B6C/30 flex flex-col space-y-30">
            <div className="space-y-30 mt-120">
              <div className="text-2xl font-extrabold">
                <p>{data.userInfo.name}님의</p>
                <p>건강설문 결과표</p>
              </div>
              <div className="flex text-sm space-x-15">
                <p className="font-extrabold">성별</p>
                <p className="font-bold text-gray-800">
                  {data.userInfo.gender === 0 ? "남자" : "여자"}
                </p>
                <p className="font-extrabold">나이</p>
                <p className="font-bold text-gray-800">{data.userInfo.age}세</p>
              </div>
            </div>
            <div className="flex justify-center bg-white rounded-50 ">
              <div className="justify-center space-y-15 p-22">
                <img className="mx-auto" src="assets\power.png" alt="" />
                <p className="text-center text-2xl font-bold text-#FF6B6C">
                  {data.userInfo.name}님을 위한 추천음식이에요!
                </p>
                <section className="flex font-bold text-gray-800 space-x-50 text-md">
                  {data.totalFood.map((food, index) => (
                    <SurveyCardThumbnail
                      imgPath={food.url}
                      foodTitle={food.name}
                      foodId={food.food_id}
                      key={`${index} - ${food.name}`}
                    />
                  ))}
                </section>
              </div>
            </div>
            <p className="text-sm text-center">
              본 결과는 의사의 처방을 대신하지 않습니다.
            </p>
          </div>
          {/* # 영양소 카드 컴포넌트 */}
          <div className="py-30 ">
            {data.foodNutrient.map((nutrient, index) => (
              <SurveyCard
                title={nutrient[0].name}
                tag1={nutrient[0].tag1}
                tag2={nutrient[0].tag2}
                guidecontext={nutrient[0].guide}
                nutrientcontext={nutrient[0].description}
                key={`${index} - ${nutrient[0].name}`}
                initialExpanded={nutrient[0].id === 3}
                additionalClass={nutrient[0].id === 3 ? "rounded-b-lg" : ""}
                nutrientfood={nutrient[1]}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SurveyRecommendPage;

export async function loader() {
  console.log("Loading Survey Recommend Page...");
  const state = JSON.parse(localStorage.getItem("persist:root"));
  const authentication = JSON.parse(state.auth);
  const userEmail = authentication.authentication.email;
  console.log("userEmail: ", userEmail);

  // getUserInfo
  const userInfo = await getUserInfo();

  // getTotalFoodAPI
  const totalFood = await getTotalFoodAPI(userEmail);
  // getFoodNutrientAPI
  const foodNutrient = await getFoodNutrientAPI(userEmail);

  const data = {
    userInfo: userInfo,
    totalFood: totalFood,
    foodNutrient: foodNutrient,
  };

  return data;
}
