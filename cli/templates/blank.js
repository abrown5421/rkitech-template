export const blankTemplate = (componentName, folderName) => `import React from 'react';
import { Container } from 'rkitech-components';
import { useAppSelector } from '../../app/hooks';
import type { ${componentName}Props } from './${folderName}Types';

const ${componentName}: React.FC<${componentName}Props> = () => {
    const activePage = useAppSelector((state) => state.activePage);

    return (
        <Container 
            animationObject={{
                entranceAnimation: 'animate__fadeInUpBig',
                exitAnimation: 'animate__fadeOutDownBig',
                isEntering: activePage.activePageIn && activePage.activePageName === '${componentName}'
            }}
            tailwindClasses='h-[calc(100vh-54px)] bg-gray-50 p-5 flex-row'
        >
            <Container tailwindClasses='flex-col flex-1'>column one</Container>
            <Container tailwindClasses='flex-col flex-1'>column two</Container>
        </Container>
    );
};

export default ${componentName};
`;
