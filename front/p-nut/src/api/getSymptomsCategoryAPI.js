import axios from "axios";
import { dataBaseURL } from "./baseURL";

async function getSymptomsCategoryAPI(symptomsId) {
  const response = await axios({
    method: "get",
    // baseURL: "http://j8a704.p.ssafy.io:8000/",
    baseURL: dataBaseURL,
    url: `/foods/symptom/${symptomsId}`,
  });
  if (response.status === 200) {
    return response.data.data;
  }
  return response.response;
}

export default getSymptomsCategoryAPI;
