import type { Navbar } from "../../cli/src/features/Navbar/types/navTypes";
import type { PageData } from "../../cli/src/features/Pages/types/pageTypes";

export interface ApplicationProps {
    pages: PageData[];
    navbar: Navbar;
}