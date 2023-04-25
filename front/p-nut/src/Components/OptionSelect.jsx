import React from "react";

const OptionSelect = (props) => {
  const { content, idx, eventDispatcher, refInfo, type } = props;
  return (
    <div className="mt-15 flex flex-row" key={content}>
      <input
        type={type}
        name={content}
        id={`input-${idx}`}
        ref={refInfo}
        onChange={eventDispatcher}
      />
      <div className="text-19 ml-13" id={idx} onClick={eventDispatcher}>
        {content}
      </div>
    </div>
  );
};

export default OptionSelect;
