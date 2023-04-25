import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { useNavigateToTop } from "../hooks/useNavigateToTop";
import AlertModal from "../UI/AlertModal";

const SurveyLayout = () => {
  const token = useSelector((state) => state.auth.authentication.token);
  const navigate = useNavigateToTop();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!token) {
      setModalOpen(true);
    }
  }, []);
  const modalCloseHandler = () => {
    setModalOpen(false);
    navigate("/login");
  };

  return (
    <div className="bg-#ECECEC py-50 w-screen flex items-center justify-center">
      {modalOpen && (
        <AlertModal
          open={modalOpen}
          close={modalCloseHandler}
          onCheck={modalCloseHandler}
        >
          로그인이 필요한 서비스입니다!
        </AlertModal>
      )}
      {!modalOpen && (
        <main className="w-1024 bg-prettywhite shadow-md">
          <div className="flex flex-col items-center justify-center h-full">
            <Outlet />
          </div>
        </main>
      )}
    </div>
  );
};

export default SurveyLayout;
