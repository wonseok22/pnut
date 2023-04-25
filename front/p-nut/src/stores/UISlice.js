import { createSlice } from "@reduxjs/toolkit";

const notification = {
  status: "",
  title: "",
  message: "",
};

const UISlice = createSlice({
  name: "UI",
  initialState: { notification },
  reducers: {
    changeNotification(state, action) {
      state.notification = {
        status: action.payload.status,
        title: action.payload.title,
        message: action.payload.message,
      };
    },
    resetNotification(state) {
      state.notification = {
        status: "",
        title: "",
        message: "",
      };
    },
  },
});

export const UIActions = UISlice.actions;

export default UISlice;
