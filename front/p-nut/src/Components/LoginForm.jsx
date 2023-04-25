import { Fragment, useState, useEffect, useReducer } from "react";
import { useNavigateToTop } from "../hooks/useNavigateToTop";
import { useDispatch, useSelector } from "react-redux";
import { loginHandler } from "../stores/authSlice";

import AlertModal from "../UI/AlertModal";

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigateToTop();
  const token = useSelector((state) => state.auth.authentication.token);
  const [modalOpen, setModalOpen] = useState(false);

  const emailReducer = (state, action) => {
    if (action.type === "USER_INPUT") {
      return {
        value: action.val,
        isValid: action.val.length !== 0,
      };
    }
    if (action.type === "INPUT_BLUR") {
      return {
        value: state.value,
        isValid: state.value.includes("@") && state.value.trim().length !== 0,
      };
    }
    if (action.type === "CLEAR") {
      return {
        value: "",
        isValid: state.isValid,
      };
    }
    return { value: "", isValid: false };
  };

  const passwordReducer = (state, action) => {
    if (action.type === "USER_INPUT") {
      return { value: action.val, isValid: action.val.length !== 0 };
    }
    if (action.type === "INPUT_BLUR") {
      return { value: state.value, isValid: state.value.length !== 0 };
    }
    if (action.type === "CLEAR") {
      return {
        value: "",
        isValid: state.isValid,
      };
    }
    return { value: "", isValid: false };
  };

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: "",
    isValid: true,
  });
  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: "",
    isValid: true,
  });
  const { isValid: emailIsValid } = emailState;
  const { isValid: passwordIsValid } = passwordState;

  const emailChangeHandler = (event) => {
    dispatchEmail({ type: "USER_INPUT", val: event.target.value });
  };
  const passwordChangeHandler = (event) => {
    dispatchPassword({ type: "USER_INPUT", val: event.target.value });
  };

  const validateEmailHandler = () => {
    dispatchEmail({ type: "INPUT_BLUR" });
  };
  const validatePasswordHandler = () => {
    dispatchPassword({ type: "INPUT_BLUR" });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    dispatch(
      loginHandler({ email: emailState.value, password: passwordState.value })
    );
    setTimeout(() => {
      setModalOpen(true);
    }, 200);
  };

  const modalCloseHander = () => {
    setModalOpen(false);
    dispatchEmail({ type: "CLEAR" });
    dispatchPassword({ type: "CLEAR" });
    navigate("/login");
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  return (
    <Fragment>
      <AlertModal
        open={modalOpen}
        close={modalCloseHander}
        onCheck={modalCloseHander}
      >
        이메일 혹은 비밀번호를 확인해주세요.
      </AlertModal>
      <p className="mx-75 my-50 text-xl text-gray-800 font-semibold">로그인</p>
      <form onSubmit={submitHandler}>
        <div className="flex flex-col">
          <label htmlFor="email" className="mx-75 text-gray-800">
            이메일
          </label>
          <div className="flex items-center">
            <input
              type="text"
              className="px-10 mx-75 my-12 w-465 h-50 border-2 border-gray-300 rounded-xl focus:border-blue-500"
              id="email"
              placeholder="이메일 주소를 입력해주세요."
              value={emailState.value}
              onChange={emailChangeHandler}
              onBlur={validateEmailHandler}
              autoComplete="off"
            />
          </div>
        </div>
        {!emailIsValid && (
          <span className="ml-75 px-15 text-red-500">
            이메일이 유효하지 않습니다.
          </span>
        )}
        <div className="mt-15 flex flex-col">
          <label htmlFor="password" className="mx-75 text-gray-800">
            비밀번호
          </label>
          <input
            type="password"
            className="px-10 mx-75 my-12 w-465 h-50 border-2 border-gray-300 rounded-xl focus:border-blue-500 font-noto"
            id="password"
            placeholder="********"
            value={passwordState.value}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
            autoComplete="off"
          />
        </div>
        {!passwordIsValid && (
          <span className="ml-75 px-15 text-red-500">
            비밀번호가 유효하지 않습니다.
          </span>
        )}
        <button
          type="submit"
          className="mx-75 mt-200 w-464 h-50 bg-red-400 rounded-xl text-white font-semibold"
        >
          로그인
        </button>
      </form>
    </Fragment>
  );
};

export default LoginForm;
