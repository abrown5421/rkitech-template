import React from 'react';
import { Button, Container, Image, Text, type EntranceAnimation, type ExitAnimation } from 'rkitech-components';
import logo from '../../../public/assets/logo.png';
import { useNavigationHook } from '../../hooks/useNavigationHook';
import { useAppSelector } from '../../app/hooks';
import type { PageData } from '../../cli/src/features/Pages/types/pageTypes';
import { useGetTheme } from '../../hooks/useGetTheme';
import { getThemeColorKey } from '../../utils/getThemeColorKey';

const Navbar: React.FC = () => {
  const navigate = useNavigationHook();
  const activePage = useAppSelector((state) => state.activePage);
  const application = useAppSelector((state) => state.application);
  
  const colorString = !application.navbar.navbarBgIntensity
      ? getThemeColorKey(application.navbar.navbarBgColor)
        ? `${application.theme[application.navbar.navbarBgColor].color}-${application.theme[application.navbar.navbarBgColor].intensity}`
        : 'amber-500'
      : `${application.navbar.navbarBgColor}-${application.navbar.navbarBgIntensity}`;

  const stickyNav = application.navbar.navbarSticky ? 'sticky top-0' : '';

  const getColorClass = (color: any, intensity: any, prefix: string = 'text') => {
    if (intensity === false) {
      return getThemeColorKey(color)
        ? `${prefix}-${application.theme[color].color}-${application.theme[color].intensity}`
        : `${prefix}-amber-500`;
    }
    return `${prefix}-${color}-${intensity}`;
  };

  return (
    <Container
      animationObject={{
        entranceAnimation: 'animate__fadeIn',
        exitAnimation: 'animate__fadeOut',
        isEntering: true
      }}
      tailwindClasses={`${stickyNav} w-full h-[54px] bg-${colorString} justify-between items-center relative z-20 shadow-[0_2px_4px_rgba(0,0,0,0.15)]`}
    >
      <Container
        animationObject={{
          entranceAnimation: application.navbar.navbarLeftSectionAnimations.entranceAnimation as EntranceAnimation,
          exitAnimation: application.navbar.navbarLeftSectionAnimations.exitAnimation as ExitAnimation,
          isEntering: true
        }}
        tailwindClasses='flex-row px-5 items-center'
      >
        <Image src={logo} tailwindClasses='h-[50px]' />
        <Text tailwindClasses={`text-xl font-mono text-${useGetTheme('black')}`} text={application.navbar.navbarTitle} />
      </Container>

      <Container tailwindClasses='flex-col px-5'>
        <Container tailwindClasses='flex-row gap-4'>
          {application.navbar.navbarMenuItems.map((i) => {
            let onClickHandler: () => void;
            let isActive = false;

            if (i.itemType === 'page') {
              const page = application.pages.find((p) => p.pageID === i.itemID) as PageData;
              if (!page) return null; 
              isActive = activePage.activePageName === page.pageName;
              onClickHandler = navigate(page);
            } else if (i.itemType === 'link') {
              onClickHandler = () => window.open(i.itemLink || '#', '_blank');
            } else {
              return null;
            }

            const colorClass = isActive
              ? getColorClass(i.itemActiveColor, i.itemActiveIntensity)
              : getColorClass(i.itemColor, i.itemIntensity);

            const hoverClass = isActive
              ? `hover:${getColorClass(i.itemColor, i.itemIntensity)}`
              : `hover:${getColorClass(i.itemHoverColor, i.itemHoverIntensity)}`;

            return (
              <Button
                key={i.itemID}
                tailwindClasses={`${colorClass} cursor-pointer ${hoverClass}`}
                onClick={onClickHandler}
              >
                {i.itemName}
              </Button>
            );
          })}
        </Container>
      </Container>
    </Container>
  );
};

export default Navbar;