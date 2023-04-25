import React, { useState, useEffect } from "react";
import FoodModal from "../UI/FoodModal";
import axios from "axios";
import getFoodAPI from "../api/getFoodAPI";

const SurveyCardThumbnail = (props) => {
  const { imgPath, foodTitle, foodId } = props;

  const encodedImgPath = imgPath.replace(/\(/g, "%28").replace(/\)/g, "%29");

  const [youtubeData, setYoutubeData] = useState();
  const [foodData, setFoodData] = useState(null);

  // getFoodAPI를 위한 userEmail 가져오기
  const state = JSON.parse(localStorage.getItem("persist:root"));
  const authentication = JSON.parse(state.auth);
  const userEmail = authentication.authentication.email;

  // youtube key
  // AIzaSyCMdNM2YNPPuW2Jia5gCXPQ0dQP7-oWSA0
  // AIzaSyCI8t8M1ADPjcTTAuIOs3G2w-Nev9hXwRs

  const openModal = (event) => {
    event.stopPropagation();
    axios
      .get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=3&q=${foodTitle}레시피&type=video&videoDefinition=high&key=AIzaSyCMdNM2YNPPuW2Jia5gCXPQ0dQP7-oWSA0`
      )
      .then((res) => {
        setYoutubeData(res.data.items);
      })

      .catch((err) => {
        console.log("youtube error: ", err);
      });
  };

  const getFood = async () => {
    try {
      // foodID 바꾸기
      const response = await getFoodAPI(foodId, userEmail);
      console.log("Test response: ", response.data.data);

      setFoodData(response.data.data);
    } catch (err) {
      console.log("error: ", err);
    }
  };

  useEffect(() => {
    getFood();
  }, []);

  const closeModal = (event) => {
    event.stopPropagation();
    setYoutubeData(null);
  };

  return (
    <div className="flex flex-col justify-center">
      {youtubeData && (
        <FoodModal
          close={closeModal}
          searchResult={youtubeData}
          food={foodData}
        />
      )}
      <button type="button" onClick={openModal}>
        <div
          className="h-150 w-150 rounded-full bg-cover bg-center bg-no-repeat hover:opacity-70"
          style={{ backgroundImage: `url(${encodedImgPath})` }}
        />
        <br />
        <p className="text-lg text-center font-extrabold"> {foodTitle} </p>
      </button>
    </div>
  );
};

export default SurveyCardThumbnail;
