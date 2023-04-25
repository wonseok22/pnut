import React, { useState } from "react";
import { useNavigateToTop } from "../hooks/useNavigateToTop";

import deletepostAPI from "../api/deletepostAPI";

const MyPageRecipeBlock = (props) => {
  const navigate = useNavigateToTop();

  const { imgPath, recipeTitle, recipeId, onRecipeDelete } = props;

  const [isHovering, setIsHovering] = useState(false);
  const [isTrashHovering, setIsTrashHovering] = useState(false);
  const [isEditHovering, setIsEditHovering] = useState(false);
  const handleTrashMouseEnter = () => {
    setIsTrashHovering(true);
  };
  const handleTrashMouseLeave = () => {
    setIsTrashHovering(false);
  };
  const handleEditMouseEnter = () => {
    setIsEditHovering(true);
  };
  const handleEditMouseLeave = () => {
    setIsEditHovering(false);
  };

  const goToPostDetail = (postId) => {
    navigate(`/board/${postId}`);
  };
  const deletePost = async () => {
    const response = await deletepostAPI(recipeId);
    console.log("delete response: ", response);
    if (response.status === 200) {
      onRecipeDelete(recipeId);
    }
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <img
        className="object-cover shadow-md w-full h-full"
        src={imgPath}
        alt=""
      />
      {isHovering && (
        <div className="absolute inset-0 grid content-between w-full h-full grid-cols-1 rounded-10 bg-gray-800/50">
          <div className="flex justify-end w-full p-10">
            <img
              className={`h-30 cursor-pointer transition-transform duration-200 ${
                isTrashHovering ? "scale-125" : ""
              }`}
              src="assets\Trash Can.png"
              alt=""
              onMouseEnter={handleTrashMouseEnter}
              onMouseLeave={handleTrashMouseLeave}
              onClick={deletePost}
            />
          </div>
          <div className="flex justify-between p-10 text-center">
            <p className="text-lg text-white">{recipeTitle}</p>
            <img
              className={`h-30 cursor-pointer transition-transform duration-200 ${
                isEditHovering ? "scale-125" : ""
              }`}
              src="assets\Edit.png"
              alt=""
              onMouseEnter={handleEditMouseEnter}
              onMouseLeave={handleEditMouseLeave}
              onClick={(event) => goToPostDetail(recipeId)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPageRecipeBlock;
