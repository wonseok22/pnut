import React from "react";

const RecipeVideoForm = (props) => {
  const { videoUrl, videoTitle } = props;

  console.log(videoUrl, videoTitle);
  return (
    <div className="w-300">
      <iframe
        className="h-full"
        title="video"
        id="ytplayer"
        type="text/html"
        src={`https://www.youtube.com/embed/${videoUrl}`}
        allowFullScreen="allowfullscreen"
      />
      <div className="text-lg mt-10 truncate font-bold">{videoTitle}</div>
    </div>
  );
};

export default RecipeVideoForm;
