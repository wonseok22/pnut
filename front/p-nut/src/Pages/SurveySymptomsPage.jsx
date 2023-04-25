import React, { createRef, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import symptomsAPI from "../api/symptomsAPI";
import OptionSelect from "../Components/OptionSelect";
import { useDivInputEventHandler } from "../hooks/useInputDivHandler";
import AlertModal from "../UI/AlertModal";
import axios from "axios";

const SurveySymptomsPage = () => {
  // 모달 관련
  const [showAlertModal, setShowAlertModal] = useState(false);
  const token = useSelector((state) => state.auth.authentication.token);
  const [question, setQuestion] = useState();
  const [nickname, setNickname] = useState();
  const [symptomsRef, setSymptomsRef] = useState([]);
  const [alreadyAnsweredIdxArr, setAlreadyAnsweredIdxArr] = useState([]);
  const [alreadyAnsweredArr, setAlreadyAnsweredArr] = useState({});

  const navigate = useNavigate();
  const sympHandler = useCallback(async (token) => {
    const res = await symptomsAPI(token);
    setQuestion(res.slice(1));
    setNickname(res[0]);

    for (let i = 1; i < res.length; i += 1) {
      setSymptomsRef((prev) => {
        return [...prev, createRef(null)];
      });
    }
    return res;
  }, []);

  const renderingHandler = useCallback(async () => {
    let alreadyArr = [];
    const res = await axios.get("/survey/mypage", {
      baseURL: "https://pnut.site/api",
      headers: { Authorization: `Bearer ${token}` },
    });

    setAlreadyAnsweredArr(res.data.slice(1));
    res.data.forEach((alreadyQuestion) => {
      if (alreadyQuestion.length) {
        alreadyArr.push(true);
      } else {
        alreadyArr.push(false);
      }
    });

    return alreadyArr;
  }, []);

  useEffect(() => {
    console.log("useEffect");
    if (nickname) {
      renderingHandler().then((alreadyAnswered) => {
        if (alreadyAnswered.length > 0) {
          setAlreadyAnsweredIdxArr(alreadyAnswered.slice(1));
          initCheckedObj(alreadyAnswered.slice(1), question, symptomsRef);
        }
      });
    } else {
      sympHandler(token);
      console.log("질문 done");
    }
    console.log("useEffect done");
  }, [question]);

  const [clickedCnt, checkedObj, initCheckedObj, eventDispatcher] =
    useDivInputEventHandler(symptomsRef);

  console.log(checkedObj);
  const aboveBtnClickHandler = () => {
    navigate("/newsurvey");
  };

  const startBtnClickHandler = () => {
    console.log(checkedObj);
    let selectedOptions = Object.entries(checkedObj)
      .filter(([key, value]) => value !== "")
      .map(([key, value]) => key);
    console.log(selectedOptions);
    let preAnswer = "";
    let params = "";

    let whatToRemove = [];
    alreadyAnsweredArr.forEach((value, idx) => {
      if (value.length) {
        whatToRemove.push(`${idx}`);
      }
    });
    console.log(whatToRemove);
    console.log(alreadyAnsweredArr);
    selectedOptions.forEach((key) => {
      console.log(key);
      console.log(alreadyAnsweredArr[key]);
      const transformValue = checkedObj[key].replace("/", "or");
      params += `/${key}=${transformValue}`;
      alreadyAnsweredArr[key].forEach((value, idx) => {
        preAnswer += `${value.degree}`;
      });
      preAnswer += "-";
      whatToRemove = whatToRemove.filter((value) => value !== key);
    });

    preAnswer += whatToRemove.join("");

    if (selectedOptions.length !== 3) {
      setShowAlertModal(true);
      return;
    }
    const url = `/newsurvey${params}/${preAnswer}`;
    console.log(preAnswer);
    console.log(url);
    navigate(url);
  };

  const closeModal = () => {
    setShowAlertModal(false);
  };

  return (
    <div className="w-674 py-50">
      {symptomsRef.length > 0 && (
        <>
          <div className="text-xl font-bold text-#7F807F mb-18">질문 1</div>
          <div className="font-bold text-xl mb-18">
            {nickname}님이 불편하시고 걱정되는 3가지를 선택하세요.
          </div>
          <div className="text-lg text-#7F807F pb-18">
            우선적으로 관리가 필요한 곳을 선택하세요.
          </div>
          <div className="grey-underbar" />
          {question.map((content, idx) => (
            <OptionSelect
              type="checkbox"
              content={content}
              idx={idx}
              eventDispatcher={eventDispatcher}
              refInfo={symptomsRef[idx]}
              key={content}
            />
          ))}
          <button
            type="button"
            className="w-172 border border-#535453 rounded-42 h-55 text-18 font-bold mt-20"
            onClick={aboveBtnClickHandler}
          >
            이전
          </button>
          <button
            type="button"
            className="ml-36 w-465 bg-#FF6B6C rounded-42 h-55 text-18 font-bold text-prettywhite mt-20"
            onClick={startBtnClickHandler}
          >
            시작하기
          </button>
          <AlertModal
            open={showAlertModal}
            close={closeModal}
            onCheck={closeModal}
          >
            <p>3가지를 선택해주세요.</p>
          </AlertModal>
        </>
      )}
    </div>
  );
};

export default SurveySymptomsPage;
