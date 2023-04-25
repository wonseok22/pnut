import axios from "axios";
import store from "../stores";
import { removeTokenHandler } from "../stores/authSlice";
import { baseURL } from "./baseURL";

async function putUserInfo(
  nickname,
  name,
  gender,
  age,
  password,
  profileImage,
  profileImageUrl
) {
  const state = JSON.parse(localStorage.getItem("persist:root"));
  if (!state) {
    return "token does not exist";
  }
  const authentication = JSON.parse(state.auth);
  let accessToken = authentication.authentication.token;
  const { refreshToken } = authentication.authentication;
  const { email } = authentication.authentication;
  const formData = new FormData();
  let formObj;

  console.log("profileImage: ", profileImage);

  if (password.trim()) {
    formObj = {
      email: email,
      nickname: nickname,
      name: name,
      gender: gender,
      age: `${age}`,
      password: password,
    };
  } else {
    formObj = {
      email: email,
      nickname: nickname,
      name: name,
      gender: gender,
      age: `${age}`,
    };
  }

  if (!profileImage) {
    formObj.profileImageUrl = profileImageUrl;
  }

  console.log("formObj: ", formObj);
  formData.append(
    "userDto",
    new Blob([JSON.stringify(formObj)], {
      type: "application/json",
    })
  );

  if (profileImage) {
    formData.append("multipartFile", profileImage);
  }

  // console.log("formData: ", formData);
  for (const key of formData.keys()) {
    console.log("formData key: ", key);
  }
  for (const value of formData.values()) {
    console.log("formData value: ", value);
  }

  if (!accessToken) {
    return "token does not exist";
  }

  console.log("refreshToken: ", refreshToken);
  console.log("email: ", email);
  const checkResponse = await axios({
    method: "post",
    baseURL: baseURL,
    url: "/users/check",
    headers: {
      "access-token": accessToken,
    },
  });
  console.log("checkResponse: ", checkResponse);

  if (checkResponse.status === 202) {
    const refreshResponse = await axios({
      method: "post",
      baseURL: baseURL,
      url: "/users/refresh",
      headers: {
        "refresh-token": refreshToken,
      },
      data: {
        email: email,
      },
    });
    console.log("refreshResponse: ", refreshResponse);
    if (refreshResponse.status === 200) {
      accessToken = refreshResponse.data["access-token"];

      const response1 = await axios({
        method: "put",
        baseURL: baseURL,
        url: "/users",
        headers: {
          "access-token": accessToken,
        },
        data: formData,
      });

      if (response1.status === 200) {
        console.log("putUserInfo successed!");
        return response1;
      }
      return response1.response;
    }
    if (refreshResponse.status === 202) {
      console.log("refreshResponse 202");
      store.dispatch(removeTokenHandler());
      return refreshResponse;
    }
  } else {
    const response2 = await axios({
      method: "put",
      baseURL: baseURL,
      url: "/users",
      headers: {
        "access-token": accessToken,
      },
      data: formData,
    });

    if (response2.status === 200) {
      console.log("putUserInfo successed!");
      return response2;
    }
    return response2.response;
  }
}

export default putUserInfo;
