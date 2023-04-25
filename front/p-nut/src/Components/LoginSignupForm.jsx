import React from "react";
import { useNavigateToTop } from "../hooks/useNavigateToTop";

const LoginSignupForm = (props) => {
  const navigate = useNavigateToTop();
  const { currentPage } = props;
  const goToLoginSignup = () => {
    if (currentPage === "login") {
      navigate("/signup");
    }
    if (currentPage === "signup") {
      navigate("/login");
    }
  };
  const goToMain = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-row w-1232 h-661">
      <div className="w-1/2 bg-orange-500 rounded-l-xl">
        <p className="ml-75 my-50 font-bold text-2xl text-gray-200">
          당신만의 영양 솔루션,
        </p>
        <img
          className="mx-136 mt-90 w-300 h-270 hover:border hover:border-orange-500 hover:rounded-xl"
          src="assets\Logo1.png"
          alt="Logo Image"
          onClick={goToMain}
        />
        <div className="ml-75 mt-110">
          <span className="text-gray-200 font-semibold">{props.phrase}</span>
          {/* <span className="mx-12 relative group inline-block">
            <span className="text font-semibold rounded hover:bg-orange-700 hover:text-gray-300 hover:shadow-md transition duration-300">
              {props.direction}
            </span>
            <span className="absolute h-0.5 w-full bg-black bottom-1 left-0" />
          </span> */}
          <button
            type="button"
            className="ml-12 px-8 py-8 text-gray-200 font-semibold rounded hover:bg-orange-400 hover:text-gray-900 hover:shadow-md transition duration-300"
            onClick={goToLoginSignup}
          >
            {props.direction}
          </button>
        </div>
      </div>
      <div className="w-1/2 bg-white rounded-r-xl">{props.children}</div>
    </div>
  );
};

export default LoginSignupForm;
