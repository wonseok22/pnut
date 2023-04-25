import axiosInterface from "./axiosInterface";

async function requestCodeAPI(email) {
  const response = await axiosInterface("POST", "/users/email", {
    email,
  });
  console.log("requestCodeAPI: ", response);
  if (response.status === 200) {
    return response;
  }

  return response.response;
}

export default requestCodeAPI;
