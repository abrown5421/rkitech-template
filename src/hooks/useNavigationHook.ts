import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../app/hooks";
import { setActivePage, setActivePageIn } from "../features/pageShell/activePageSlice";
import type { PageData } from "../cli/src/features/Pages/types/pageTypes";

export const useNavigationHook = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const useNavigation = (page: PageData) => () => {
    dispatch(setActivePageIn(false));

    setTimeout(() => {
      dispatch(setActivePage(page));
      
      navigate(page.pagePath);
    }, 500);
  };

  return useNavigation;
};