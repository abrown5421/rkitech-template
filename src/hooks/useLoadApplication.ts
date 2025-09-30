import { useEffect } from "react";
import { useAppDispatch } from "../app/hooks";
import { startLoading, stopLoading } from "../features/loader/loadingSlice";
import type { Navbar } from "../cli/src/features/Navbar/types/navTypes";
import { setNavbar, setPages, setFooter, setTheme, setBlog } from "../app/globalSlice/applicationSlice";
import type { PageData } from "../cli/src/features/Pages/types/pageTypes";
import type { Footer } from "../cli/src/features/Footer/types/footerTypes";
import type { Theme } from "../cli/src/features/Theme/types/themeTypes";
import type { BlogConfig } from "../cli/src/features/Blog/types/blogTypes";

const NAVBAR_JSON = "../src/cli/src/features/Navbar/json/navbar.json";
const PAGES_JSON = "../src/cli/src/features/Pages/json/pages.json";
const FOOTER_JSON = "../src/cli/src/features/Footer/json/footer.json";
const THEME_JSON = "../src/cli/src/features/Theme/json/theme.json";
const BLOG_JSON = "../src/cli/src/features/Blog/json/blog.json";

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

        const footerRes = await fetch(FOOTER_JSON);
        const footerData: Footer = await footerRes.json();
        dispatch(setFooter(footerData));

        const themeRes = await fetch(THEME_JSON);
        const themeData: Theme = await themeRes.json();
        dispatch(setTheme(themeData));
        
        const blogRes = await fetch(BLOG_JSON);
        const blogData: BlogConfig = await blogRes.json();
        dispatch(setBlog(blogData));
        
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
