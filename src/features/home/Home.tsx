import React from 'react';
import { Container } from 'rkitech-components';

const Home: React.FC = () => {

    return (
        <Container 
            animationObject={{
                entranceAnimation: 'animate__fadeInUpBig',
                exitAnimation: 'animate__fadeOutDownBig',
                isEntering: true
            }}
            tailwindClasses='h-[calc(100vh-54px)] bg-gray-50 p-5'
        >
            Home
        </Container>
    );
};
export default Home;
