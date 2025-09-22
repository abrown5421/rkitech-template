import React from "react";
import { Container, Text } from "rkitech-components";
import type { BallsProps } from "./ballsTypes";

const Balls: React.FC<BallsProps> = () => {
  return (
    <Container tailwindClasses="flex-col w-full h-full">
      <Text text="Balls" tailwindClasses="text-xl font-mono text-gray-900" />
      <Container tailwindClasses="flex-row gap-4 justify-between">
        <Container tailwindClasses="flex-col flex-3">Column One</Container>
        <Container tailwindClasses="flex-col flex-9">Column Two</Container>
      </Container>
    </Container>
  );
};

export default Balls;
