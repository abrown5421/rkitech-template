import { blankTemplate } from "../../templates/blank/blank.js";
import { privacyPolicyTemplate } from "../../templates/privacyPolicy/privacyPolicy.js";
import { sidebarLeftTemplate } from "../../templates/sidebar/sidebarLeft.js";
import { sidebarRightTemplate } from "../../templates/sidebar/sidebarRight.js";
import { threeColumnTemplate } from "../../templates/columns/threeColumn.js";
import { twoByTwoGridTemplate } from "../../templates/grids/twoByTwoGrid.js";
import { twoColumnTemplate } from "../../templates/columns/twoColumn.js";
import { blogTemplate } from "../../templates/blog/blog.js";
import { blogPostTemplate } from "../../templates/blog/blogPost.js";
import { authTemplate } from "../../templates/auth/auth.js";

export const TEMPLATES: Record<string, (componentName: string, folderName: string) => string> = {
  "Blank": blankTemplate,
  "Sidebar Left": sidebarLeftTemplate,
  "Sidebar Right": sidebarRightTemplate,
  "Two Column": twoColumnTemplate,
  "Three Column": threeColumnTemplate,
  "Two By Two Grid": twoByTwoGridTemplate,
  "Auth": authTemplate,
  "Privacy Policy": privacyPolicyTemplate,
  "Blog": blogTemplate,
  "Blog Post": blogPostTemplate
};
