import React from "react";
import type { LoaderProps } from "./loadingTypes";
import { useAppSelector } from "../../app/hooks";
import { Container, Loader } from "rkitech-components";

const GlobalLoader: React.FC<LoaderProps> = ({ target, type, variant }) => {
  const isLoading = useAppSelector((state) => state.loading[target] ?? false);

  return (
    <Container tailwindClasses="h-15 w-15 justify-center items-center">
        <Loader
            show={isLoading}
            type={type}
            variant={variant}
            color="amber"
            intensity={500}
        />
    </Container>
  );
};

export default GlobalLoader;
