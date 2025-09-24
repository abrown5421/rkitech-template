import type { PageData } from "../../cli/src/features/Pages/types/pageTypes";

export interface ActivePageState {
    activePageName: string;
    activePageIn: boolean;
    pageShellProps: PageData;
}