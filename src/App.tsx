import React, { useEffect } from 'react';
import { Container, type EntranceAnimation, type ExitAnimation, type TailwindColor, type TailwindIntensity } from 'rkitech-components';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { startLoading, stopLoading } from './features/loader/loadingSlice';
import Loader from './features/loader/Loader';
import Navbar from './features/navbar/Navbar';
import Modal from './features/modal/Modal';
import Alert from './features/alert/Alert';
import Drawer from './features/drawer/Drawer';
import pages from '../shared/pages.json';
import { Route, Routes } from 'react-router-dom';
import PageShell from './features/pageShell/PageShell';
import type { RenderMethod } from './features/pageShell/pageShellTypes';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.loading["userProfile"] ?? false);

  useEffect(() => {
    const fetchUser = async () => {
      dispatch(startLoading("userProfile"));
      try {
        await new Promise((res) => setTimeout(res, 2000)); 
      } finally {
        dispatch(stopLoading("userProfile"));
      }
    };

    fetchUser();
  }, [dispatch]);

  return (
    <Container tailwindClasses="flex-col w-screen h-screen z-30 relative bg-gray-900">
      {isLoading ? (
        <Container tailwindClasses="h-full w-full justify-center items-center">
          <Loader target="userProfile" type="Bars" variant={2} />
        </Container>
      ) : (
        <Container tailwindClasses="h-full w-full flex-col">
          <Navbar />
          
          <Routes>
            {pages
              .filter((p) => p.pageActive)
              .map((p) => {
                let routePath = p.pagePath;
                
                return (
                  <Route
                    path={routePath}
                    element={
                      <PageShell
                        pageName={p.pageName}
                        pageRenderMethod={p.pageRenderMethod as RenderMethod} 
                        pageActive={p.pageActive}
                        pagePath={p.pagePath}
                        pageContent={p.pageContent}
                        pageColor={p.pageColor as unknown as TailwindColor}
                        pageIntensity={p.pageIntensity as unknown as TailwindIntensity}
                        pageEntranceAnimation={p.pageEntranceAnimation as unknown as EntranceAnimation}
                        pageExitAnimation={p.pageExitAnimation as unknown as ExitAnimation}
                      />
                    }
                  />
                );
              })}
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
