import React from "react";
import { useNavigate } from "react-router-dom";

const SurveyIndexPage = () => {
  const navigate = useNavigate();

  const startBtnClickHandler = () => {
    navigate("symptoms");
  };

  return (
    <div className="w-516 py-50 ">
      <img src="/assets/Logo1.png" alt="" className="h-58" />
      <div className="text-40 mt-42 mb-48">
        <div className="h-48">피넛!</div>
        <div className="font-bold h-48">내 건강을 알려줘!</div>
      </div>
      <div className="text-17">몇 가지 질문에 답하고</div>
      <div className="text-17">나에게 필요한 영양성분을 알아보세요.</div>
      <div className="mt-56 mb-100 text-13 text-#7F807F">
        약 5분 정도 소요됩니다.
      </div>
      <button
        type="button"
        className="bg-#FF6B6C rounded-42 w-full h-57 font-bold text-21 flex flex-col items-center justify-center text-prettywhite hover:bg-red-500"
        onClick={() => {
          startBtnClickHandler();
        }}
      >
        시작하기
      </button>
      <div className="mt-13 text-13 text-#7F807F">
        ※ 질병의 진단 및 치료는 전문적인 의료기관을 이용하세요.
      </div>
    </div>
  );
};

export default SurveyIndexPage;
