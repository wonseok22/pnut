import React from "react";

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

/**
 * @param open boolean
 * @param close default click handler
 * @param onCheck 확인 btn click handler
 */
const AlertModal = (props) => {
  // 열기 닫기 모달 텍스트를 부모로부터 받아옴
  const { open, close, onCheck } = props;

  // background div만 close
  const preventionClose = (event) => {
    event.stopPropagation();
  };

  return (
    <div
      className={`${
        open ? "flex items-center animate-modalBgShow" : "hidden"
      } fixed top-0 right-0 bottom-0 left-0 z-50 bg-black bg-opacity-60 transition-all duration-300`}
      style={{ animation: open ? modalBgShow : "" }}
      onClick={close}
    >
      {open ? (
        <section
          onClick={preventionClose}
          className="mx-auto bg-white rounded-lg w-500 h-200"
          style={{ animation: open ? `modalShow 0.3s` : "" }}
        >
          <style>{modalShow}</style>
          <main className="flex flex-col p-4 my-50 mx-65 font-semibold text-center">
            {props.children}
            <div className="flex flex-row justify-evenly">
              <button
                type="button"
                className="px-4 py-2 text-white bg-red-400 rounded w-100 h-40 my-45 hover:bg-red-500"
                onClick={onCheck}
              >
                확인
              </button>
              <button
                type="button"
                className="px-4 py-2 text-white bg-gray-600 rounded w-100 h-40 my-45 hover:bg-gray-700"
                onClick={close}
              >
                닫기
              </button>
            </div>
          </main>
        </section>
      ) : null}
    </div>
  );
};

export default AlertModal;
