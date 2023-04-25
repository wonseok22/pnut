import { createSlice } from "@reduxjs/toolkit";

import { UIActions } from "./UISlice";
import loginAPI from "../api/loginAPI";
import logoutAPI from "../api/logoutAPI";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    authentication: { token: "", refreshToken: "", email: "", nickname: "" },
  },
  reducers: {
    changeAuth(state, action) {
      // console.log("action payload: ", action.payload);
      state.authentication = {
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        email: action.payload.email,
        nickname: action.payload.nickname,
      };
    },
    logout(state) {
      state.authentication = {
        token: "",
        refreshToken: "",
        email: "",
        nickname: "",
      };
    },
    updateToken(state, action) {
      console.log("action payload: ", action.payload);
      state.authentication.token = action.payload;
    },
  },
});

export const removeTokenHandler = () => {
  console.log("removeTokenHandler");
  return async (dispatch) => {
    dispatch(authActions.logout());
  };
};

export const updateTokenHandler = (newToken) => {
  console.log("newToken: ", newToken);
  return async (dispatch) => {
    dispatch(authActions.updateToken(newToken));
  };
};

export const loginHandler = (data) => {
  console.log("login handler start");
  return async (dispatch) => {
    try {
      const response = await loginAPI(data.email, data.password);

      if (response.status !== 200) {
        console.log("login error: ", response);
        throw new Error(response.data.message);
      }

      console.log("loginAPI: ", response.data);

      const userData = {
        token: response.data["access-token"],
        refreshToken: response.data["refresh-token"],
        email: response.data.email,
        nickname: response.data.nickname,
      };
      console.log("userData: ", userData);

      dispatch(authActions.changeAuth(userData));

      dispatch(
        UIActions.changeNotification({
          status: "success",
          title: "Success",
          message: "Login request successed!",
        })
      );

      dispatch(UIActions.resetNotification());
    } catch (error) {
      console.log(error);
      dispatch(
        UIActions.changeNotification({
          status: "error",
          title: "Login Failed",
          message: "Login has failed...",
        })
      );
    }
  };
};

export const logoutHandler = (navigate) => {
  console.log("logout handler start");
  return (dispatch) => {
    return new Promise((resolve) => {
      try {
        logoutAPI().then((response) => {
          console.log("logoutAPI: ", response);
          if (
            response.status !== 200 &&
            response.status !== 202 &&
            response !== "token does not exist"
          ) {
            throw new Error(response.data.message);
          }
          if (response === "token does not exist") {
            navigate("/login");
          }
          if (response.status === 200) {
            dispatch(authActions.logout());
            navigate("/");
          }
          if (response.status === 202) {
            dispatch(authActions.logout());
            navigate("/login");
          }
          if (response.status === 401) {
            dispatch(authActions.logout());
            navigate("/login");
          }

          dispatch(
            UIActions.changeNotification({
              status: "success",
              title: "Success",
              message: "Logout request successed!",
            })
          );

          dispatch(UIActions.resetNotification());
          resolve();
        });
      } catch (error) {
        console.log("logout error: ", error);
        dispatch(
          UIActions.changeNotification({
            status: "error",
            title: "Logout Failed",
            message: "Logout has failed...",
          })
        );
      }
    });
  };
};

export const authActions = authSlice.actions;

export default authSlice;
