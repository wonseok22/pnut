import axiosInterface from "./axiosInterface";

async function checkDuplicationAPI(type, value) {
  const response = await axiosInterface(
    "POST",
    "/users/duplication",
    {},
    {},
    {
      type,
      value,
    }
  );
  console.log("checkDuplicationAPI: ", response);

  if (response.status !== 200) {
    throw new Error(response.data.message);
  }

  if (response.data.message === "nickname duplication") {
    return "nickname duplication";
  }

  if (response.data.message === "email duplication") {
    return "email duplication";
  }

  return "available";
}

export default checkDuplicationAPI;
