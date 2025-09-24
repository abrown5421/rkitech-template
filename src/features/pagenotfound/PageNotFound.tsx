import React from 'react';
import { Button, Container, Image, Text } from 'rkitech-components';
import type { PageNotFoundProps } from './pagenotfoundTypes';
import { useNavigationHook } from '../../hooks/useNavigationHook';
import imageSrc from '../../../public/assets/404.png';
import { useAppSelector } from '../../app/hooks';
import { useGetTheme } from '../../hooks/useGetTheme';

const PageNotFound: React.FC<PageNotFoundProps> = () => {
    const navigate = useNavigationHook();
    const application = useAppSelector((state) => state.application);
    const homePage = application.pages.find((p) => p.pagePath === '/');

    return (
        <Container 
            tailwindClasses='flex-row w-full min-h-[calc(100vh-50px)] p-5 justify-center items-center'

        >
            <Container tailwindClasses='flex-col justify-center items-center w-full md:w-1/3'>
                
                <Text text='404' tailwindClasses={`text-9xl font-mono text-${useGetTheme('primary')} font-bold`} />
                <Image src={imageSrc} tailwindClasses='w-full my-4' />
                <Text text="Not all who wander are lost. But you sure are" tailwindClasses={`text-xl font-mono text-${useGetTheme('black')}`} />
                {homePage?.pagePath && (
                    <Button 
                        onClick={() => navigate(homePage)()}
                        tailwindClasses={`m-5 bg-${useGetTheme('primary')} text-white border-2 border-${useGetTheme('primary')} py-1 px-4 rounded-xl cursor-pointer hover:text-${useGetTheme('primary')} hover:bg-transparent`}
                    >
                        Go Home
                    </Button>
                )}
            </Container>
        </Container>
    );
};

export default PageNotFound;
