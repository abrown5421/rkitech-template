import React from 'react';
import { Button, Container, Image, Text } from 'rkitech-components';
import type { PageNotFoundProps } from './pagenotfoundTypes';
import { useNavigationHook } from '../../hooks/useNavigationHook';
import imageSrc from '../../../public/assets/404.png';
import { useAppSelector } from '../../app/hooks';

const PageNotFound: React.FC<PageNotFoundProps> = () => {
    const navigate = useNavigationHook();
    const application = useAppSelector((state) => state.application);
    const homePage = application.pages.find((p) => p.pagePath === '/');

    return (
        <Container 
            tailwindClasses='flex-row w-full h-full p-5 justify-center items-center'
        >
            <Container tailwindClasses='flex-col justify-center items-center w-full md:w-1/3'>
                
                <Text text='404' tailwindClasses='text-9xl font-mono text-amber-500 font-bold' />
                <Image src={imageSrc} tailwindClasses='w-full my-4' />
                <Text text="Not all who wander are lost. But you sure are" tailwindClasses='text-xl font-mono text-gray-900' />
                {homePage?.pagePath && (
                    <Button 
                        onClick={() => navigate(homePage)()}
                        tailwindClasses='m-5 bg-amber-500 text-white border-2 border-amber-500 py-1 px-4 rounded-xl cursor-pointer hover:text-amber-500 hover:bg-transparent'
                    >
                        Go Home
                    </Button>
                )}
            </Container>
        </Container>
    );
};

export default PageNotFound;
