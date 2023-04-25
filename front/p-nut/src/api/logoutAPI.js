// import axiosInterface from "./axiosInterface";
import axios from "axios";
import { baseURL } from "./baseURL";

/*
Request needs access-token in the header
Check if the token is valid before logout request
If the token is not valid, refresh the token
*/

async function logoutAPI() {
  const state = JSON.parse(localStorage.getItem("persist:root"));
  if (!state) {
    return "token does not exist";
  }
  console.log("state: ", state);
  const authentication = JSON.parse(state.auth);
  let accessToken = authentication.authentication.token;
  const { refreshToken } = authentication.authentication;
  const { email } = authentication.authentication;
  console.log("logout");
  if (!accessToken) {
    return "token does not exist";
  }
  const checkResponse = await axios({
    method: "post",
    baseURL: baseURL,

    url: "/users/check",
    headers: {
      "access-token": accessToken,
      // "access-token": "asdasd",
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
        method: "post",
        baseURL: "https://pnut.site/api",
        url: "/users/logout",
        headers: {
          "access-token": accessToken,
        },
      });

      console.log("logout response1: ", response1);
      if (response1.status === 200) {
        return response1;
      }
      return response1.response;
    }
    if (refreshResponse.status === 202) {
      return refreshResponse;
    }
    return refreshResponse;
  } else {
    const response2 = await axios({
      method: "post",
      baseURL: "https://pnut.site/api",
      url: "/users/logout",
      headers: {
        "access-token": accessToken,
      },
    });

    console.log("logout response2: ", response2);
    if (response2.status === 200) {
      return response2;
    }
    return response2.response;
  }
}

export default logoutAPI;
