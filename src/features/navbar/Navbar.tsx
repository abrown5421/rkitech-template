import React from 'react';
import { Button, Container, Image, Text } from 'rkitech-components';
import logo from '../../../public/assets/logo.png';
import pagesJson from '../../cli/src/shared/json/pages.json';
import { useNavigationHook } from '../../hooks/useNavigationHook';
import type { PageData } from '../../cli/src/shared/types/pageTypes';

const Navbar: React.FC = () => {
    const navigate = useNavigationHook();
    const pages: PageData[] = pagesJson as PageData[];
    
    return (
        <Container 
            animationObject={{
                entranceAnimation: 'animate__fadeIn',
                exitAnimation: 'animate__fadeOut',
                isEntering: true
            }}
            tailwindClasses='w-full h-[54px] bg-gray-50 justify-between items-center relative z-20 shadow-[0_2px_4px_rgba(0,0,0,0.15)]'
        >
            <Container 
                animationObject={{
                    entranceAnimation: 'animate__slideInLeft',
                    exitAnimation: 'animate__slideOutLeft',
                    isEntering: true
                }}
                tailwindClasses='flex-row px-5 items-center'
            >
                <Image src={logo} tailwindClasses='h-[50px]'/>
                <Text tailwindClasses='text-xl font-mono text-gray-900' text="Rkitech" />
            </Container>
            <Container 
                animationObject={{
                    entranceAnimation: 'animate__slideInRight',
                    exitAnimation: 'animate__slideOutRight',
                    isEntering: true
                }}
                tailwindClasses='flex-col px-5'
            >
                <Container tailwindClasses='flex-row gap-2'>
                    {pages
                    .filter((p) => p.pageActive)
                    .map((p) => (
                        <Button onClick={() => navigate(p)()}>
                            {p.pageName}
                        </Button>
                    ))}    
                </Container>
            </Container>
        </Container>
    );
};
export default Navbar;
