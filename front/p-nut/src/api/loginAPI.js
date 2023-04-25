// import axiosInterface from "./axiosInterface";
import axios from "axios";
import { baseURL } from "./baseURL";

/*
Request needs email, password
*/

async function loginAPI(email, password) {
  const response = await axios({
    method: "post",
    baseURL: baseURL,
    url: "/users/login",
    data: {
      email: email,
      password: password,
    },
  });
  return response;
}

export default loginAPI;
