import axios from "axios";
import { dataBaseURL } from "./baseURL";

async function getFoodAPI(foodId, userEmail) {
  const response = await axios({
    method: "get",
    // baseURL: "http://j8a704.p.ssafy.io:8000/",
    // baseURL: "https://pnut.site/api/foods",
    baseURL: dataBaseURL,
    url: "/foods/info",
    params: {
      food_id: foodId,
      user_email: userEmail,
    },
  });
  if (response.status === 200) {
    return response;
  }
  return response.response;
}

export default getFoodAPI;
