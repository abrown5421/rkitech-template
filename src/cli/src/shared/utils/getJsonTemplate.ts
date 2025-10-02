import blankTemplate from '../../templates/blank/blank.json' with { type: 'json' };
import threeColumnTemplate from '../../templates/columns/threeColumn.json' with { type: 'json' };
import twoColumnTemplate from '../../templates/columns/twoColumn.json' with { type: 'json' };
import twoByThreeGridTemplate from '../../templates/grids/twoByThreeGrid.json' with { type: 'json' };
import twoByTwoGridTemplate from '../../templates/grids/twoByTwoGrid.json' with { type: 'json' };
import sidebarLeftTemplate from '../../templates/sidebar/sidebarLeft.json' with { type: 'json' };
import sidebarRightTemplate from '../../templates/sidebar/sidebarRight.json' with { type: 'json' };
import privacyPolicyTemplate from '../../templates/privacyPolicy/privacyPolicy.json' with { type: 'json' };

const templatesMap: Record<string, any> = {
    "Blank": blankTemplate,
    "Sidebar Left": sidebarLeftTemplate,
    "Sidebar Right": sidebarRightTemplate,
    "Two Column": twoColumnTemplate,
    "Three Column": threeColumnTemplate,
    "Two By Two Grid": twoByTwoGridTemplate,
    "Two By Three Grid": twoByThreeGridTemplate,
    "Privacy Policy": privacyPolicyTemplate,
};

export function getJsonTemplate(templateName: string) {
  const template = templatesMap[templateName];
  if (!template) {
    throw new Error(`Template "${templateName}" not found`);
  }
  return template;
}
