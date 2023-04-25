import React, { useState } from "react";
import NutrientDataForm from "../Components/NutrientDataForm";
import RecipeVideoForm from "../Components/RecipeVideoForm";

const FoodModal = (props) => {
  const { close, searchResult, food } = props;
  const open = true;

  // background div만 close
  const preventionClose = (event) => {
    event.stopPropagation();
  };

  // 유튜브 searchResult 보기
  console.log(
    "searchResult: ",
    searchResult[0].id.videoId,
    searchResult[0].snippet.title
  );

  // 모달 관련
  const modalShow = `
    @keyframes modalShow {
      from {
        opacity: 0;
        margin-top: -50px;
      }
      to {
        opacity: 1;
        margin-top: 0;
      }
    }
    `;

  const modalBgShow = `
    @keyframes modalBgShow {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    `;

  // 탭
  const [activeTab, setActiveTab] = useState("영양성분");

  const switchTab = (tabName) => {
    setActiveTab(tabName);
  };

  const renderTabContent = () => {
    if (activeTab === "영양성분") {
      return (
        <div>
          <NutrientDataForm nutrientData={food.nutrient} />
        </div>
      );
    } else if (activeTab === "레시피") {
      const videoData = searchResult.map((result) => ({
        url: result.id.videoId,
        title: result.snippet.title,
      }));

      return (
        <div className="flex justify-center space-x-30 pt-40">
          {videoData.map((video, index) => (
            <RecipeVideoForm
              key={index}
              videoUrl={video.url}
              videoTitle={video.title}
            />
          ))}
        </div>
      );
    }
  };

  return (
    <div
      className={`${
        open ? "flex items-center animate-modalBgShow" : "hidden"
      } fixed top-0 right-0 bottom-0 left-0 z-50 bg-black bg-opacity-60 transition-all duration-300
    `}
      style={{ animation: open ? modalBgShow : "" }}
      onClick={close}
    >
      {open ? (
        <section
          onClick={preventionClose}
          className="mx-auto bg-white rounded-lg max-w-450 w-1100 h-800"
          style={{ animation: open ? `modalShow 0.3s` : "" }}
        >
          <style>{modalShow}</style>
          <main className="flex flex-col p-4 m-50">
            {food ? (
              <div>
                <div className="flex">
                  {/* 음식 사진 */}
                  <div className="flex items-center justify-center w-1/2">
                    <div className="relative overflow-hidden rounded-lg w-400 h-300">
                      <img
                        src={food.url}
                        alt=""
                        className="absolute object-cover object-center w-full h-full transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                      />
                    </div>
                  </div>
                  {/* 음식 설명 */}
                  <div className="w-1/2 space-y-15">
                    <p className="text-lg text-gray-500">{food.desc}</p>
                    <div className="flex items-center space-x-10">
                      <p className="text-3xl font-bold">{food.name}</p>
                      <p className="px-10 py-5 bg-#FF6B6C/70 font-bold text-white rounded-full">
                        {Math.round(food.cal)}kcal
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-gray-500">
                      주 재료 : {food.ingredient}
                    </p>
                    <p className="text-xl font-medium">
                      &nbsp; &nbsp; &nbsp; &nbsp;{food.efficiency}
                    </p>
                  </div>
                </div>
                {/* 탭 */}
                <div className="flex mb-4 space-x-10 mt-50">
                  <button
                    type="button"
                    className={`${
                      activeTab === "영양성분"
                        ? "border-b-8 border-#FF6B6C  font-bold"
                        : "text-gray-400"
                    } px-4 py-2 text-xl text-bold focus:outline-none`}
                    onClick={() => switchTab("영양성분")}
                  >
                    영양성분
                  </button>
                  <button
                    type="button"
                    className={`${
                      activeTab === "레시피"
                        ? "border-b-8 border-#FF6B6C  font-bold"
                        : "text-gray-400"
                    } px-4 py-2 text-xl text-bold focus:outline-none`}
                    onClick={() => switchTab("레시피")}
                  >
                    레시피
                  </button>
                </div>
                <div className="w-1000 h-300">{renderTabContent()}</div>
              </div>
            ) : (
              <p>Loading...</p>
            )}
            <button
              type="button"
              onClick={close}
              className="px-4 py-2 text-white bg-gray-600 rounded w-100 h-30 mx-auto focus:outline-none hover:bg-gray-700"
            >
              닫기
            </button>
          </main>
        </section>
      ) : null}
    </div>
  );
};

export default React.memo(FoodModal);
