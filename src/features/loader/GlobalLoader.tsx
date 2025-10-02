import React from "react";
import type { LoaderProps } from "./loadingTypes";
import { useAppSelector } from "../../app/hooks";
import { Container, Loader } from "rkitech-components";

const GlobalLoader: React.FC<LoaderProps> = ({ target, type, variant, color, intensity, size }) => {
  const isLoading = useAppSelector((state) => state.loading[target] ?? false);

  return (
    <Container tailwindClasses={`h-${size} w-${size} justify-center items-center`}>
        <Loader
            show={isLoading}
            loaderType={type}
            variant={variant}
            color={color}
            intensity={intensity}
        />
    </Container>
  );
};

export default GlobalLoader;
