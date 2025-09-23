import React from "react";
import { Container } from "rkitech-components";
import type { BlogProps } from "./blogTypes";

const Blog: React.FC<BlogProps> = () => {
  return (
    <Container tailwindClasses="w-full min-h-[calc(100vh-74px)] overflow-auto pt-5 px-5 mb-5">
      Blog
    </Container>
  );
};

export default Blog;
