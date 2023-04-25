import axiosInterface from "./axiosInterface";

export async function symptomsQuestionAPI(
  token,
  questionID1,
  questionID2,
  questionID3
) {
  const req1 = new Promise((resolve, reject) => {
    axiosInterface("GET", `/survey/${questionID1}`, "", {
      Authorization: `Bearer ${token}`,
    }).then((res) => resolve(res.data));
  });
  const req2 = new Promise((resolve, reject) => {
    axiosInterface("GET", `/survey/${questionID2}`, "", {
      Authorization: `Bearer ${token}`,
    }).then((res) => resolve(res.data));
  });
  const req3 = new Promise((resolve, reject) => {
    axiosInterface("GET", `/survey/${questionID3}`, "", {
      Authorization: `Bearer ${token}`,
    }).then((res) => resolve(res.data));
  });

  const req = await Promise.all([req1, req2, req3]);
  console.log(req);

  return req;
}
