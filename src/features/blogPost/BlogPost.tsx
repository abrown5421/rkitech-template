import React from "react";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { Container, Text, PlaceholderImage } from "rkitech-components";
import { useGetTheme } from "../../hooks/useGetTheme";
import { formatDate } from "../../utils/formatDate";

const BlogPost: React.FC = () => {
  const { postID } = useParams<{ postID: string }>();
  const posts = useAppSelector((state) => state.application.blog.blogPosts);
  const post = posts.find((p) => p.postID === postID);

  const themeBlack = useGetTheme("black");
  const themeWhite = useGetTheme("white");
  const themePrimary = useGetTheme("primary");

  if (!post) return <Text text="Blog post not found" />;

  return (
    <Container
      tailwindClasses={`flex-col w-full h-full min-h-[calc(100vh-50px)] text-${themeBlack}`}
    >
      <div className="relative">
        <PlaceholderImage
          width="100%"
          height="300px"
          src={post.postImage.src}
          cellSize={post.postImage.cellSize}
          variance={post.postImage.variance}
          xColors={post.postImage.xColors}
          yColors={post.postImage.yColors}
        />
        <Container
          tailwindClasses={`absolute top-5 right-5 py-1 px-3 rounded-xl bg-${themeWhite} shadow-md`}
        >
          <Text
            text={post.postCategory}
            tailwindClasses={`text-sm font-medium text-${themePrimary}`}
          />
        </Container>
      </div>
      <Container tailwindClasses="flex-col w-full md:w-4/5 mx-auto pt-4 pr-4 pl-4 pb-8">
        <Text text={post.postTitle} tailwindClasses="text-3xl my-4" />
        <Container tailwindClasses="flex-row items-center justify-between">
          <Text
            text={post.postAuthor}
            tailwindClasses={`font-medium text-${themePrimary}`}
          />
          <Text
            text={formatDate(post.postDate)}
            tailwindClasses="text-sm text-gray-500"
          />
        </Container>
        <div className="h-px bg-gray-300 my-4"></div>
        <Renderer tree={post.postBody} />
      </Container>
    </Container>
  );
};

export default BlogPost;
