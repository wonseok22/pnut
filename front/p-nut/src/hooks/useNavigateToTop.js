import { useNavigate } from "react-router-dom";

export const useNavigateToTop = () => {
  const navigate = useNavigate();

  const navigateAndReset = (to, replace = false) => {
    window.scrollTo(0, 0);
    if (replace) {
      navigate(to, { replace });
      return;
    }
    navigate(to);
  };

  return navigateAndReset;
};
