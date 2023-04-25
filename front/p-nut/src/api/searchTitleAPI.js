import axios from "axios";
import { baseURL } from "./baseURL";

export default async function searchTitleAPI() {
  const foodReq = new Promise((resolve, reject) => {
    axios
      .get("/foods/food", {
        baseURL: baseURL,
      })
      .then((res) => {
        resolve(res.data.list);
      });
  });
  const ingredientReq = new Promise((resolve, reject) => {
    axios
      .get("/foods/ingredients", {
        baseURL: baseURL,
      })
      .then((res) => {
        resolve(res.data.list);
      });
  });

  const totalRes = await Promise.all([foodReq, ingredientReq]);
  return totalRes;
}
