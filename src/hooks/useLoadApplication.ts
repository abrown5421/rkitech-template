import { useEffect } from "react";
import { useAppDispatch } from "../app/hooks";
import { startLoading, stopLoading } from "../features/loader/loadingSlice";
import type { Navbar } from "../cli/src/features/Navbar/types/navTypes";
import { setNavbar, setPages } from "../app/globalSlice/applicationSlice";
import type { PageData } from "../cli/src/features/Pages/types/pageTypes";

const NAVBAR_JSON = "../src/cli/src/features/Navbar/json/navbar.json";
const PAGES_JSON = "../src/cli/src/features/Pages/json/pages.json";

export const useLoadApplication = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const loadApplication = async () => {
      dispatch(startLoading("application"));

      try {
        const navbarRes = await fetch(NAVBAR_JSON);
        const navbarData: Navbar = await navbarRes.json();
        dispatch(setNavbar(navbarData));

        const pagesRes = await fetch(PAGES_JSON);
        const pagesData: PageData[] = await pagesRes.json();
        dispatch(setPages(pagesData));
      } catch (err) {
        console.error("Error loading application data:", err);
      } finally {
        setTimeout(() => {
          dispatch(stopLoading("application"));
        }, 2000);
      }
    };

    loadApplication();
  }, [dispatch]);
};
