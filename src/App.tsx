import React, { useEffect } from 'react';
import { Container, type EntranceAnimation, type ExitAnimation, type TailwindColor, type TailwindIntensity } from 'rkitech-components';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { startLoading, stopLoading } from './features/loader/loadingSlice';
import GlobalLoader from './features/loader/GlobalLoader';
import Navbar from './features/navbar/Navbar';
import Modal from './features/modal/Modal';
import Alert from './features/alert/Alert';
import Drawer from './features/drawer/Drawer';
import { Route, Routes } from 'react-router-dom';
import PageShell from './features/pageShell/PageShell';
import { useLocation } from "react-router-dom";
import { setActivePage } from './features/pageShell/activePageSlice';
import type { PageData, RenderMethod } from './cli/src/features/Pages/types/pageTypes';
import pages from './cli/src/features/Pages/json/pages.json';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const isLoading = useAppSelector((state) => state.loading["userProfile"] ?? false);

  useEffect(() => {
    dispatch(startLoading("userProfile"));
    try {
      const page = pages.find((p) => p.pagePath === location.pathname) as PageData | undefined;
      const pageNotFound = pages.find((p) => p.pagePath === 'page-not-found') as PageData | undefined;

      if (page) {
        dispatch(setActivePage(page));
      } else if (pageNotFound) {
        dispatch(setActivePage(pageNotFound));
      }
    } finally {
      setTimeout(() => {
        dispatch(stopLoading("userProfile"));
      }, 2000)
    }
  }, [dispatch]);

  return (
    <Container tailwindClasses="flex-col w-screen h-screen z-30 relative bg-gray-900">
      {isLoading ? (
        <Container tailwindClasses="h-full w-full justify-center items-center">
          <GlobalLoader target="userProfile" type="Bars" variant={2} color='amber' intensity={500} size={15}/>
        </Container>
      ) : (
        <Container tailwindClasses="h-full w-full flex-col">
          <Navbar />
          
          <Routes>
            {pages
              .filter((p) => p.pageActive)
              .map((p) => (
                <Route
                  key={p.pageID}
                  path={p.pagePath}
                  element={
                    <PageShell
                      pageID={p.pageID}
                      pageName={p.pageName}
                      pageRenderMethod={p.pageRenderMethod as RenderMethod}
                      pageActive={p.pageActive}
                      pagePath={p.pagePath}
                      pageColor={p.pageColor as unknown as TailwindColor}
                      pageIntensity={p.pageIntensity as unknown as TailwindIntensity}
                      pageEntranceAnimation={p.pageEntranceAnimation as unknown as EntranceAnimation}
                      pageExitAnimation={p.pageExitAnimation as unknown as ExitAnimation}
                    />
                  }
                />
              ))}
          </Routes>
          
          <Modal />
          <Alert />
          <Drawer />
        </Container>
      )}
    </Container>
  );
};

export default App;
