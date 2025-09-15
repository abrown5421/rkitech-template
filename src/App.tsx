import React, { useEffect } from 'react';
import { Container } from 'rkitech-components';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { startLoading, stopLoading } from './features/loader/loadingSlice';
import Loader from './features/loader/Loader';
import Navbar from './features/navbar/Navbar';

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
        <Container tailwindClasses="h-full w-full">
          <Navbar />
        </Container>
      )}
    </Container>
  );
};

export default App;
