import React from "react";

const CommentForm = (props) => {
  const { content, nickName, date } = props;
  const yyyymmdd = date.split("T")[0];
  console.log(yyyymmdd);

  return (
    <div className="my-15 flex flex-row items-center justify-between">
      <div className="flex flex-row items-baseline">
        <div className="text-xl font-bold ml-14 mr-34">{nickName}</div>
        <div className="text-lg">{content}</div>
      </div>
      <div className="text-lg font-bold">{yyyymmdd}</div>
    </div>
  );
};

export default CommentForm;
