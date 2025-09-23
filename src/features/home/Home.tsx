import React from 'react';
import { Container } from 'rkitech-components';
import type { HomeProps } from './homeTypes';

const Home: React.FC<HomeProps> = () => {
    return (
        <Container 
            tailwindClasses='w-full min-h-[calc(100vh-74px)] overflow-auto pt-5 px-5 mb-5'
        >
            Home
        </Container>
    );
};

export default Home;
