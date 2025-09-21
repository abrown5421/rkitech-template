import React from 'react';
import { Button, Container, Image, Text } from 'rkitech-components';
import logo from '../../../public/assets/logo.png';
import pagesJson from '../../cli/src/shared/json/pages.json';
import navbarJson from '../../cli/src/shared/json/navbar.json';
import { useNavigationHook } from '../../hooks/useNavigationHook';
import type { PageData } from '../../cli/src/shared/types/pageTypes';
import type { NavItem } from '../../cli/src/shared/types/navItemTypes';
import { useAppSelector } from '../../app/hooks';

const Navbar: React.FC = () => {
  const navigate = useNavigationHook();
  const activePage = useAppSelector((state) => state.activePage);
  const navItems: NavItem[] = navbarJson as NavItem[];
  const pages: PageData[] = pagesJson as PageData[];

  return (
    <Container
      animationObject={{
        entranceAnimation: 'animate__fadeIn',
        exitAnimation: 'animate__fadeOut',
        isEntering: true
      }}
      tailwindClasses='w-full h-[54px] bg-gray-50 justify-between items-center relative z-20 shadow-[0_2px_4px_rgba(0,0,0,0.15)]'
    >
      <Container
        animationObject={{
          entranceAnimation: 'animate__slideInLeft',
          exitAnimation: 'animate__slideOutLeft',
          isEntering: true
        }}
        tailwindClasses='flex-row px-5 items-center'
      >
        <Image src={logo} tailwindClasses='h-[50px]' />
        <Text tailwindClasses='text-xl font-mono text-gray-900' text="Rkitech" />
      </Container>

      <Container
        animationObject={{
          entranceAnimation: 'animate__slideInRight',
          exitAnimation: 'animate__slideOutRight',
          isEntering: true
        }}
        tailwindClasses='flex-col px-5'
      >
        <Container tailwindClasses='flex-row gap-4'>
          {navItems.map((i) => {
            let onClickHandler: () => void;
            let isActive = false;

            if (i.itemType === 'page') {
              const page = pages.find((p) => p.pageID === i.itemID) as PageData;
              if (!page) return null; 
              isActive = activePage.activePageName === page.pageName;
              onClickHandler = navigate(page);
            } else if (i.itemType === 'link') {
              onClickHandler = () => window.open(i.itemLink || '#', '_blank');
            } else {
              return null;
            }

            const colorString = isActive
              ? `text-${i.itemActiveColor}-${i.itemActiveIntensity}`
              : `text-${i.itemColor}-${i.itemIntensity}`;

            const hoverString = isActive
              ? `hover:text-${i.itemColor}-${i.itemIntensity}`
              : `hover:text-${i.itemHoverColor}-${i.itemHoverIntensity}`;

            return (
              <Button
                key={i.itemID}
                tailwindClasses={`${colorString} cursor-pointer ${hoverString}`}
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
