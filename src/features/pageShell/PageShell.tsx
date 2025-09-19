import React, { useEffect } from 'react';
import { Container } from 'rkitech-components';
import { useAppSelector } from '../../app/hooks';
import Home from '../home/Home';
import type { PageData } from '../../cli/src/shared/types/pageTypes';
import Test from '../test/Test';
import Test2 from '../test2/Test2';

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
        entranceAnimation: pageEntranceAnimation ?? 'animate__fadeInUpBig',
        exitAnimation: pageExitAnimation ?? 'animate__fadeOutDownBig',
        isEntering: activePage.activePageIn && activePage.activePageName === pageName,
      }}
      tailwindClasses={`h-[calc(100vh-54px)] p-5 bg-${colorString}`}
    >
      {/* add manually generated pages here */}
      {activePage.activePageName === 'Home' && <Home />}
      {/* cli generated pages should appear here */}
      {activePage.activePageName === 'Test' && <Test />}
      {activePage.activePageName === 'Test2' && <Test2 />}
    </Container>
  );
};

export default PageShell;
