import React, { useEffect } from 'react';
import { Container } from 'rkitech-components';
import { useAppDispatch, useAppSelector } from './app/hooks';
import GlobalLoader from './features/loader/GlobalLoader';
import Navbar from './features/navbar/Navbar';
import Modal from './features/modal/Modal';
import Alert from './features/alert/Alert';
import Drawer from './features/drawer/Drawer';
import { Route, Routes } from 'react-router-dom';
import PageShell from './features/pageShell/PageShell';
import { useLocation } from "react-router-dom";
import { setActivePage } from './features/pageShell/activePageSlice';
import type { PageData } from './cli/src/features/Pages/types/pageTypes';
import { useLoadApplication } from './hooks/useLoadApplication';
import { useGetTheme } from './hooks/useGetTheme';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const pages = useAppSelector((state) => state.application.pages);

  useLoadApplication();
  const isLoading = useAppSelector(
    (state) => state.loading["application"] ?? false
  );

  useEffect(() => {
    if (!pages || pages.length === 0) return; 

    const page = pages.find((p) => p.pagePath === location.pathname) as PageData | undefined;

    const pageNotFound = pages.find((p) => p.pageName === 'PageNotFound') as PageData | undefined;

    if (page?.pageActive) {
      dispatch(setActivePage(page));
    } else if (pageNotFound) {
      dispatch(setActivePage(pageNotFound));
    }
  }, [dispatch, pages, location.pathname]);

  return (
    <Container tailwindClasses={`flex-col w-screen h-screen z-30 relative bg-${useGetTheme('black')}`}>
      {isLoading ? (
        <Container tailwindClasses="h-full w-full justify-center items-center">
          <GlobalLoader target="application" type="Bars" variant={2} color='amber' intensity={500} size={15}/>
        </Container>
      ) : (
        <Container tailwindClasses="h-full w-full flex-col">
          <Navbar />
          <Routes>
            {pages
              .filter(p => p.pageActive)
              .map(p => (
                <Route
                  key={p.pageID}
                  path={p.pagePath}
                  element={<PageShell {...p} />}
                />
            ))}
            <Route
              path="*"
              element={
                pages.find(p => p.pageName === 'PageNotFound') && (
                  <PageShell {...pages.find(p => p.pageName === 'PageNotFound')!} />
                )
              }
            />
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
