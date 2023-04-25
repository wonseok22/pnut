import React from "react";
import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./Pages/RootLayout";
import MainPage from "./Pages/MainPage";
import ArticleCreatePage from "./Pages/ArticleCreatePage";
import ArticleListPage, {
  loader as articleListLoader,
} from "./Pages/ArticleListPage";
import ArticleDetailPage from "./Pages/ArticleDetailPage";
import RecipeDetailPage from "./Pages/RecipeDetailPage";
import SymptomsRecommendPage, {
  loader as symptomRecommendLoader,
} from "./Pages/SymptomsRecommendPage";

import SurveyRecommendPage, {
  loader as surveyRecommendLoader,
} from "./Pages/SurveyRecommendPage";
import LoginPage from "./Pages/LoginPage";
import SignupPage from "./Pages/SignupPage";
import MyPage, { loader as myPageLoader } from "./Pages/MyPage";

import SearchRecommendPage, {
  loader as searchRecommendLoader,
} from "./Pages/SearchRecommendPage";

import SurveyLayout from "./Pages/SurveyLayout";
import SurveyIndexPage from "./Pages/SurveyIndexPage";
import SurveySymptomsPage from "./Pages/SurveySymptomsPage";
import SurveyQuestionsPage from "./Pages/SurveyQuestionsPage";
import PageNotFound from "./Pages/PageNotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <MainPage /> },
      {
        path: "symptoms",
        element: <SymptomsRecommendPage />,
        loader: symptomRecommendLoader,
      },
      {
        path: "board",
        element: <ArticleListPage />,
        loader: articleListLoader,
      },
      {
        path: "board/:articleId",
        element: <ArticleDetailPage />,
      },
      {
        path: "newpost",
        element: <ArticleCreatePage />,
      },
      {
        path: "recipe/:recipeId",
        element: <RecipeDetailPage />,
      },
      {
        path: "my-survey",
        element: <SurveyRecommendPage />,
        loader: surveyRecommendLoader,
      },
      {
        path: "mypage",
        element: <MyPage />,
        loader: myPageLoader,
      },
      {
        path: "search",
        element: <SearchRecommendPage />,
        loader: searchRecommendLoader,
      },
      {
        path: "newsurvey",
        element: <SurveyLayout />,
        children: [
          {
            index: true,
            element: <SurveyIndexPage />,
          },
          {
            path: "symptoms",
            element: <SurveySymptomsPage />,
          },
          {
            path: ":question1/:question2/:question3/:preAnswer",
            element: <SurveyQuestionsPage />,
          },
        ],
      },
      {
        path: "*",
        element: <PageNotFound />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/signup",
        element: <SignupPage />,
      },
    ],
  },
]);

export default router;
