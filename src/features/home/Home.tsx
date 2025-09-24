import React from 'react';
import { Container } from 'rkitech-components';
import type { HomeProps } from './homeTypes';

const Home: React.FC<HomeProps> = () => {
    return (
        <Container tailwindClasses="w-full min-h-[calc(100vh-50px)] p-5 flex flex-col gap-4">
            Home
        </Container>
    );
};

export default Home;
