import axiosInterface from "./axiosInterface";

/*
Request needs age, email, gender(0, 1), name, nickname, password
Response status: OK, ACCEPTED, INTERNAL_SERVER_ERROR
*/

async function createUserAPI(age, email, gender, name, nickname, password) {
  const response = await axiosInterface("POST", "/users", {
    age,
    email,
    gender,
    name,
    nickname,
    password,
  });
  console.log("createUserAPI: ", response);
  if (response.status === 200) {
    return response;
  }

  return response.response;
}

export default createUserAPI;
