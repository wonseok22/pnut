import React from "react";
import { useNavigateToTop } from "../hooks/useNavigateToTop";

const PageNotFound = () => {
  const navigate = useNavigateToTop();

  const goToMain = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col justify-center py-150 text-#2B2C2B">
      <div className="w-1200 text-center mx-auto space-y-15">
        <p className="text-4xl pb-20 font-semibold">404 ERROR</p>
        <p className="text-lg">죄송합니다. 페이지를 찾을 수 없습니다.</p>
        <p className="text-lg">존재하지 않는 주소를 입력하셨거나,</p>
        <p className="text-lg">
          요청하신 페이지의 주소가 변경, 삭제되어 찾을 수 없습니다.
        </p>
        <img className="mx-auto pt-20" src="assets/404peanut.png" alt="" />
        <button
          onClick={goToMain}
          type="button"
          className="items-center  flex text-xl py-10 font-bold text-#FF6B6C mx-auto"
        >
          홈으로
          <img className="pl-20" src="assets/Arrow.png" alt="" />
        </button>
      </div>
    </div>
  );
};

export default PageNotFound;
