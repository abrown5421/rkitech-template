import React from 'react';
import { Container } from 'rkitech-components';
import { useAppSelector } from '../../app/hooks';

const Home: React.FC = () => {
    const activePage = useAppSelector((state) => state.activePage);

    return (
        <Container 
            animationObject={{
                entranceAnimation: 'animate__fadeInUpBig',
                exitAnimation: 'animate__fadeOutDownBig',
                isEntering: activePage.activePageIn && activePage.activePageName === 'Home'
            }}
            tailwindClasses='h-[calc(100vh-54px)] bg-gray-50 p-5'
        >
            Home
        </Container>
    );
};
export default Home;
