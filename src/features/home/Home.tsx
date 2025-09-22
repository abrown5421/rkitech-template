import React from 'react';
import { Container } from 'rkitech-components';
import type { HomeProps } from './homeTypes';

const Home: React.FC<HomeProps> = () => {
    return (
        <Container 
            tailwindClasses='w-full'
        >
            Home
        </Container>
    );
};

export default Home;
