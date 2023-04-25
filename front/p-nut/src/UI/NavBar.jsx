import { Fragment, React } from "react";
import { Menu, Transition } from "@headlessui/react";
import { useNavigateToTop } from "../hooks/useNavigateToTop";
import { useDispatch, useSelector } from "react-redux";
import { logoutHandler } from "../stores/authSlice";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const NavBar = () => {
  const token = useSelector((state) => state.auth.authentication.token);

  const dispatch = useDispatch();
  const navigate = useNavigateToTop();

  const logout = () => {
    dispatch(logoutHandler(navigate));
  };
  const goToMain = () => {
    navigate("/");
  };
  const goToLogin = () => {
    navigate("/login");
  };
  const goToSignup = () => {
    navigate("/signup");
  };
  const goToMyPage = () => {
    navigate("/mypage");
  };

  return (
    <div className="fixed z-50 flex w-full p-3 h-60 bg-white/80 z-100">
      <div className="flex items-center w-full justify-evenly">
        <img
          className="cursor-pointer h-50 hover:border hover:border-transparent hover:rounded-5xl"
          src="/assets/Logo1.png"
          alt="logo"
          onClick={goToMain}
        />

        <div className="flex items-center space-x-50">
          {/* 음식추천 */}
          <Menu as="div" className="relative w-170">
            <div>
              <Menu.Button className="flex items-center justify-center w-full font-regular text-md hover:font-semibold">
                음식추천
                <img
                  className="h-10 ml-10 rotate-90"
                  src="/assets/chevron.png"
                  alt=""
                />
              </Menu.Button>
            </div>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 origin-top-right w-170 rounded-5 bg-white/70 ">
                <div className="py-2">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        type="button"
                        onClick={() => {
                          navigate("/my-survey");
                        }}
                        className={classNames(
                          active ? "bg-white " : "",
                          "block px-15 py-10 text-md rounded-5 w-full text-start"
                        )}
                      >
                        개인맞춤추천
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        type="button"
                        onClick={() => {
                          navigate("/symptoms");
                        }}
                        href="#"
                        className={classNames(
                          active ? "bg-white " : "",
                          "block px-15 py-10 text-md rounded-5  w-full text-start"
                        )}
                      >
                        보편적인 증상
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        type="button"
                        onClick={() => navigate("/search")}
                        className={classNames(
                          active ? "bg-white " : "",
                          "block px-15 py-10 text-md rounded-5  w-full text-start"
                        )}
                      >
                        식재료 음식 검색
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
          {/* 게시판 */}
          <Menu as="div" className="relative w-170">
            <div>
              <Menu.Button className="flex items-center justify-center w-full font-regular text-md hover:font-semibold">
                게시판
                <img
                  className="h-10 ml-10 rotate-90"
                  src="/assets/chevron.png"
                  alt=""
                />
              </Menu.Button>
            </div>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 origin-top-right w-170 rounded-5 bg-white/70 ">
                <div className="py-2">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        type="button"
                        onClick={() => navigate("/newpost")}
                        className={classNames(
                          active ? "bg-white " : "",
                          "block px-15 py-10 text-md rounded-5  w-full text-start"
                        )}
                      >
                        게시글 작성
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        type="button"
                        onClick={() => navigate("/board")}
                        className={classNames(
                          active ? "bg-white " : "",
                          "block px-15 py-10 text-md rounded-5  w-full text-start"
                        )}
                      >
                        게시물 조회
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
          <Menu>
            <Menu.Item>
              {({ active }) => (
                <button
                  type="button"
                  onClick={() => navigate("/newsurvey")}
                  className={classNames(
                    active ? "bg-white " : "",
                    "block px-15 py-10 text-md rounded-5  w-full text-start hover:font-semibold"
                  )}
                >
                  설문조사
                </button>
              )}
            </Menu.Item>
          </Menu>
        </div>

        {!token && (
          <div className="flex items-center text-sm space-x-30">
            <div
              className="cursor-pointer px-12 py-8 font-semibold text-gray-800 transition duration-300 bg-gray-100 rounded-full hover:bg-gray-300"
              onClick={goToSignup}
            >
              회원가입
            </div>
            <div
              className="cursor-pointer px-12 py-8 text-white font-semibold bg-#FF6B6C rounded-full hover:bg-red-500 transition duration-300"
              onClick={goToLogin}
            >
              로그인
            </div>
          </div>
        )}
        {token && (
          <div className="flex items-center text-sm space-x-30">
            <div
              className="cursor-pointer px-12 py-8 font-semibold text-gray-800 transition duration-300 bg-gray-100 rounded-full hover:bg-gray-300"
              onClick={goToMyPage}
            >
              마이페이지
            </div>
            <div
              className="cursor-pointer px-12 py-8 text-white font-semibold bg-#FF6B6C rounded-full hover:bg-red-500 transition duration-300"
              onClick={logout}
            >
              로그아웃
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
