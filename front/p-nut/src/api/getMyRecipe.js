import axiosInterface from "./axiosInterface";

async function getMyRecipe() {
  const state = JSON.parse(localStorage.getItem("persist:root"));
  let token = "";
  if (state) {
    const authentication = JSON.parse(state.auth);
    token = authentication.authentication.token;
  }

  // const accessToken = "asdasd";
  const response = await axiosInterface(
    "GET",
    "/boards/mypage",
    {},
    { Authorization: `Bearer ${token}` }
  );

  if (response.status === 200) {
    return response.data;
  }

  return response;
}

export default getMyRecipe;
