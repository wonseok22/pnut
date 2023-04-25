import React, { useState } from "react";
import { useNavigateToTop } from "../hooks/useNavigateToTop";

const MainPage = () => {
  const navigate = useNavigateToTop();

  return (
    <>
      {/* 동영상 헤더 */}
      <div className="relative mx-auto overflow-hidden h-400 ">
        <video
          loop
          muted
          autoPlay
          className="object-cover"
          src="assets\videoplayback.mp4"
          type="video/mp4"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute text-center text-white inset-9">
          <div className="h-1/3" />
          <p className="text-2xl font-semibold ">당신만의 영양 솔루션</p>
          <div className="h-3 " />
          <p className="text-2xl font-semibold text-white/60">
            Eat and Enjoy with
          </p>
          <div className="h-3 " />
          <p className="text-5xl font-bold ">P.nut</p>
        </div>
      </div>
      {/* 문제 */}
      <div className="flex items-center justify-center py-16 border-b-2 border-gray-200 ">
        <p className="text-lg font-bold text-#FF6B6C">미션</p>
      </div>
      {/* 본문 */}
      <div className="overflow-hidden text-#2B2C2B">
        <div className="flex flex-col">
          <div className="shrink-0">
            <div className="max-w-screen-lg px-16 mx-auto">
              <div className="w-full h-100" />
              {/* 문제 1 */}
              <section>
                <div className="text-center">
                  <p className="text-2xl font-extrabold">
                    현대인의 영양소에 대한
                  </p>
                  <div className="w-full h-7" />
                  <p className="text-2xl font-extrabold">
                    관심이 증가하고 있어요
                  </p>
                </div>
                <div className="w-full h-35" />
                <div className="flex p-40 text-lg bg-gray-100 rounded-10">
                  <div className="flex flex-col items-center justify-center grow">
                    <img className="w-150" src="assets\medicine 1.png" alt="" />
                    <br />
                    <p>영양제 흡수율은 사실 그렇게 높지 않아요</p>
                  </div>
                  <div className="w-1 border-l border-gray-200 mr-80 " />
                  <div className="flex flex-col items-center justify-center grow space-y-16px">
                    <div>
                      <img className="w-150" src="assets\salad 1.png" alt="" />
                      <br />
                      <p>끼니에서 영양소를 챙겨요</p>
                    </div>
                  </div>
                </div>
                <div className="w-full h-35" />
                <div className="text-lg text-center">
                  <p>
                    그렇다면, 음식을 먹을 때는 얼마나 영양소에 신경을 쓸까요?
                  </p>
                  <div className="w-full h-10" />
                  <p className="font-bold">
                    대체적으로 음식에 대한 영양소는 신경 쓰지 않거나,
                  </p>
                  <div className="w-full h-10" />
                  <p className="font-bold">
                    칼로리나 당류 정도만 신경쓰는 사람이 대부분입니다.
                  </p>
                </div>
              </section>
              {/* 문제2 */}
              <div className="w-full h-100" />
              <section>
                <div className="text-center">
                  <p className="text-2xl font-extrabold">
                    1인 가구가 증가하면서
                  </p>
                  <div className="w-full h-7" />
                  <p className="text-2xl font-extrabold">
                    불균형한 식사가 늘어나고 있어요
                  </p>
                </div>
                <div className="w-full h-35" />
                <div className="p-40 bg-gray-100 rounded-10">
                  <div className="mx-200">
                    <p className="text-xl font-bold">1인가구 증가 추세</p>
                    <img
                      className="mx-auto h-300"
                      src="assets\chart.png"
                      alt=""
                    />
                    <p className="text-gray-400 text-end font-md">
                      * KOSIS 국가 통계 포털 - 전국 1인가구 추이 (단위 : 천 명)
                    </p>
                  </div>
                </div>
                <div className="w-full h-35" />
                <div className="text-lg text-center">
                  <p>
                    과거, 가족단위의 식사나 급식을 통해 밥을 먹었을 때는
                    균형잡힌 식사를 할 수 있었지만
                  </p>
                  <div className="w-full h-10" />
                  <p className="font-bold">
                    최근 1인가구 증가 추세에 따라 혼자 끼니를 해결하는 사람이
                    많아져
                  </p>
                  <div className="w-full h-10" />
                  <p className="font-bold">
                    불균형한 식사를 하는 경우가 많아졌습니다.
                  </p>
                </div>
              </section>
              {/* 기능소개 */}
              <div className="w-full h-100" />
              <section>
                <div className="text-center">
                  <p className="text-2xl font-extrabold text-#FF6B6C">
                    P.nut은 이런 기능을 가지고 있어요
                  </p>
                </div>
                <div className="w-full h-35" />
                <div className="grid grid-cols-2 gap-20 ">
                  <div className="flex flex-col rounded-10 items-center justify-center p-40 space-y-16 bg-#FF6B6C text-white">
                    <div className="w-32 h-32 mx-auto bg-white rounded-full flex-center">
                      <p className="pt-4 pl-12 font-extrabold text-#FF6B6C ">
                        1
                      </p>
                    </div>
                    <p className="text-xl font-semibold">
                      설문조사를 통한 개인별 진단
                    </p>
                    <div>
                      <p className="text-lg font-light">
                        개인별 설문조사를 통해 불편한 증상이나
                      </p>
                      <p className="text-lg font-light">
                        부족한 영양소를 파악하고,
                      </p>
                      <p className="text-lg font-light">
                        그에 맞는 맞춤형 음식을 추천합니다.
                      </p>
                      <p className="text-lg font-light mt-20">
                        피넛과 함께 설문조사부터 해볼까요?
                      </p>
                    </div>
                    <img
                      onClick={() => navigate("/newsurvey")}
                      className="pt-20 cursor-pointer h-80 hover:opacity-70"
                      src="assets\inspectbutton.png"
                      alt=""
                    />
                  </div>
                  <div className="relative flex flex-col items-center justify-center space-y-16 bg-gray-100">
                    <img src="assets\beef.png" alt="" />
                    <div className="absolute inset-0 z-10 flex flex-col items-start ">
                      <div className="w-32 h-32 mx-auto bg-white rounded-full mt-50 flex-center">
                        <p className="pt-4 pl-12 font-bold text-#2B2C2B">2</p>
                      </div>
                      <div className="flex justify-center w-full">
                        <img
                          onClick={() => navigate("/my-survey")}
                          className="pt-20 cursor-pointer h-80 hover:opacity-70"
                          src="assets\resultbutton.png"
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full h-20" />
                <div className="flex flex-col items-center justify-center w-full p-40 space-y-16 bg-gray-100 rounded-10">
                  <div className="w-32 h-32 mx-auto bg-#2B2C2B rounded-full flex-center">
                    <p className="pt-4 pl-12 font-bold text-white">3</p>
                  </div>
                  <div
                    onClick={() => navigate("/symptoms")}
                    className="flex flex-row items-center space-x-10 cursor-pointer"
                  >
                    <p className="text-xl font-bold">
                      관심있는 증상 별 음식 톺아보기
                    </p>
                    <img
                      className="h-20 hover:h-25"
                      src="assets\chevron.png"
                      alt=""
                    />
                  </div>
                  <div>
                    <p className="text-lg">
                      개인별 설문조사 뿐만 아니라, 관심 있는 증상 별로 음식을
                      조회할 수 있습니다.
                    </p>
                  </div>
                </div>
                <div className="w-full h-20" />
                <div className="flex flex-col items-center justify-center w-full p-40 space-y-16 bg-gray-100 rounded-10">
                  <div className="w-32 h-32 mx-auto bg-#2B2C2B rounded-full flex-center">
                    <p className="pt-4 pl-12 font-bold text-white">4</p>
                  </div>

                  <div
                    onClick={() => navigate("/search")}
                    className="flex flex-row items-center space-x-10 cursor-pointer"
                  >
                    <p className="text-xl font-bold">
                      식재료, 음식 이름으로 검색하기
                    </p>
                    <img
                      className="h-20 hover:h-25"
                      src="assets\chevron.png"
                      alt=""
                    />
                  </div>
                  <div>
                    <p className="text-lg">
                      식재료와 음식 이름으로 검색을 할 수 있습니다.
                    </p>
                  </div>
                </div>
              </section>
              <div className="w-full h-100" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainPage;
