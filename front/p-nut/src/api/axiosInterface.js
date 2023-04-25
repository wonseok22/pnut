import axios from "axios";
import store from "../stores";
import { updateTokenHandler, removeTokenHandler } from "../stores/authSlice";
import { baseURL } from "./baseURL";

/** axiosInterface is using axios module.
 * This is just to help easily fetch easly axios's argument.
 * baseurl is fixed. So if you want to change this, you have to change in axiosInterface.
 * method and url are required. And their type is String.
 * data, headers and params, their type is object, they work like data in axios.
 * If axios returned right response, it return common response.
 * If axios raised an error, it return axios error. If you want to get response, you can use key named 'response'.
 */

export default async function axiosInterface(
  method,
  url,
  data = {},
  headers = {},
  params = {}
) {
  // Authorization Required

  if (headers.Authorization) {
    if (headers.Authorization.trim() === "Bearer") {
      return "token does not exist";
    }

    const myInterceptor = axios.interceptors.response.use(
      (res) => {
        axios.interceptors.response.eject(myInterceptor);
        return res;
      },
      async (err) => {
        console.log("Authorization Error", err);
        const { config, response } = err;
        const state = JSON.parse(localStorage.getItem("persist:root"));
        const authentication = JSON.parse(state.auth);

        if (response.status === 401 || response.status === 400) {
          axios.interceptors.response.eject(myInterceptor);

          // Token Refresh
          const refreshResponse = await axios({
            method: "post",
            baseURL: baseURL,
            url: "/users/refresh",
            headers: {
              "refresh-token": authentication.authentication.refreshToken,
            },
            data: {
              email: authentication.authentication.email,
            },
          });
          console.log("refreshResponse: ", refreshResponse);
          if (refreshResponse.status === 200) {
            console.log(
              "new access token: ",
              refreshResponse.data["access-token"]
            );
            const newToken = refreshResponse.data["access-token"];
            config.headers.Authorization = `Bearer ${newToken}`;
            const newResponse = await axios(config);
            store.dispatch(updateTokenHandler(newToken));
            return Promise.resolve(newResponse);
          } else if (refreshResponse.status === 202) {
            store.dispatch(removeTokenHandler());
            return Promise.reject(refreshResponse);
          } else {
            return Promise.reject(refreshResponse);
          }
        }
      }
    );
  }

  // Authorization Not Required

  let response = await axios({
    method: method,
    url: url,
    baseURL: baseURL,
    data: data,
    headers: headers,
    params: params,
  })
    .then((res) => res)
    .catch((err) => {
      return err;
    });

  return response;
}
