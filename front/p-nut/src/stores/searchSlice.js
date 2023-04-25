import { createSlice } from "@reduxjs/toolkit";
import searchTitleArr from "../api/searchTitleAPI";

const searchSlice = createSlice({
  name: "search",
  initialState: { foodArr: [], ingredientArr: [] },
  reducers: {
    updateSearchArr(state, action) {
      state.foodArr = action.payload.foodArr;
      state.ingredientArr = action.payload.ingredientArr;
    },
  },
});

export const searchArrRequest = () => {
  return async (dispatch) => {
    try {
      const [foodArr, ingredientArr] = await searchTitleArr();
      foodArr.sort();
      ingredientArr.sort();
      dispatch(
        searchActions.updateSearchArr({
          foodArr: foodArr,
          ingredientArr: ingredientArr,
        })
      );
    } catch (e) {
      console.log(e);
    }
  };
};

export const searchActions = searchSlice.actions;

export default searchSlice;
