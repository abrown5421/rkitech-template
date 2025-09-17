import React from 'react';
import { Container } from 'rkitech-components';
import { useAppSelector } from '../../app/hooks';
import type { HomeProps } from './homeTypes';

const Home: React.FC<HomeProps> = () => {
    const activePage = useAppSelector((state) => state.activePage);

    return (
        <Container 
            tailwindClasses=''
        >
            Home page
        </Container>
    );
};

export default Home;
