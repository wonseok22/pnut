import { useState } from "react";

export const useDivInputEventHandler = (inputRef) => {
  const [clickedCnt, setClickedCnt] = useState(0);
  const [checkedObj, setCheckedObj] = useState({});

  const divClickHandler = (e) => {
    const { id } = e.target;
    const inputTag = inputRef[id].current;
    const isChecked = inputTag.checked;
    const target = inputTag.name;

    if (isChecked) {
      inputTag.checked = false;
      setCheckedObj((prev) => {
        delete prev[id];
        return { ...prev };
      });
      setClickedCnt((prev) => {
        return prev - 1;
      });
      return;
    }

    if (clickedCnt >= 3) {
      return;
    }

    inputTag.checked = !isChecked;

    setCheckedObj((prev) => {
      prev[id] = target;
      return { ...prev };
    });
    setClickedCnt((prev) => {
      return prev + 1;
    });
  };

  const inputChangeHandler = (e) => {
    const id = e.target.id.split("-")[1];
    const target = e.target.name;

    if (!e.target.checked) {
      setCheckedObj((prev) => {
        delete prev[id];
        return { ...prev };
      });
      setClickedCnt((prev) => {
        return prev - 1;
      });
      return;
    }

    if (clickedCnt >= 3) {
      e.target.checked = false;
      return;
    }

    setCheckedObj((prev) => {
      prev[id] = target;
      return { ...prev };
    });
    setClickedCnt((prev) => {
      return prev + 1;
    });
  };

  const initCheckedObj = (initCheckedArr, nameArr, inputRef) => {
    console.log(nameArr);
    let cnt = 0;
    const checkedObj = {};
    initCheckedArr.forEach((value, idx) => {
      if (value) {
        console.log(inputRef);
        const inputTag = inputRef[Number(idx)].current;
        console.log(idx);
        inputTag.checked = true;
        checkedObj[idx] = nameArr[idx];
        cnt += 1;
      }
    });
    setCheckedObj(checkedObj);
    setClickedCnt(cnt);
  };

  const eventDispatcher = (e) => {
    console.log(e);
    if (!e.target.id) {
      return;
    }

    switch (e.target.nodeName.toLowerCase()) {
      case "div":
        return divClickHandler(e);
      case "input":
        return inputChangeHandler(e);
      default:
        return;
    }
  };

  return [clickedCnt, checkedObj, initCheckedObj, eventDispatcher];
};
