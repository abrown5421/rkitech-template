import type { BlogConfig } from "../../cli/src/features/Blog/types/blogTypes";
import type { Footer } from "../../cli/src/features/Footer/types/footerTypes";
import type { Navbar } from "../../cli/src/features/Navbar/types/navTypes";
import type { PageData } from "../../cli/src/features/Pages/types/pageTypes";
import type { Theme } from "../../cli/src/features/Theme/types/themeTypes";

export interface ApplicationProps {
    pages: PageData[];
    navbar: Navbar;
    footer: Footer;
    theme: Theme;
    blog: BlogConfig;
}