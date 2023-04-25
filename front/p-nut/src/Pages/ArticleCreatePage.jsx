import React, { createRef, useRef, useState, useEffect } from "react";
import ArticleImgBlock from "../Components/ArticleImgBlock";
import newpostAPI from "../api/newpostAPI";
import { useSelector } from "react-redux";
import { useNavigateToTop } from "../hooks/useNavigateToTop";
import AlertModal from "../UI/AlertModal";

const modalShow = `
    @keyframes modalShow {
      from {
        opacity: 0;
        margin-top: -50px;
      }
      to {
        opacity: 1;
        margin-top: 0;
      }
    }
  `;

const modalBgShow = `
    @keyframes modalBgShow {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  `;

const SubmitAlertModal = ({ open, onConfirm, onCancel }) => {
  return (
    <div
      className={`fixed top-0 right-0 bottom-0 left-0 z-50 bg-black bg-opacity-60 ${
        open ? "flex justify-center items-center animate-modalBgShow" : "hidden"
      } transition-all duration-300`}
      style={{ animation: open ? modalBgShow : "" }}
      onClick={onCancel}
    >
      <div
        className="grid p-40 bg-white rounded shadow-lg contents-between w-500 h-200"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="mb-4 text-2xl font-bold ">글을 작성하시겠습니까?</p>
        <div className="flex items-end justify-end w-full h-full">
          <button
            type="button"
            className="px-40 py-10 mr-20 bg-gray-200 rounded hover:bg-gray-300"
            onClick={onCancel}
          >
            취소
          </button>
          <button
            type="button"
            className="px-40 py-10 text-white bg-blue-500 rounded hover:bg-blue-600"
            onClick={onConfirm}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

const ArticleCreatePage = () => {
  // alert
  const [showAlert, setShowAlert] = useState(false);

  const handleConfirm = () => {
    setShowAlert(false);
    const jsonData = {
      content: content.toString(),
      ingredients: ingredients.toString(),
      quantity: quantity.toString(),
      recipe_steps: stepContent,
      time: cookingTime.toString(),
      title: title,
      stepNums: stepNums,
    };

    console.log(jsonData);
    console.log(thumbnailImgFile);
    console.log(stepImgFile);

    newpostAPI(jsonData, thumbnailImgFile, stepImgFile, token)
      .then(() => {
        console.log("hi");
        navigate("/board");
      })
      .catch(() => {
        console.log("error");
      });
  };

  const handleCancel = () => {
    setShowAlert(false);
  };

  const newpostBtnClickHandler = (e) => {
    e.preventDefault();
    if (!title) {
      window.alert("제목이 없습니다!");
      return;
    }
    if (!content) {
      window.alert("내용이 없습니다!");
      return;
    }
    if (!ingredients) {
      window.alert("재료가 없습니다!");
      return;
    }
    if (!quantity) {
      window.alert("몇인분인지 알려주세요!");
      return;
    }
    setShowAlert(true);
  };

  const subTitle = "font-semibold mb-24";
  const [orderArr, setOrderArr] = useState([1]);
  const [thumbnailImgFile, setThumbnailImgFile] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [cookingTime, setCookingTime] = useState(0);
  const [ingredients, setIngredient] = useState("");
  const [quantity, setQuantity] = useState(1);

  const thumbnailInputRef = useRef(null);
  const token = useSelector((state) => state.auth.authentication.token);
  const navigate = useNavigateToTop();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!token) {
      setModalOpen(true);
    }
  }, []);
  const modalCloseHandler = () => {
    setModalOpen(false);
    navigate("/login");
  };

  const cookingTimeRefArr = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  const [stepContentRef, setStepContentRef] = useState([useRef(null)]);
  const [stepImgFileRef, setStepImgFileRef] = useState([useRef(null)]);
  const [stepContent, setStepContent] = useState([""]);
  const [stepImgFile, setStepImgFile] = useState([null]);
  const [stepNums, setStepNums] = useState([]);

  // 단게별 글자수
  const [stepContentLetterCount, setStepContentLetterCount] = useState(
    Array(orderArr.length).fill(0)
  );

  // 요리 단계 추가 버튼
  const addStepBtnHandler = () => {
    const lastIdx = orderArr.length + 1;
    setStepContentRef((prev) => {
      const newRefs = [...prev];
      newRefs.push(createRef(null));
      return newRefs;
    });
    setStepImgFileRef((prev) => {
      const newRefs = [...prev];
      newRefs.push(createRef(null));
      return newRefs;
    });
    setStepContent((prev) => {
      return [...prev, null];
    });
    setStepImgFile((prev) => {
      return [...prev, null];
    });
    setOrderArr((prev) => {
      return [...prev, lastIdx];
    });
  };

  // 요리시간 버튼 핸들러
  const cookingTimeBtnHandler = (e) => {
    if (e.target.localName === "div") {
      return;
    }
    const idx = Number(e.target.id.split("time")[1]);
    cookingTimeRefArr.forEach((ref) => {
      ref.current.classList.add("border-#7F807F");
      ref.current.classList.remove("border-#2F80ED");
      ref.current.classList.remove("text-#2F80ED");
    });

    cookingTimeRefArr[idx].current.classList.add("border-#2F80ED");
    cookingTimeRefArr[idx].current.classList.add("text-#2F80ED");
    cookingTimeRefArr[idx].current.classList.remove("border-#7F807F");

    setCookingTime(idx);
  };

  // 양 변경
  const quantityHandler = (type) => {
    if (type === "-") {
      if (quantity > 1) {
        setQuantity((prev) => {
          return prev - 1;
        });
      }
    } else {
      setQuantity((prev) => {
        return prev + 1;
      });
    }
  };

  // 이미지, 텍스트 입력 핸들링
  const stepChangeHandler = (e) => {
    const { type, id } = e.target;
    const idx = Number(id.split("-")[2]) - 1;

    if (type === "text") {
      const newStepContent = [...stepContent];
      newStepContent[idx] = e.target.value;
      setStepContent(newStepContent);
      const newStepContentLetterCount = [...stepContentLetterCount];
      newStepContentLetterCount[idx] = e.target.value.length;
      setStepContentLetterCount(newStepContentLetterCount);
    }
  };

  // 글 등록
  // const newpostBtnClickHandler = (e) => {
  //   e.preventDefault();
  //   const jsonData = {
  //     content: content.toString(),
  //     ingredients: ingredients.toString(),
  //     quantity: quantity.toString(),
  //     recipe_steps: stepContent,
  //     time: cookingTime.toString(),
  //     title: title,
  //     stepNums: stepNums,
  //   };

  //   console.log(jsonData);

  //   newpostAPI(jsonData, thumbnailImgFile, stepImgFile, token)
  //     .then(() => {
  //       console.log("hi");
  //       navigate("/board");
  //     })
  //     .catch(() => {
  //       console.log("error");
  //     });
  // };

  // 제목 글자수 관리 & title
  const handleTitleChange = (e) => {
    e.stopPropagation();
    setTitle(e.target.value);
  };

  // 내용 글자수 관리 & content
  const handleContentChange = (e) => {
    e.stopPropagation();
    setContent(e.target.value);
  };

  // 재료 글자수 관리 & ingredient
  const handleIngredientChange = (e) => {
    setIngredient(e.target.value);
  };

  return (
    <>
      {modalOpen && (
        <AlertModal
          open={modalOpen}
          close={modalCloseHandler}
          onCheck={modalCloseHandler}
        >
          로그인이 필요한 서비스입니다!
        </AlertModal>
      )}
      {!modalOpen && (
        <>
          <div className="fixed z-10 flex items-center w-full justify-evenly h-100 px-auto grey-underbar bg-white/80">
            <div className="ml-48 text-center text-xl">
              자신의 레시피에 대해 자유롭게 이야기 해주세요!
            </div>
            <button
              type="button"
              className="bg-#2F80ED hover:bg-#2F80ED/80  rounded-full text-prettywhite font-semibold w-200 h-50  px-50 py-5 text-xl"
              onClick={(e) => {
                newpostBtnClickHandler(e);
              }}
            >
              글 등록하기
            </button>
          </div>
          <div className="w-1200 mx-auto border-x border-solid border-#7F807F px-203 pt-141">
            <div className="w-792 h-354">
              <ArticleImgBlock
                setRef={thumbnailInputRef}
                division="thumbnail"
                text="대표 이미지 업로드"
                width="full"
                height="354"
                fileSet={setThumbnailImgFile}
              />
            </div>
            <div className="flex flex-col w-full text-xl">
              <div className="flex items-center w-full grey-underbar">
                <input
                  type="text"
                  name="title"
                  id="title"
                  placeholder="레시피의 이름이 무엇인가요?"
                  className="inline-block w-full py-26 px-38"
                  onChange={handleTitleChange}
                  maxLength={30}
                />
                <div className="inline pr-30">{title.length}/30</div>
              </div>
              <div className="flex flex-col items-center w-full grey-underbar">
                <textarea
                  name="content"
                  id="content"
                  cols="30"
                  rows="5"
                  className="w-full resize-none py-26 px-38"
                  placeholder="레시피에 대한 간단한 설명을 붙여주세요"
                  onChange={handleContentChange}
                  maxLength={255}
                />
                <div className="w-full p-30 text-end">{content.length}/255</div>
              </div>
              {/* 이 요소의 하위 항목에 버튼이 존재하고 키보드 작동이 가능합니다. */}
              {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
              <div
                className="px-40 mt-24 pb-31 grey-underbar"
                onClick={cookingTimeBtnHandler}
              >
                <div className={subTitle}>예상 소요 시간</div>
                <button
                  type="button"
                  className="border p-10 mr-20 border-#2F80ED text-#2F80ED"
                  id="time0"
                  ref={cookingTimeRefArr[0]}
                >
                  15분 컷
                </button>
                <button
                  type="button"
                  className="border border-#7F807F p-10 mr-20"
                  id="time1"
                  ref={cookingTimeRefArr[1]}
                >
                  30분 컷
                </button>
                <button
                  type="button"
                  className="border border-#7F807F p-10 mr-20"
                  id="time2"
                  ref={cookingTimeRefArr[2]}
                >
                  45분 컷
                </button>
                <button
                  type="button"
                  className="border border-#7F807F p-10"
                  id="time3"
                  ref={cookingTimeRefArr[3]}
                >
                  45분 이상
                </button>
              </div>
              <div className="px-40 mt-26 pb-31 grey-underbar">
                <div className={subTitle}>기준량</div>
                <div className="flex flex-row items-center mx-27-center">
                  <button
                    type="button"
                    className="w-45 h-45 text-2xl leading-none bg-#ECECEC"
                    onClick={() => {
                      quantityHandler("-");
                    }}
                  >
                    -
                  </button>
                  <div className="mx-20 text-xl">{quantity}</div>
                  <button
                    type="button"
                    className="w-45 h-45 text-2xl leading-none bg-#ECECEC"
                    onClick={() => {
                      quantityHandler("+");
                    }}
                  >
                    +
                  </button>
                  <div className="mx-20 text-xl">인분</div>
                </div>
              </div>
              <div className="w-full px-40 mt-26 pb-31 grey-underbar">
                <div className={subTitle}>재료</div>
                <div className="flex flex-col w-full">
                  <textarea
                    name=""
                    id=""
                    cols="30"
                    rows="5"
                    className="w-full resize-none py-26"
                    placeholder="재료를 입력해주세요"
                    onChange={handleIngredientChange}
                    maxLength={255}
                  />
                  <div className="inline text-end">
                    {/* {ingredients.length}/255 */}
                  </div>
                </div>
              </div>
              <div
                className="w-full px-40 mt-26 pb-31"
                // onChange={stepChangeHandler}
              >
                <div className={subTitle}>만드는 방법</div>
                {orderArr.map((value) => (
                  <div className="flex flex-row" key={`div-${value}`}>
                    <div className="bg-#AEAFAE w-70 h-70 rounded-50 text-prettywhite flex items-center justify-center mr-24 text-30">
                      {value}
                    </div>
                    <div className="text-md">
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          id={`step-content-${value}`}
                          ref={stepContentRef[value - 1]}
                          className="w-full p-3 h-70"
                          placeholder="만드는 방법을 입력하세요."
                          maxLength={50}
                          onChange={(e) => {
                            stepChangeHandler(e, value - 1);
                          }}
                        />
                        <div className="inline">
                          {/* {stepContentLetterCount[value - 1]}/50 */}
                        </div>
                      </div>
                      <div className="w-624 h-303">
                        <ArticleImgBlock
                          setRef={stepImgFileRef[value - 1]}
                          division={`step-img-${value}`}
                          text="이미지 업로드(선택)"
                          width="624"
                          height="303"
                          fileSet={setStepImgFile}
                          setStepNums={setStepNums}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="rounded-full w-200 h-60 bg-#FFD1D1 hover:bg-#FF6B6C mt-40 text-lg"
                    id="addStep"
                    onClick={addStepBtnHandler}
                  >
                    <strong>+</strong> 단계 추가
                  </button>
                </div>
                <button
                  type="button"
                  className="bg-#2F80ED hover:bg-#2F80ED/80 my-60 rounded text-prettywhite font-semibold w-full h-90 justify-center text-xl"
                  onClick={(e) => {
                    newpostBtnClickHandler(e);
                  }}
                >
                  글 등록하기
                </button>
                <SubmitAlertModal
                  open={showAlert}
                  onConfirm={handleConfirm}
                  onCancel={handleCancel}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ArticleCreatePage;
