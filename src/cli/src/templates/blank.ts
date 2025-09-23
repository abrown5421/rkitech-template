export const blankTemplate = (componentName: string, folderName: string): string => 
  `import React from 'react';
import { Container } from 'rkitech-components';
import type { ${componentName}Props } from './${folderName}Types';

const ${componentName}: React.FC<${componentName}Props> = () => {
    return (
        <Container 
            tailwindClasses='w-full min-h-[calc(100vh-74px)] overflow-auto pt-5 px-5 mb-5'
        >
            ${componentName}
        </Container>
    );
};

export default ${componentName};
`;