import React from "react";
import { useNavigateToTop } from "../hooks/useNavigateToTop";

const Footer = () => {
  const navigate = useNavigateToTop();

  const goToMain = () => {
    navigate("/");
  };
  const goToMyPage = () => {
    navigate("/mypage");
  };

  return (
    <div className="w-full h-350 flex justify-center bg-#FF6B6C/5 text-#2B2C2B">
      <div className="flex flex-col divide-y divide-gray-200 w-1200 py-30">
        <div className="flex flex-row pb-15">
          <div className="w-2/3 space-y-15">
            <div>
              <span className="text-xl font-extrabold">P.nut 고객센터</span>
              <span className="ml-5 text-md font-extrabold text-#FF6B6C">
                010.7337.3460
              </span>
            </div>
            <div className="space-x-10">
              <span className="text-sm font-bold ">월~목요일</span>
              <span className="text-sm">
                10:00 ~ 18:00 (점심시간 11:10 ~ 12:10)
              </span>
              <span className="text-sm font-bold ">토·일·공휴일</span>
              <span className="text-sm">휴무</span>
            </div>
          </div>
          <div className="flex w-1/3 space-x-20 ">
            <div
              className="cursor-pointer bg-#FF6B6C flex items-center justify-center w-180 h-70 hover:bg-red-500 transition duration-300"
              onClick={goToMain}
            >
              <p className="font-bold text-white text-md">메인으로</p>
            </div>
            <div
              className="cursor-pointer border border-#FF6B6C flex items-center justify-center w-180 h-70 hover:border-2 transition duration-300"
              onClick={goToMyPage}
            >
              <p className="font-extrabold text-#FF6B6C text-md">마이페이지</p>
            </div>
          </div>
        </div>
        <div className=" pt-15">
          <div className="mb-15">
            <img
              onClick={goToMain}
              className="cursor-pointer w-90 hover:border hover:border-transparent hover:rounded-5xl "
              src="/assets/Logo1.png"
              alt=""
            />
          </div>
          <div className="space-y-5">
            <p className="text-sm">
              상호명 : 주식회사 피넛 | 대표 : 김민경 | 소재지 : 서울특별시
              강남구 테헤란로 212 (역삼동 718-5번지) 멀티캠퍼스 역삼
            </p>
            <p className="text-sm text-#FF6B6C">
              제휴 및 남품 문의 : minofficial13@gmail.com
            </p>
          </div>
          <div className="flex items-end justify-between">
            <div className="space-x-10">
              <span className="text-sm font-bold">서비스 이용약관</span>
              <span className="text-sm font-bold">개인정보 처리방침</span>
              <span className="text-sm">
                Copyright ⓒ 2023 주식회사 피넛 All rights reserved.
              </span>
            </div>
            <div className="flex space-x-10">
              <a href="https://instagram.com/thwyylvm?igshid=MGNiNDI5ZTU=">
                <img src="/assets/instagram.png" alt="" />
              </a>
              <a href="https://www.ssafy.com/ksp/jsp/swp/swpMain.jsp">
                <img src="/assets/ssafy.png" alt="" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
