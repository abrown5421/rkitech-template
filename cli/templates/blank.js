export const blankTemplate = (componentName, folderName) => `import React from 'react';
import { Container } from 'rkitech-components';
import { useAppSelector } from '../../app/hooks';
import type { ${componentName}Props } from './${folderName}Types';

const ${componentName}: React.FC<${componentName}Props> = () => {
    const activePage = useAppSelector((state) => state.activePage);

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
