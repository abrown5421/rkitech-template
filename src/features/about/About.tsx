import React from "react";
import { Container } from "rkitech-components";
import type { AboutProps } from "./aboutTypes";

const About: React.FC<AboutProps> = () => {
  return (
    <Container tailwindClasses="w-full min-h-[calc(100vh-50px)] p-5">

      About
    </Container>
  );
};

export default About;
