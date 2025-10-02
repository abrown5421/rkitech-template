export const blankTemplate = (componentName: string, folderName: string): string => 
  `import React from 'react';
import { Container } from 'rkitech-components';
import type { ${componentName}Props } from './${folderName}Types';
import { useGetTheme } from "../../hooks/useGetTheme";

    
const ${componentName}: React.FC<${componentName}Props> = () => {
    const themeBlack = useGetTheme("black");
    const themeWhite = useGetTheme("white");
    const themePrimary = useGetTheme("primary");

    return (
        <Container 
            tailwindClasses='w-full h-full min-h-[calc(100vh-50px)] p-5'

        >
            ${componentName}
        </Container>
    );
};

export default ${componentName};
`;