import React, { useState, useEffect, useMemo, createRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { symptomsQuestionAPI } from "../api/symptomsQuestionAPI";
import axios from "axios";
import axiosInterface from "../api/axiosInterface";

const SurveyQuestionsPage = () => {
  const navigate = useNavigate();
  const { question1, question2, question3, preAnswer } = useParams();
  const token = useSelector((state) => state.auth.authentication.token);
  const email = useSelector((state) => state.auth.authentication.email);
  const [inputValue, setInputValue] = useState([]);
  console.log(inputValue);
  const prevAnswer = preAnswer
    .split("-")
    .slice(0, 3)
    .map((categoryAnswer) => {
      if (categoryAnswer) {
        return categoryAnswer.split("");
      }
      return false;
    });
  const deleteReqIdxArr = preAnswer.split("-")[3].split("");

  const questionObj = useMemo(() => {
    const [questionId1, question1Thema] = question1.split("=");
    const [questionId2, question2Thema] = question2.split("=");
    const [questionId3, question3Thema] = question3.split("=");
    return {
      questionIdArr: [questionId1, questionId2, questionId3],
      questionThema: [question1Thema, question2Thema, question3Thema],
    };
  }, [question1, question2, question3]);

  const [question1Data, setQuestion1Data] = useState();
  const [question2Data, setQuestion2Data] = useState();
  const [question3Data, setQuestion3Data] = useState();
  const [nickname, setNickname] = useState();

  useEffect(() => {
    symptomsQuestionAPI(
      token,
      Number(questionObj.questionIdArr[0]) + 1,
      Number(questionObj.questionIdArr[1]) + 1,
      Number(questionObj.questionIdArr[2]) + 1
    ).then((res) => {
      const [question1Data, question2Data, question3Data] = res;
      setNickname(question1Data[0]);
      setQuestion1Data(question1Data.slice(1));
      setQuestion2Data(question2Data.slice(1));
      setQuestion3Data(question3Data.slice(1));

      const inputArr = res.map((key, idx) => {
        if (!prevAnswer[idx]) {
          return Array(key.length).fill(1);
        } else {
          const parseIntArr = prevAnswer[idx].map((value) => Number(value));

          return parseIntArr;
        }
      });

      setInputValue(inputArr);
    });
  }, [token]);

  console.log(inputValue);
  console.log(question1Data);
  // 변경 고
  const inputChangeHandler = (e) => {
    console.log(e.target.value);
    const [tag, y, x] = e.target.id.split("-");
    setInputValue((prev) => {
      console.log(prev[y][x]);
      prev[y][x] = Number(e.target.value);
      console.log(prev[y][x]);
      return { ...prev };
    });
  };

  // 요청 고
  const submitBtnClickHandler = async () => {
    const deletePromiseArr = [];
    deleteReqIdxArr.forEach((key) => {
      const deleteRequest = axiosInterface(
        "DELETE",
        `/survey/mypage/${Number(key) + 1}`,
        "",
        {
          Authorization: `Bearer ${token}`,
        }
      ).then((res) => {
        console.log(res);
        return res;
      });
      deletePromiseArr.push(deleteRequest);
    });
    if (deleteReqIdxArr.length > 0) await Promise.all(deleteReqIdxArr);

    const submitRequestPromiseArr = [];
    prevAnswer.forEach((value, idx) => {
      console.log(value, inputValue[idx]);
      if (!value) {
        const submitRequest = axiosInterface(
          "POST",
          `/survey/${Number(questionObj.questionIdArr[idx]) + 1}`,
          {
            responses: inputValue[idx],
          },
          {
            Authorization: `Bearer ${token}`,
          }
        ).then((res) => {
          console.log(res);
          return res;
        });
        submitRequestPromiseArr.push(submitRequest);
      } else {
        const submitRequest = axiosInterface(
          "PATCH",
          `/survey/mypage/${Number(questionObj.questionIdArr[idx]) + 1}`,
          {
            responses: inputValue[idx],
          },
          {
            Authorization: `Bearer ${token}`,
          }
        ).then((res) => {
          console.log(res);
          return res;
        });
        submitRequestPromiseArr.push(submitRequest);
      }
    });

    await Promise.all(submitRequestPromiseArr);
    await axios.get(`/foods/calc?user_email=${email}`, {
      baseURL: "https://pnut.site",
    });

    navigate("/my-survey");
  };

  return (
    <div className="py-50 w-full px-200">
      <div className="text-xl font-bold text-#7F807F mb-18">질문 2</div>
      <div className="font-bold text-xl mb-18">
        {nickname}님이 느끼시는 불편함의 정도를 말해주세요.
      </div>
      <div className="text-md text-#7F807F pb-18">
        0 = 이상 없음. 1 = 조금 불편함. 2 = 관리가 필요할 것 같음. 3 = 불편함
      </div>
      <div className="grey-underbar" />
      <div className="pt-30 font-bold mt-15 text-xl">
        {questionObj.questionThema[0]}
      </div>
      <div className="space-y-20">
        {question1Data &&
          question1Data.map((content, idx) => (
            <div className="flex flex-row mt-15 justify-between " key={content}>
              <div className="text-lg ml-5" id={`0-${idx}`}>
                {content}
              </div>
              <div className="flex space-x-10 items-center">
                <p>0</p>
                <input
                  className="w-150 bg-gray-200 rounded appearance-none cursor-pointer "
                  type="range"
                  min="0"
                  max="3"
                  step="1"
                  value={inputValue[0][idx]}
                  name={content}
                  id={`input-0-${idx}`}
                  onChange={inputChangeHandler}
                />
                <p>3</p>
              </div>
            </div>
          ))}
        <div className="pt-30 font-bold mt-15 text-xl">
          {questionObj.questionThema[1]}
        </div>
        {question2Data &&
          question2Data.map((content, idx) => (
            <div className="flex flex-row mt-15 justify-between " key={content}>
              <div className="text-lg ml-5" id={`1-${idx}`}>
                {content}
              </div>
              <div className="flex space-x-10 items-center">
                <p>0</p>
                <input
                  className="w-150 bg-gray-200 rounded appearance-none cursor-pointer "
                  type="range"
                  min="0"
                  max="3"
                  step="1"
                  value={inputValue[1][idx]}
                  name={content}
                  id={`input-1-${idx}`}
                  onChange={inputChangeHandler}
                />
                <p>3</p>
              </div>
            </div>
          ))}
        <div className="pt-30 font-bold mt-15 text-xl">
          {questionObj.questionThema[2]}
        </div>
        {question3Data &&
          question3Data.map((content, idx) => (
            <div className="flex flex-row mt-15 justify-between " key={content}>
              <div className="text-lg ml-5" id={`2-${idx}`}>
                {content}
              </div>
              <div className="flex space-x-10 items-center">
                <p>0</p>
                <input
                  className="w-150 bg-gray-200 rounded appearance-none cursor-pointer "
                  type="range"
                  min="0"
                  max="3"
                  step="1"
                  value={inputValue[2][idx]}
                  name={content}
                  id={`input-2-${idx}`}
                  onChange={inputChangeHandler}
                />
                <p>3</p>
              </div>
            </div>
          ))}
      </div>
      <button
        type="button"
        className="mt-40 w-full bg-#FF6B6C rounded-42 h-55 text-18 font-bold text-prettywhite mt-20"
        onClick={submitBtnClickHandler}
      >
        제출하기
      </button>
    </div>
  );
};

export default SurveyQuestionsPage;
