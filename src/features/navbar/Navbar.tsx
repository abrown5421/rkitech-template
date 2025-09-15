import React from 'react';
import { Container, Image, Text } from 'rkitech-components';
import logo from '../../../public/assets/logo.png';

const Navbar: React.FC = () => {

    return (
        <Container tailwindClasses='w-full h-[54px] bg-gray-50 justify-between items-center'>
            <Container tailwindClasses='flex-row px-5 items-center'>
                <Image src={logo} tailwindClasses='h-[50px]'/>
                <Text tailwindClasses='text-xl font-mono text-gray-900' text="Rkitech" />
            </Container>
            <Container tailwindClasses='flex-col px-5'>menu</Container>
        </Container>
    );
};
export default Navbar;
