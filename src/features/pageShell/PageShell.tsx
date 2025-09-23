import React, { useEffect } from 'react';

import { Container } from 'rkitech-components';
import { useAppSelector } from '../../app/hooks';
import Home from '../home/Home';
import PageNotFound from '../pagenotfound/PageNotFound';
import type { PageData } from '../../cli/src/features/Pages/types/pageTypes';

const PageShell: React.FC<PageData> = ({
  pageName,
  pageColor,
  pageIntensity,
  pageEntranceAnimation,
  pageExitAnimation,
}) => {
  const activePage = useAppSelector((state) => state.activePage);
  const colorString = pageColor + '-' + pageIntensity;

  useEffect(() => {
    console.log(activePage);
  }, [activePage]);

  return (
    <Container
      animationObject={{
        entranceAnimation: pageEntranceAnimation ?? 'animate__fadeIn',
        exitAnimation: pageExitAnimation ?? 'animate__fadeOut',
        isEntering: activePage.activePageIn && activePage.activePageName === pageName,
      }}
      tailwindClasses={`flex-col bg-${colorString} overflow-scroll`}
    >
      {/* add manually generated pages here */}
      {activePage.activePageName === 'Home' && <Home />}
      {/* cli generated pages should appear here */}
      {activePage.activePageName === 'PageNotFound' && <PageNotFound />}{' '}
    </Container>
  );
};

export default PageShell;
