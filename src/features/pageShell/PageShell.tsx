import React, { useEffect } from 'react';
import Login from '../login/Login';
import BlogPost from '../blogPost/BlogPost';
import Blog from '../blog/Blog';
import PrivacyPolicy from '../privacyPolicy/PrivacyPolicy';
import { Container } from 'rkitech-components';
import { useAppSelector } from '../../app/hooks';
import Home from '../home/Home';
import PageNotFound from '../pagenotfound/PageNotFound';
import type { PageData } from '../../cli/src/features/Pages/types/pageTypes';
import Footer from '../footer/Footer';
import { getThemeColorKey } from '../../utils/getThemeColorKey';
import Renderer from '../renderer/Renderer';
import type { ParentNode } from '../renderer/rendererTypes';

const PageShell: React.FC<PageData> = ({
  pageName,
  pageRenderMethod,
  pageContent,
  pageColor,
  pageIntensity,
  pageEntranceAnimation,
  pageExitAnimation,
}) => {
  const activePage = useAppSelector((state) => state.activePage);
  const application = useAppSelector((state) => state.application);

  const colorString = !pageIntensity
    ? getThemeColorKey(pageColor)
      ? `${application.theme[pageColor].color}-${application.theme[pageColor].intensity}`
      : 'amber-500'
    : `${pageColor}-${pageIntensity}`;

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
      tailwindClasses={`flex-col bg-${colorString}`}
    >
      {pageRenderMethod === 'static' ? (
        <Container>
          {/* add manually generated pages here */}
          {activePage.activePageName === 'Home' && <Home />}
          {/* cli generated pages should appear here */}
          {activePage.activePageName === 'PageNotFound' && <PageNotFound />}{' '}
          {activePage.activePageName === 'Login' && <Login />}{' '}
          {activePage.activePageName === 'BlogPost' && <BlogPost />}{' '}
          {activePage.activePageName === 'Blog' && <Blog />}{' '}
          {activePage.activePageName === 'PrivacyPolicy' && <PrivacyPolicy />}
        </Container>
      ) : (
        <Container>
          <Renderer tree={pageContent as ParentNode} />
        </Container>
      )}
      <Footer />
    </Container>
  );
};

export default PageShell;
