import React, { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const SelectBtn = (props) => {
  const {
    btnName,
    choiceArr,
    clickHandler,
    fontColor,
    fontSize,
    choiceFontColor,
  } = props;
  return (
    <Menu
      as="div"
      className={`relative w-120 ${fontSize && `text-${fontSize}`} ${
        choiceFontColor && `text-${choiceFontColor}`
      }`}
    >
      <div className={`${fontColor && `text-${fontColor}`}`}>
        <Menu.Button className="flex items-center justify-center w-full font-regular text-md">
          {btnName}
          <img
            className="h-10 ml-10 rotate-90"
            src="/assets/chevron.png"
            alt=""
          />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 origin-top-right w-170 rounded-5 bg-white/70 ">
          <div className={`py-2 text-${choiceFontColor}`}>
            {choiceArr.map((choice) => (
              <Menu.Item key={choice}>
                {({ active }) => (
                  <button
                    type="button"
                    onClick={() => {
                      clickHandler(choice);
                    }}
                    className={classNames(
                      active ? "bg-white " : "",
                      "block px-15 py-10 text-md rounded-5 w-full text-start"
                    )}
                  >
                    {choice}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default SelectBtn;
