import { authTemplate } from "../../templates/Auth.js";
import { blankTemplate } from "../../templates/blank.js";
import { privacyPolicyTemplate } from "../../templates/privacyPolicy.js";
import { sidebarLeftTemplate } from "../../templates/sidebarLeft.js";
import { sidebarRightTemplate } from "../../templates/sidebarRight.js";
import { threeColumnTemplate } from "../../templates/threeColumn.js";
import { twoByTwoGridTemplate } from "../../templates/twoByTwoGrid.js";
import { twoColumnTemplate } from "../../templates/twoColumn.js";

export const TEMPLATES: Record<string, (componentName: string, folderName: string) => string> = {
  "Blank": blankTemplate,
  "Sidebar Left": sidebarLeftTemplate,
  "Sidebar Right": sidebarRightTemplate,
  "Two Column": twoColumnTemplate,
  "Three Column": threeColumnTemplate,
  "Two By Two Grid": twoByTwoGridTemplate,
  "Auth": authTemplate,
  "Privacy Policy": privacyPolicyTemplate,
};
