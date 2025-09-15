import React, { useEffect } from 'react';
import { Container } from 'rkitech-components';
import { useAppDispatch } from './app/hooks';
import { startLoading, stopLoading } from './features/loader/loadingSlice';
import Loader from './features/loader/Loader';

const App: React.FC = () => {
const dispatch = useAppDispatch();

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
      <Container tailwindClasses="h-full w-full justify-center items-center">
        <Loader target="userProfile" type="Bars" variant={2}/>
      </Container>
    </Container>
  );
};

export default App;