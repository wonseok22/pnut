import React from "react";

const RecipeCard = (props) => {
  const { title, description, heart, tag, time, quantity } = props;

  return (
    <div className="rounded-20 shadow-2xl h-400 w-380 py-64 px-44 absolute bg-prettywhite">
      <div className="flex items-center">
        <div className="text-31 font-bold">{title}</div>
        <img
          src={`/assets/heart${heart}.png`}
          alt=""
          className="ml-8 w-24 h-21"
        />
      </div>
      <div className="text-15 font-bold my-21">{description}</div>
      <div className="my-15">
        <div className="bg-[#FF6B6C] text-prettywhite px-7 py-1 w-40">Tag</div>
        <div>{tag}</div>
      </div>
      <div>조리시간 : {time}</div>
      <div>분량 : {quantity}</div>
    </div>
  );
};

export default RecipeCard;
