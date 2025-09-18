export const blankTemplate = (componentName, folderName) => `import React from 'react';
import { Container } from 'rkitech-components';
import type { ${componentName}Props } from './${folderName}Types';

const ${componentName}: React.FC<${componentName}Props> = () => {
    return (
        <Container 
            tailwindClasses=''
        >
            ${componentName}
        </Container>
    );
};

export default ${componentName};
`;
