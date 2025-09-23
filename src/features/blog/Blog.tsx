import React from "react";
import { Container } from "rkitech-components";
import type { BlogProps } from "./blogTypes";

const Blog: React.FC<BlogProps> = () => {
  return (
    <Container tailwindClasses="w-full min-h-[calc(100vh-50px)] p-5">
      Blog
    </Container>
  );
};

export default Blog;
