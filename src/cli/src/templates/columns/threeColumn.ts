export const threeColumnTemplate = (componentName: string, folderName: string): string => 
  `import React from 'react';
import { Container, Text } from 'rkitech-components';
import type { ${componentName}Props } from './${folderName}Types';
import { useGetTheme } from "../../hooks/useGetTheme";

const ${componentName}: React.FC<${componentName}Props> = () => {
    const themeBlack = useGetTheme("black");
    const themeWhite = useGetTheme("white");
    const themePrimary = useGetTheme("primary");

    return (
        <Container 
            tailwindClasses='flex-col w-full min-h-[calc(100vh-50px)] p-5'

        >    
            <Text text="${componentName}" tailwindClasses="text-xl primary-font text-gray-900"/>
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