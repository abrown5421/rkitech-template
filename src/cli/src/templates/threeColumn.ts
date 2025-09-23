export const threeColumnTemplate = (componentName: string, folderName: string): string => 
  `import React from 'react';
import { Container, Text } from 'rkitech-components';
import type { ${componentName}Props } from './${folderName}Types';

const ${componentName}: React.FC<${componentName}Props> = () => {
    return (
        <Container 
            tailwindClasses='flex-col w-full min-h-[calc(100vh-74px)] pt-5 px-5 mb-5'
        >    
            <Text text="${componentName}" tailwindClasses="text-xl font-mono text-gray-900"/>
            <Container 
                tailwindClasses='flex-row gap-4 justify-between'
            >
                <Container tailwindClasses='flex-col flex-1'>Column One</Container>
                <Container tailwindClasses='flex-col flex-1'>Column Two</Container>
                <Container tailwindClasses='flex-col flex-1'>Column Three</Container>                
            </Container>
        </Container>
    );
};

export default ${componentName};
`;