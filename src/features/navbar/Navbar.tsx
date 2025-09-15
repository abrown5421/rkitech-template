import React from 'react';
import { Container, Image, Text } from 'rkitech-components';
import logo from '../../../public/assets/logo.png';

const Navbar: React.FC = () => {

    return (
        <Container 
            animationObject={{
                entranceAnimation: 'animate__fadeIn',
                exitAnimation: 'animate__fadeOut',
                isEntering: true
            }}
            tailwindClasses='w-full h-[54px] bg-gray-50 justify-between items-center'
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
                menu
            </Container>
        </Container>
    );
};
export default Navbar;
