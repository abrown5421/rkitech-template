export const blankTemplate = (componentName: string) => `
import React from 'react';
import { Container } from 'rkitech-components';
import { useAppSelector } from '../../app/hooks';

const ${componentName}: React.FC = () => {
    const activePage = useAppSelector((state) => state.activePage);

    return (
        <Container 
            animationObject={{
                entranceAnimation: 'animate__fadeInUpBig',
                exitAnimation: 'animate__fadeOutDownBig',
                isEntering: activePage.activePageIn && activePage.activePageName === 'Blank'
            }}
            tailwindClasses='h-[calc(100vh-54px)] bg-gray-50 p-5 flex-row'
        >
            Blank
        </Container>
    );
};

export default ${componentName};
`;