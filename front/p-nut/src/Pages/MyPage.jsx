import React, { useState, useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import { useNavigateToTop } from "../hooks/useNavigateToTop";
import { useDispatch, useSelector } from "react-redux";
import { logoutHandler } from "../stores/authSlice";

import MyPageSidebar from "../Components/MyPageSidebar";
import AlertModal from "../UI/AlertModal";
import MyPageUserInfo from "../Components/MyPageUserInfo";
import MyPageRecipe from "../Components/MyPageRecipe";

import getUserInfo from "../api/getUserInfo";
import getMyRecipe from "../api/getMyRecipe";
import deleteUser from "../api/deleteUser";

const MyPage = () => {
  const token = useSelector((state) => state.auth.authentication.token);
  const dispatch = useDispatch();
  const navigate = useNavigateToTop();

  const data = useLoaderData();
  console.log("data: ", data);

  const [activeTab, setActiveTab] = useState("userInfo");

  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };
  const checkDeleteUser = () => {
    console.log("checkDeleteUser");
    deleteUser();
    dispatch(logoutHandler(navigate));
  };

  useEffect(() => {
    if (!token) {
      dispatch(logoutHandler(navigate));
    }
  }, [token]);

  return (
    <div className="w-full flex justify-center text-#2B2C2B bg-gray-100">
      <AlertModal open={modalOpen} close={closeModal} onCheck={checkDeleteUser}>
        탈퇴하시겠습니까? 탈퇴 후 정보는 복구되지 않습니다.
      </AlertModal>
      <div className="flex bg-white w-1200">
        <div className="w-1/4 border-r">
          <MyPageSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onShowModal={openModal}
            name={data.userInfo.name}
            email={data.userInfo.email}
            profileImageURL={data.userInfo.profile_image_url}
          />
        </div>
        {/* MainContent */}
        <div className="w-3/4 p-75 px-30">
          {activeTab === "userInfo" && (
            <MyPageUserInfo userInfo={data.userInfo} />
          )}
          {activeTab === "myRecipe" && (
            <MyPageRecipe myRecipe={data.myRecipe} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPage;

export async function loader() {
  console.log("Loading My Page...");
  const userInfo = await getUserInfo();
  const myRecipe = await getMyRecipe();
  const data = {
    userInfo: userInfo,
    myRecipe: myRecipe,
  };

  return data;
}
