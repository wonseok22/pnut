import { Fragment, useState, useEffect, useReducer } from "react";
import { useNavigateToTop } from "../hooks/useNavigateToTop";
import createUserAPI from "../api/createUserAPI";
import checkDuplicationAPI from "../api/checkDuplicationAPI";
import requestCodeAPI from "../api/requestCodeAPI";
import checkCodeAPI from "../api/checkCodeAPI";

const SignupForm = () => {
  const navigate = useNavigateToTop();

  const [nicknameIsTouched, setNicknameIsTouched] = useState(false);
  const [genderIsTouched, setGenderIsTouched] = useState(false);
  const [emailIsTouched, setEmailIsTouched] = useState(false);

  const [userInputGender, setUserInputGender] = useState("");
  const [userInputCode, setUserInputCode] = useState("");

  const [isCodeValid, setIsCodeValid] = useState(false);
  const [codeValidationMessage, setCodeValidationMessage] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  const nicknameReducer = (state, action) => {
    if (action.type === "USER_INPUT") {
      return {
        value: action.val,
        isValid: action.val.length !== 0,
        isDuplicated: state.isDuplicated,
      };
    }
    if (action.type === "INPUT_BLUR") {
      return {
        value: state.value,
        isValid: state.value.trim().length !== 0 && !state.isDuplicated,
        isDuplicated: state.isDuplicated,
      };
    }
    if (action.type === "DUPLICATION_CHECKED") {
      return {
        value: state.value,
        isValid: action.val.valid,
        isDuplicated: action.val.duplicated,
      };
    }
    if (action.type === "DUPLICATION_PASSED") {
      return {
        value: state.value,
        isValid: state.isValid,
        isDuplicated: action.val,
      };
    }
    return { value: "", isValid: false, isDuplicated: false };
  };
  const nameReducer = (state, action) => {
    if (action.type === "USER_INPUT") {
      return {
        value: action.val,
        isValid: action.val.length !== 0,
      };
    }
    if (action.type === "INPUT_BLUR") {
      return {
        value: state.value,
        isValid: state.value.trim().length !== 0,
      };
    }
    return { value: "", isValid: false };
  };
  const ageReducer = (state, action) => {
    if (action.type === "USER_INPUT") {
      return {
        value: action.val,
        isValid:
          action.val.length !== 0 &&
          parseInt(action.val.trim()) > 0 &&
          parseInt(action.val.trim()) < 100,
      };
    }
    if (action.type === "INPUT_BLUR") {
      return {
        value: state.value,
        isValid:
          state.value.trim().length !== 0 &&
          parseInt(state.value.trim()) > 0 &&
          parseInt(state.value.trim() < 100),
      };
    }
    return { value: "", isValid: false };
  };
  const emailReducer = (state, action) => {
    if (action.type === "USER_INPUT") {
      return {
        value: action.val,
        isValid: action.val.length !== 0 && action.val.includes("@"),
        isDuplicated: state.isDuplicated,
      };
    }
    if (action.type === "INPUT_BLUR") {
      return {
        value: state.value,
        isValid:
          state.value.includes("@") &&
          state.value.trim().length !== 0 &&
          !state.isDuplicated,
        isDuplicated: state.isDuplicated,
      };
    }
    if (action.type === "DUPLICATION_CHECKED") {
      return {
        value: state.value,
        isValid: action.val.valid,
        isDuplicated: action.val.duplicated,
      };
    }
    if (action.type === "DUPLICATION_PASSED") {
      return {
        value: state.value,
        isValid: state.isValid,
        isDuplicated: action.val,
      };
    }
    return { value: "", isValid: false, isDuplicated: false };
  };
  const passwordReducer = (state, action) => {
    if (action.type === "PASSWORD1_INPUT") {
      return {
        password1: action.val,
        password2: state.password2,
        passwordMatched: action.val === state.password2,
        passwordIsValid:
          action.val === state.password2 &&
          action.val.length !== 0 &&
          state.password2.length !== 0,
      };
    }
    if (action.type === "PASSWORD2_INPUT") {
      return {
        password1: state.password1,
        password2: action.val,
        passwordMatched: state.password1 === action.val,
        passwordIsValid:
          state.password1 === action.val &&
          state.password1.length !== 0 &&
          action.val.length !== 0,
      };
    }
    return {
      password1: "",
      password2: "",
      passwordMatched: false,
      passwodIsValid: false,
    };
  };

  const [nicknameState, dispatchNickname] = useReducer(nicknameReducer, {
    value: "",
    isValid: false,
    isDuplicated: false,
  });
  const [nameState, dispatchName] = useReducer(nameReducer, {
    value: "",
    isValid: false,
  });
  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: "",
    isValid: false,
    isDuplicated: false,
  });
  const [ageState, dispatchAge] = useReducer(ageReducer, {
    value: "",
    isValid: false,
  });
  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    password1: "",
    password2: "",
    passwordMatched: false,
    passwordIsValid: false,
  });

  const nicknameChangeHandler = (event) => {
    dispatchNickname({ type: "DUPLICATION_PASSED", val: false });
    dispatchNickname({ type: "USER_INPUT", val: event.target.value });
    setNicknameIsTouched(true);
  };
  const nameChangeHandler = (event) => {
    dispatchName({ type: "USER_INPUT", val: event.target.value });
  };
  const genderChangeHandler = (event) => {
    setUserInputGender(event.target.value);
    setGenderIsTouched(true);
  };
  const ageChangeHandler = (event) => {
    dispatchAge({ type: "USER_INPUT", val: event.target.value });
  };
  const emailChangeHandler = (event) => {
    dispatchEmail({ type: "DUPLICATION_PASSED", val: false });
    dispatchEmail({ type: "USER_INPUT", val: event.target.value });
    setEmailIsTouched(true);
  };
  const codeChangeHandler = (event) => {
    setUserInputCode(event.target.value);
  };
  const password1ChangeHandler = (event) => {
    dispatchPassword({ type: "PASSWORD1_INPUT", val: event.target.value });
  };
  const password2ChangeHandler = (event) => {
    dispatchPassword({ type: "PASSWORD2_INPUT", val: event.target.value });
  };

  const duplicateNicknameCheckHandler = async (event) => {
    const message = await checkDuplicationAPI("nickname", event.target.value);
    if (message === "nickname duplication") {
      dispatchNickname({
        type: "DUPLICATION_CHECKED",
        val: { valid: false, duplicated: true },
      });
      dispatchNickname({ type: "INPUT_BLUR", val: false });
    } else {
      dispatchNickname({ type: "DUPLICATION_PASSED", val: false });
      dispatchNickname({ type: "INPUT_BLUR", val: true });
    }
  };
  const duplicateEmailCheckHandler = async (event) => {
    const message = await checkDuplicationAPI("email", event.target.value);
    console.log("message: ", message);
    if (message === "email duplication") {
      dispatchEmail({
        type: "DUPLICATION_CHECKED",
        val: { valid: false, duplicated: true },
      });
      dispatchEmail({ type: "INPUT_BLUR", val: false });
    } else {
      dispatchEmail({ type: "DUPLICATION_PASSED", val: false });
      dispatchEmail({ type: "INPUT_BLUR", val: true });
    }
  };

  const requestCodeHandler = () => {
    requestCodeAPI(emailState.value);
  };
  const checkCodeHandler = async () => {
    const checkResult = await checkCodeAPI(emailState.value, userInputCode);
    console.log("checkResult: ", checkResult);
    if (checkResult === "valid code") {
      setCodeValidationMessage("인증에 성공했습니다.");
      setIsCodeValid(true);
    }
    if (checkResult === "code timeout") {
      // setCodeValidationMessage("인증 번호가 만료되었습니다.");
      setCodeValidationMessage("유효하지 않은 인증 번호입니다.");
      setIsCodeValid(false);
    }
    if (checkResult === "invalid code") {
      setCodeValidationMessage("유효하지 않은 인증 번호입니다.");
      setIsCodeValid(false);
    }
  };

  const submitHandler = (event) => {
    event.preventDefault();
    createUserAPI(
      ageState.value,
      emailState.value,
      userInputGender,
      nameState.value,
      nicknameState.value,
      passwordState.password2
    );
    navigate("/login");
  };

  useEffect(() => {
    setIsFormValid(
      nicknameState.isValid &&
        nameState.isValid &&
        ageState.isValid &&
        emailState.isValid &&
        isCodeValid &&
        passwordState.passwordIsValid
    );
  }, [
    nicknameState,
    nameState,
    ageState,
    emailState,
    isCodeValid,
    passwordState,
  ]);

  return (
    <Fragment>
      <p className="text-2xl font-bold text-gray-800 mx-75 my-25">
        이메일로 가입하세요
      </p>
      <form onSubmit={submitHandler}>
        <div className="flex flex-col">
          <label htmlFor="nickname" className="text-gray-800 mx-75">
            닉네임
          </label>
          <div className="flex items-center">
            <input
              type="text"
              id="nickname"
              className={`px-10 ml-75 my-10 w-300 h-40 border-2 rounded-10 ${
                nicknameState.isValid ? "border-green-500" : "border-gray-300"
              } focus:border-blue-500`}
              onChange={nicknameChangeHandler}
              onBlur={duplicateNicknameCheckHandler}
            />
            {nicknameIsTouched &&
              nicknameState.isDuplicated &&
              !nicknameState.isValid && (
                <span className="ml-10 text-red-500">
                  사용 중인 닉네임입니다.
                </span>
              )}
            {nicknameIsTouched &&
              !nicknameState.isDuplicated &&
              !nicknameState.isValid && (
                <span className="ml-10 text-red-500">
                  유효하지 않은 닉네임입니다.
                </span>
              )}
            {nicknameIsTouched && nicknameState.isValid && (
              <span className="ml-10 text-green-500">
                사용 가능한 닉네임입니다.
              </span>
            )}
          </div>
        </div>

        <div className="flex my-10 mx-75">
          <div className="flex flex-col flex-1">
            <label htmlFor="name" className="text-gray-800 mb-7">
              이름 (실명)
            </label>
            <input
              type="text"
              id="name"
              className={`px-10 w-120 h-40 border-2 rounded-10 focus:border-blue-500 ${
                nameState.isValid ? "border-green-500" : "border-gray-300"
              }`}
              onChange={nameChangeHandler}
            />
          </div>
          <div className="flex flex-col flex-1">
            <label htmlFor="gender" className="text-gray-800 mb-7">
              성별
            </label>
            <select
              name="gender"
              className={`cursor-pointer px-10 w-120 h-40 border-2 rounded-10 focus:border-blue-500 ${
                genderIsTouched ? "border-green-500" : "border-gray-300"
              }`}
              onChange={genderChangeHandler}
            >
              <option value="0">남성</option>
              <option value="1">여성</option>
            </select>
          </div>
          <div className="flex flex-col flex-1">
            <label htmlFor="age" className="text-gray-800 mb-7">
              나이 (만)
            </label>
            <input
              type="text"
              id="age"
              className={`px-10 w-120 h-40 border-2 rounded-10 focus:border-blue-500 ${
                ageState.isValid ? "border-green-500" : "border-gray-300"
              }`}
              onChange={ageChangeHandler}
            />
          </div>
        </div>
        <div className="flex">
          <div className="flex flex-col flex-1 mt-10 mb-4 ml-75">
            <label htmlFor="email" className="text-gray-800">
              이메일
            </label>
            <input
              type="text"
              id="email"
              className={`px-15 mt-10 w-330 h-40 border-2 rounded-10 ${
                emailState.isValid ? "border-green-500" : "border-gray-300"
              } focus:border-blue-500`}
              placeholder="이메일 주소를 입력해주세요."
              onChange={emailChangeHandler}
              onBlur={duplicateEmailCheckHandler}
              autoComplete="off"
            />
          </div>
          <div className="flex-1">
            <button
              type="button"
              className="h-40 font-semibold text-white bg-red-400 mx-15 mt-44 w-120 rounded-xl"
              onClick={requestCodeHandler}
            >
              인증번호 받기
            </button>
          </div>
        </div>
        {emailIsTouched && emailState.isDuplicated && !emailState.isValid && (
          <span className="text-red-500 ml-75 px-15">
            사용 중인 이메일입니다.
          </span>
        )}
        {emailIsTouched && !emailState.isDuplicated && !emailState.isValid && (
          <span className="text-red-500 ml-75 px-15">
            유효하지 않은 이메일입니다.
          </span>
        )}
        {emailIsTouched && emailState.isValid && (
          <span className="text-green-500 ml-75 px-15">
            사용 가능한 이메일입니다.
          </span>
        )}
        <div>
          <div className="flex">
            <div className="flex flex-col flex-1 mt-5 mb-4 ml-75">
              <input
                type="text"
                id="code"
                className={`px-15 w-330 h-40 border-2 rounded-10 focus:border-blue-500 ${
                  isCodeValid ? "border-green-500" : "border-gray-300"
                }`}
                placeholder="인증 코드를 입력해주세요."
                onChange={codeChangeHandler}
              />
            </div>
            <div className="flex-1">
              <button
                type="button"
                className="h-40 mt-5 font-semibold text-white bg-blue-500 mx-15 w-120 rounded-xl"
                onClick={checkCodeHandler}
              >
                인증번호 확인
              </button>
            </div>
          </div>
          <span
            className={`ml-75 px-15 ${
              isCodeValid ? "text-green-500" : "text-red-500"
            }`}
          >
            {codeValidationMessage}
          </span>
        </div>
        <div className="inline-flex mt-10 ml-75">
          <div className="flex flex-col">
            <label htmlFor="password" className="text-gray-800">
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              className="h-40 px-10 mt-10 text-gray-400 border-2 border-gray-300 w-150 rounded-10 font-noto focus:border-blue-500"
              placeholder="********"
              onChange={password1ChangeHandler}
              autoComplete="off"
            />
          </div>
          <div className="flex flex-col ml-35">
            <label htmlFor="passwordcheck" className="text-gray-800 ">
              비밀번호 확인
            </label>
            <input
              type="password"
              id="passwordcheck"
              className={`px-10 mt-10 w-150 h-40 border-2 rounded-10 text-gray-400 font-noto ${
                passwordState.passwordIsValid
                  ? "border-green-500"
                  : "border-gray-300"
              }`}
              placeholder="********"
              onChange={password2ChangeHandler}
              autoComplete="off"
            />
          </div>
          {passwordState.passwordIsValid && (
            <span className="mt-40 ml-3 text-green-500 px-15">일치합니다.</span>
          )}
        </div>
        <button
          type="submit"
          className={`mx-75 mt-50 w-464 h-50 bg-red-400 rounded-xl text-white font-semibold ${
            isFormValid ? "" : "opacity-50"
          }`}
          disabled={!isFormValid}
        >
          회원가입
        </button>
      </form>
    </Fragment>
  );
};

export default SignupForm;
