export const blankTemplate = (componentName: string, folderName: string): string => 
  `import React from 'react';
import { Container } from 'rkitech-components';
import type { ${componentName}Props } from './${folderName}Types';

const ${componentName}: React.FC<${componentName}Props> = () => {
    return (
        <Container 
            tailwindClasses='w-full'
        >
            ${componentName}
        </Container>
    );
};

export default ${componentName};
`;