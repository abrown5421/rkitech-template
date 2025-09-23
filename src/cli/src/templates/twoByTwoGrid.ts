export const twoByTwoGridTemplate = (componentName: string, folderName: string): string => 
  `import React from 'react';
import { Container, Text } from 'rkitech-components';
import type { ${componentName}Props } from './${folderName}Types';

const ${componentName}: React.FC<${componentName}Props> = () => {
    return (
        <Container 
            tailwindClasses='flex-col w-full h-full pt-5 px-5 mb-5'
        >    
            <Text text="${componentName}" tailwindClasses="text-xl font-mono text-gray-900"/>
            <Container 
                tailwindClasses='flex-1 flex-row gap-4 justify-between'
            >
                <Container tailwindClasses='flex-col flex-1'>Row One Column One</Container>
                <Container tailwindClasses='flex-col flex-1'>Row One Column Two</Container>
            </Container>
            <Container 
                tailwindClasses='flex-1 flex-row gap-4 justify-between'
            >
                <Container tailwindClasses='flex-col flex-1'>Row Two Column One</Container>
                <Container tailwindClasses='flex-col flex-1'>Row Two Column Two</Container>
            </Container>
        </Container>
    );
};

export default ${componentName};
`;