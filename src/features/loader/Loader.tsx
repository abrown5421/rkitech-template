import React from "react";
import type { LoaderProps } from "./loadingTypes";
import { useAppSelector } from "../../app/hooks";
import { Loader } from "rkitech-components";

const GlobalLoader: React.FC<LoaderProps> = ({ target }) => {
  const isLoading = useAppSelector((state) => state.loading[target] ?? false);

  return (
    <Loader
      show={isLoading}
      type="Bars"
      variant={5}
      color="amber"
      intensity={500}
    />
  );
};

export default GlobalLoader;
