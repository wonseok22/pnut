import axiosInterface from "./axiosInterface";

async function deletepostAPI(postId) {
  const state = JSON.parse(localStorage.getItem("persist:root"));
  if (!state) {
    return "token does not exist";
  }
  const authentication = JSON.parse(state.auth);
  const { token } = authentication.authentication;

  const response = await axiosInterface(
    "DELETE",
    `/boards/${postId}`,
    {},
    { Authorization: `Bearer ${token}` }
  );

  if (response.status === 200) {
    console.log("delete successed!");
    return response;
  }

  return response.response;
}

export default deletepostAPI;
