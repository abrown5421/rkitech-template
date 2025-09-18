import type { PageData } from "../../cli/src/shared/types/pageTypes";

export interface ActivePageState {
    activePageName: string;
    activePageIn: boolean;
    PageShellProps: PageData;
}