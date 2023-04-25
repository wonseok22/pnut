import axiosInterface from "../api/axiosInterface";
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import OrderBlock from "../Components/OrderBlock";
import CommentForm from "../Components/CommentForm";
import { useSelector } from "react-redux";

const ArticleDetailPage = () => {
  const [data, setData] = useState();
  const [newComment, setNewComment] = useState("");
  const { articleId } = useParams();
  const token = useSelector((state) => state.auth.authentication.token);
  const [content, setContent] = useState();
  const [ingredients, setIngredients] = useState();
  const [quantity, setQuantity] = useState();
  const [recipeSteps, setRecipeSteps] = useState();
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState();
  const [time, setTime] = useState();
  const [title, setTitle] = useState();
  const [visit, setVisit] = useState();
  const [comments, setComments] = useState();
  const [likes, setLikes] = useState();
  const [likeOrNot, setLikeOrNot] = useState();

  const quantityArr = useMemo(() => {
    return ["15분컷", "30분컷", "45분컷", "45분 이상"];
  }, []);

  useEffect(() => {
    console.log(token);
    console.log(data);
    if (!data) {
      if (token) {
        axiosInterface("GET", `/boards/board/${articleId}`, "", {
          Authorization: `Bearer ${token}`,
        }).then((res) => {
          console.log(res);
          setData(res);
        });
      } else {
        axiosInterface("GET", `/boards/board/${articleId}`).then((res) => {
          console.log(res);
          setData(res);
        });
      }
    } else {
      const {
        content,
        ingredients,
        quantity,
        recipeSteps,
        thumbnailImageUrl,
        time,
        title,
        visit,
        comments,
        likes,
        likeOrNot,
      } = data.data;

      setContent(content);
      setIngredients(ingredients);
      setQuantity(quantity);
      setRecipeSteps(recipeSteps);
      setThumbnailImageUrl(thumbnailImageUrl);
      setTime(time);
      setTitle(title);
      setVisit(visit);
      setComments(comments);
      setLikes(likes);
      setLikeOrNot(() => {
        if (likeOrNot === 0) {
          return 0;
        } else if (likeOrNot === 1) {
          return 1;
        } else {
          return 0;
        }
      });
    }
  }, [articleId, data, token]);

  // 댓글 보여주기
  let comment = <div className="text-#AEFEAE mb-40" />;
  if (comments?.length > 0) {
    comment = (
      <div className="mb-40">
        {comments.map((value, idx) => (
          <CommentForm
            key={`comment-${idx}`}
            content={value.content}
            nickName={value.nickName}
            date={value.createDate}
          />
        ))}
      </div>
    );
  }

  // 좋아요
  const heartClickHandler = () => {
    if (!token) {
      return;
    }
    if (likeOrNot === 1) {
      axiosInterface("delete", `/boards/like/${articleId}`, "", {
        Authorization: `Bearer ${token}`,
      }).then(() => {
        setLikeOrNot(0);
      });
    } else if (likeOrNot === 0) {
      axiosInterface("post", `/boards/like/${articleId}`, "", {
        Authorization: `Bearer ${token}`,
      }).then(() => {
        axiosInterface("GET", `/boards/board/${articleId}`, "", {
          Authorization: `Bearer ${token}`,
        }).then((res) => setData(res));
      });
    }
  };

  // 댓글 작성 이벤트
  const newCommentSubmitHandler = () => {
    axiosInterface(
      "post",
      `/boards/comments/${articleId}`,
      {
        content: newComment,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    )
      .then(() => {
        if (token) {
          axiosInterface("GET", `/boards/board/${articleId}`, "", {
            Authorization: `Bearer ${token}`,
          }).then((res) => setData(res));
        } else {
          axiosInterface("GET", `/boards/board/${articleId}`).then((res) =>
            setData(res)
          );
        }
      })
      .catch((err) => console.log(err));
    setNewComment("");
  };

  // 로그인 확인
  const tokenCheckHandler = (e) => {
    if (!token) {
      e.target.blur();
      return;
    }
  };

  return (
    <div className="flex w-1200 mx-auto flex-col">
      {data && (
        <>
          <div className="flex mb-85">
            <img
              src={`${thumbnailImageUrl}`}
              alt=""
              className="w-586 h-407 mx-7 my-auto mt-20"
            />
            <div className="w-600 pl-80 mt-20">
              <div className="text-2xl font-bold mb-32 h-auto">{title}</div>
              <div className="flex items-center pb-32 grey-underbar">
                <div className="border border-#2B2C2B text-xl px-10 py-5 font-semibold">
                  {quantityArr[time]}
                </div>
                <div className="ml-27 text-xl font-semibold">
                  {quantity}인분
                </div>
              </div>
              <div className="my-26 text-xl font-medium">{content}</div>
              <div className="w-full flex place-content-between">
                <div className="text-lg">
                  댓글 {comments?.length} 좋아요 {likes} 조회수 {visit}
                </div>
                <img
                  src={`/assets/heart${likeOrNot}.png`}
                  alt=""
                  className="mr-43"
                  onClick={heartClickHandler}
                />
              </div>
            </div>
          </div>
          <div className="text-2xl font-bold h-auto mb-21">재료</div>
          <div className="w-1200 px-65 pb-56 grey-underbar border-#2B2C2B">
            <div className="bg-#F2F2F2 text-lg w-1070 py-20 px-75">
              <p className="text-center">{ingredients}</p>
            </div>
          </div>
          {recipeSteps &&
            Object.entries(recipeSteps).map(([key, value], idx) => (
              <>
                <OrderBlock key={key} imgPath={value} text={key} idx={idx} />
                <hr />
              </>
            ))}
          <div className="mt-150 w-1200 mx-auto">
            <div className="flex items-center mb-40">
              <div className="text-2xl font-bold">댓글</div>
              <div className="text-3xl text-#FF6B6C font-extrabold ml-22">
                {comments?.length}
              </div>
            </div>
            <div className="relative h-219 pb-64 grey-underbar mb-25">
              <input
                type="text"
                className="text-lg w-full border border-[#DFE0DF] py-27 px-23"
                placeholder="댓글을 입력하세요."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    newCommentSubmitHandler();
                  }
                }}
                onFocus={tokenCheckHandler}
              />
              <button
                type="button"
                className="absolute right-0 bottom-64 bg-#2F80ED hover:bg-#2F80ED/80 rounded-full w-100 text-prettywhite text-lg font-bold px-14 py-7 "
                onClick={() => newCommentSubmitHandler()}
              >
                작성
              </button>
            </div>
            <div>{comment}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default ArticleDetailPage;
