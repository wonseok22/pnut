import axiosInterface from "./axiosInterface";

export default async function symptomsAPI(token) {
  const res = await axiosInterface("get", "survey", "", {
    Authorization: `Bearer ${token}`,
  });

  return res.data;
}
