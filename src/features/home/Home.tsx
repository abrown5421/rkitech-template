import React from 'react';
import { Container } from 'rkitech-components';
import type { HomeProps } from './homeTypes';
import PlaceholderImage from '../placeholderImage/placeholderImage';
import type { ColorObject } from '../../cli/src/features/Theme/types/themeTypes';

const xColors: ColorObject[] = [
    { color: "amber", intensity: 500 },
    { color: "gray", intensity: 900 },
  ];

  const yColors: ColorObject[] = [
    { color: "amber", intensity: 700 },
    { color: "orange", intensity: 500 },
  ];

const Home: React.FC<HomeProps> = () => {
    return (
        <Container tailwindClasses="w-full min-h-[calc(100vh-50px)] p-5 flex flex-col gap-4">
            <PlaceholderImage
                width="100%"
                height={250}
                cellSize={45}
                variance={0.4}
                xColors={xColors}
                yColors={yColors}
            />
        </Container>
    );
};

export default Home;
