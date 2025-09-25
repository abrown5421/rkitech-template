import { PlaceholderConfig, PlaceholderImageProps } from "rkitech-components";

export type BlogPost = {
  postID: string;
  postTitle: string;
  postAuthor: string;
  postCategory: string;
  postExcerpt: string;
  postBody: string;
  postDate: string; 
  postImage: PlaceholderImageProps;
};

export type BlogConfig = {
  blogActive: boolean;
  blogTitle: string;
  postsPerPage: number;
  postsPerRow: number;
  postSorter: boolean;
  postCategoryFilter: boolean;
  blogCategories: string[];
  blogPosts: BlogPost[];
};