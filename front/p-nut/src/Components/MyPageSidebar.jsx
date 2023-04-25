import React from "react";
import { useNavigateToTop } from "../hooks/useNavigateToTop";
import { imageBaseURL } from "../api/baseURL";

const MyPageSidebar = ({
  activeTab,
  setActiveTab,
  onShowModal,
  name,
  email,
  profileImageURL,
}) => {
  const showModal = () => {
    onShowModal();
  };
  const navigate = useNavigateToTop();

  const surveyUpdateBtnClickHandler = () => {
    navigate("/newsurvey/symptoms");
  };

  return (
    <div className="flex justify-center w-full text-center">
      <div className="flex flex-col w-250 space-y-50 my-75">
        {/* 프로필 */}
        <div className="space-y-10">
          <img
            className="mx-auto rounded-full shadow-lg h-100 w-100"
            // src="assets\profileimage.png"
            src={`${imageBaseURL}/${profileImageURL}`}
            alt=""
          />
          <p className="pt-5 text-lg font-bold">{name}</p>
          <p>{email}</p>
        </div>
        {/* 설문조사 수정 */}
        {/* <div className="rounded-10 bg-#FF6B6C/30 text-#FF6B6C"> */}
        <div
          className="cursor-pointer rounded-10 text-#FF6B6C border border-#FF6B6C hover:bg-#FF6B6C hover:text-white"
          onClick={surveyUpdateBtnClickHandler}
        >
          <p className="font-extrabold py-15">설문조사 수정</p>
        </div>
        {/* 내비게이션 */}
        <div className="cursor-pointer text-start divide-y divide-gray-200 text-#535453 font-semibold ">
          <div
            className={`flex py-15 px-10 hover:bg-gray-100  ${
              activeTab === "userInfo" ? "bg-gray-100 " : ""
            }`}
            onClick={() => setActiveTab("userInfo")}
          >
            회원 정보 수정
          </div>
          <div
            className={`flex py-15 px-10 hover:bg-gray-100  ${
              activeTab === "myRecipe" ? "bg-gray-100 " : ""
            }`}
            onClick={() => setActiveTab("myRecipe")}
          >
            내가 작성한 레시피
          </div>
        </div>
        {/* 로그아웃, 회원탈퇴 */}
        <div className="space-y-20">
          <p className="cursor-pointer flex items-center justify-center text-gray-500">
            회원탈퇴
            <img
              className="pl-5 scale-50 hover:rounded-xl hover:px-10"
              src="assets\chevron.png"
              alt=""
              onClick={showModal}
            />
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyPageSidebar;
