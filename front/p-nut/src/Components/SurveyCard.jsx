import React, { useState, useEffect } from "react";
import SurveyCardThumbnail from "./SurveyCardThumbnail";

const SurveyCard = (props) => {
  const data = [
    {
      imgPath: "/assets/samplefoodimg.png",
      foodTitle: "닭도리탕",
      id: 1,
    },
    {
      imgPath: "/assets/samplefoodimg.png",
      foodTitle: "닭도리탕",
      id: 2,
    },
    {
      imgPath: "/assets/samplefoodimg.png",
      foodTitle: "닭도리탕",
      id: 3,
    },
  ];

  const {
    title,
    tag1,
    tag2,
    guidecontext,
    nutrientcontext,
    nutrientfood,
    initialExpanded = false,
    additionalClass = "",
  } = props;

  console.log("nutrientfood : ", nutrientfood);

  const [expanded, setExpanded] = useState(initialExpanded);
  const [headerColor, setHeaderColor] = useState("#000");

  const getRandomPastelColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 100%, 85%)`;
  };

  useEffect(() => {
    setHeaderColor(getRandomPastelColor());
  }, []);

  return (
    <div
      className={`bg-white w-full ${
        expanded || additionalClass
          ? "rounded-b-lg shadow-md mb-30"
          : "shadow-md"
      }`}
      style={{ transitionDelay: expanded ? "0.3s" : "0s" }}
    >
      <div
        className="px-40 pt-40 space-y-5 rounded-t-lg cursor-pointer pb-100"
        onClick={() => setExpanded(!expanded)}
        style={{ backgroundColor: headerColor }}
      >
        <p className="text-xl font-extrabold">{title}</p>
        <p className="font-extrabold text-md">{tag1} </p>
        <p className="font-extrabold text-md">{tag2}</p>
      </div>
      <div
        className={` overflow-hidden transition-all ease-in-out duration-1000 space-y-15 pb-20 ${
          expanded ? "max-h-screen " : "max-h-0"
        }`}
      >
        <div className="p-40 space-y-50">
          <section>
            <div className=" space-y-30">
              <img src="assets\Improve Guide-1.png" alt="" />
              <p className="text-lg">{guidecontext}</p>
            </div>
          </section>
          <section>
            <div className=" space-y-30">
              <img src="assets\Improve Guide-2.png" alt="" />
              <p className="text-lg">{nutrientcontext}</p>
            </div>
          </section>
          <section>
            <img src="assets\Improve Guide.png" alt="" />
            <div className="flex px-40 pt-30 space-x-70">
              {nutrientfood.map((food, index) => (
                <SurveyCardThumbnail
                  imgPath={food.url}
                  foodTitle={food.name}
                  foodId={food.food_id}
                  key={`${index} - ${food.name}`}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SurveyCard;
