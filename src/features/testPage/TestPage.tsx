import React from 'react';
import { Container } from 'rkitech-components';
import { useAppSelector } from '../../app/hooks';
import type { TestPageProps } from './testPageTypes';

const TestPage: React.FC<TestPageProps> = () => {
    const activePage = useAppSelector((state) => state.activePage);

    return (
        <Container 
            animationObject={{
                entranceAnimation: 'animate__fadeInUpBig',
                exitAnimation: 'animate__fadeOutDownBig',
                isEntering: activePage.activePageIn && activePage.activePageName === 'TestPage'
            }}
            tailwindClasses='h-[calc(100vh-54px)] bg-gray-50 p-5 flex-row'
        >
            <Container tailwindClasses='flex-col flex-1'>column one</Container>
            <Container tailwindClasses='flex-col flex-1'>column two</Container>
        </Container>
    );
};

export default TestPage;
