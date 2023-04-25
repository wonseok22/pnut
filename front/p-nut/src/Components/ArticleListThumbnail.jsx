import React, { Fragment } from "react";
import { useNavigateToTop } from "../hooks/useNavigateToTop";

const ArticleListThumbnail = (props) => {
  const { rank, imgSrc, title, author, boardId } = props;

  const navigate = useNavigateToTop();

  const goToBoardDetail = (id) => {
    navigate(`/board/${id}`);
  };

  let rankDiv = null;
  let topDiv = null;
  if (rank) {
    rankDiv = (
      <div className="absolute -bottom-50 -left-10 text-#F5F5F5 font-semibold text-119 drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
        {rank}
      </div>
    );
    topDiv = (
      <Fragment>
        <div className="relative" onClick={(e) => goToBoardDetail(boardId)}>
          <img
            src={imgSrc}
            alt=""
            className="w-390 h-240 rounded-8 hover:opacity-70"
          />
          {rankDiv && rankDiv}
        </div>
        <div className="font-bold text-22 mt-15 mb-9 ml-5 truncate">
          {title}
        </div>
        <div className="flex items-center ml-5">
          <div className="font-semibold text-14">By {author}</div>
        </div>
      </Fragment>
    );
  }
  const boardDiv = (
    <Fragment>
      <div
        className="relative hover:opacity-70"
        onClick={(e) => goToBoardDetail(boardId)}
      >
        <img src={imgSrc} alt="" className="w-390 h-240 rounded-8" />
      </div>
      <div className="font-bold text-22 mt-15 mb-9 ml-5 truncate">{title}</div>
      <div className="flex items-center ml-5">
        <div className="font-semibold text-14">By {author}</div>
      </div>
    </Fragment>
  );

  return (
    // <div className="h-342">
    //   <div className="relative" onClick={(event) => goToBoardDetail(boardId)}>
    //     <img src={imgSrc} alt="" className="w-390 h-240 rounded-8" />
    //     {rankDiv && rankDiv}
    //   </div>
    //   <div className="font-bold text-22 mt-15 mb-9 ml-20">{title}</div>
    //   <div className="flex items-center ml-20">
    //     <img src={profileImg} alt="" className="w-22 h-22" />
    //     <div className="font-medium text-14 ml-5">{author}</div>
    //   </div>
    // </div>
    <div className="h-390">
      {rank && topDiv}
      {!rank && boardDiv}
    </div>
  );
};

export default ArticleListThumbnail;
