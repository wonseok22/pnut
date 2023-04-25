import React from "react";

const OrderBlock = (props) => {
  const { imgPath, text, idx } = props;

  return (
    <div className="my-35">
      <img src={imgPath} alt="" />
      <div className="flex items-center text-20 mt-35">
        <div className="bg-#FF6B6C rounded-20 text-20 text-prettywhite py-5 px-15 w-auto">
          STEP {idx + 1}
        </div>
        <div className="ml-35">{text}</div>
      </div>
    </div>
  );
};

export default OrderBlock;
