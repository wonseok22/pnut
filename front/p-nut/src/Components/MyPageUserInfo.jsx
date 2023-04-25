import React, { Fragment, useState, useReducer, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import checkDuplicationAPI from "../api/checkDuplicationAPI";
import putUserInfo from "../api/putUserInfo";
import { imageBaseURL } from "../api/baseURL";

import imageCompression from "browser-image-compression";

const MyPageUserInfo = ({ userInfo }) => {
  const navigate = useNavigate();

  const [nicknameIsTouched, setNicknameIsTouched] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const [userInputGender, setUserInputGender] = useState(userInfo.gender);
  const [oldProfileImageURL, setOldProfileImageURL] = useState(
    `${imageBaseURL}/${userInfo.profile_image_url}`
  );
  const [newProfileImageURL, setNewProfileImageURL] = useState();
  const [userProfileImage, setUserProfileImage] = useState();

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
    value: userInfo.nickname,
    isValid: true,
    isDuplicated: false,
  });
  const [nameState, dispatchName] = useReducer(nameReducer, {
    value: userInfo.name,
    isValid: true,
  });
  const [ageState, dispatchAge] = useReducer(ageReducer, {
    value: userInfo.age,
    isValid: true,
  });
  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    password1: "",
    password2: "",
    passwordMatched: true,
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
  };
  const ageChangeHandler = (event) => {
    dispatchAge({ type: "USER_INPUT", val: event.target.value });
  };
  const password1ChangeHandler = (event) => {
    dispatchPassword({ type: "PASSWORD1_INPUT", val: event.target.value });
  };
  const password2ChangeHandler = (event) => {
    dispatchPassword({ type: "PASSWORD2_INPUT", val: event.target.value });
  };

  const duplicateNicknameCheckHandler = async (event) => {
    const message = await checkDuplicationAPI("nickname", event.target.value);
    if (
      message === "nickname duplication" &&
      nicknameState.value !== userInfo.nickname
    ) {
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

  const actionImgCompress = async (fileSrc) => {
    console.log("Compressing...");

    const options = {
      maxSizeMB: 0.2,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    try {
      const compressedBlob = await imageCompression(fileSrc, options);
      console.log("compressed blob: ", compressedBlob);
      const compressedFile = new File([compressedBlob], fileSrc.name, {
        type: fileSrc.type,
      });
      console.log("compressed file: ", compressedFile);
      setUserProfileImage(compressedFile);
      const fileReader = new FileReader();
      fileReader.readAsDataURL(compressedFile);
      fileReader.onload = (data) => {
        setNewProfileImageURL(data.target.result);
      };
    } catch (error) {
      console.log("compressing error: ", error);
    }
  };

  const uploadImage = (event) => {
    console.log("image uploaded: ", event.target.files[0]);
    const file = event.target.files[0];
    actionImgCompress(file);
    // setUserProfileImage(file);

    // const fileReader = new FileReader();
    // fileReader.readAsDataURL(file);
    // fileReader.onload = (data) => {
    //   // console.log("fileReader data: ", data);
    //   setNewProfileImageURL(data.target.result);
    // };
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    const response = await putUserInfo(
      nicknameState.value,
      nameState.value,
      userInputGender,
      Number(ageState.value),
      passwordState.password2,
      userProfileImage,
      oldProfileImageURL
    );
    if (response.status === 200) {
      setNicknameIsTouched(false);
      if (newProfileImageURL) {
        setOldProfileImageURL(newProfileImageURL);
      }
      setNewProfileImageURL();
      navigate("/mypage");
    }
  };

  useEffect(() => {
    setIsFormValid(
      nicknameState.isValid &&
        nameState.isValid &&
        ageState.isValid &&
        passwordState.passwordMatched
    );
  }, [nicknameState, nameState, ageState, passwordState]);

  return (
    <Fragment>
      <p className="mt-5 text-xl font-bold text-gray-800 ml-30">
        회원정보 수정
      </p>
      <form onSubmit={submitHandler}>
        <div className="flex flex-col items-center mt-40">
          <img
            className="rounded-full shadow-md h-130 w-130"
            src={newProfileImageURL || oldProfileImageURL}
            alt=""
          />
          <label
            className="mt-20 mb-10 cursor-pointer text-sky-500 font-semibold hover:text-blue-500"
            htmlFor="profileImg"
          >
            프로필 이미지 변경
          </label>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            id="profileImg"
            onChange={uploadImage}
          />
          {/* <img
            className="relative transition duration-200 ease-in-out transform left-80 -top-40 hover:opacity-80"
            src="assets/imageUpdatePencil.png"
            alt=""
          /> */}
        </div>

        <div className="ml-200">
          <div className="flex flex-col">
            <label htmlFor="nickname" className="text-gray-800">
              닉네임
            </label>
            <div>
              <input
                type="text"
                id="nickname"
                className="px-10 my-10 w-277 h-40 border-2 border-gray rounded-10 focus:border-blue-500"
                value={nicknameState.value}
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

          <div className="flex my-10">
            <div className="flex flex-col">
              <label htmlFor="name" className="text-gray-800 mb-7">
                이름 (실명)
              </label>
              <input
                type="text"
                id="name"
                className="px-10 w-120 h-40 border-2 border-gray rounded-10 focus:border-blue-500"
                value={nameState.value}
                onChange={nameChangeHandler}
              />
            </div>
            <div className="flex flex-col ml-40">
              <label htmlFor="gender" className="text-gray-800 mb-7">
                성별
              </label>
              <select
                name="gender"
                value={userInputGender}
                className="cursor-pointer h-40 border-2 border-gray-300 first-letter:px-10 w-120 rounded-10 focus:border-blue-500"
                onChange={genderChangeHandler}
              >
                <option value="0">남성</option>
                <option value="1">여성</option>
              </select>
            </div>
            <div className="flex flex-col ml-40">
              <label htmlFor="age" className="text-gray-800 mb-7">
                나이 (만)
              </label>
              <input
                type="text"
                id="age"
                className="px-10 w-120 h-40 border-2 border-gray rounded-10 focus:border-blue-500"
                value={ageState.value}
                onChange={ageChangeHandler}
              />
            </div>
          </div>

          <div className="inline-flex mt-10">
            <div className="flex flex-col">
              <label htmlFor="password" className="text-gray-800">
                비밀번호
              </label>
              <input
                type="password"
                id="password"
                className="h-40 px-10 mt-10 text-gray-400 border-2 border-gray-300 w-205 rounded-10 font-noto focus:border-blue-500"
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
                className="px-10 mt-10 w-205 h-40 border-2 border-gray rounded-10 text-gray-400 font-noto"
                placeholder="********"
                onChange={password2ChangeHandler}
                autoComplete="off"
              />
            </div>
            {passwordState.passwordMatched && passwordState.passwordIsValid && (
              <span className="mt-40 ml-3 text-green-500 px-15">
                일치합니다.
              </span>
            )}
          </div>
        </div>
        <button
          type="submit"
          className={`ml-280 mt-50 w-300 h-50 bg-red-400 rounded-xl text-white font-semibold ${
            isFormValid ? "" : "opacity-50"
          }`}
          disabled={!isFormValid}
        >
          수정완료
        </button>
      </form>
    </Fragment>
  );
};

export default MyPageUserInfo;
