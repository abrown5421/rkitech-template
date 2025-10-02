import { PlaceholderImageProps } from "rkitech-components";
import { ParentNode } from "../../../shared/types/rendererTypes.js";

export type BlogPost = {
  postID: string;
  postTitle: string;
  postAuthor: string;
  postCategory: string;
  postExcerpt: string;
  postBody: ParentNode;
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

export interface NewBlogPostOptions {
  postTitle?: string;
  postAuthor?: string;
  postCategory?: string;
  postExcerpt?: string;
  postBody: ParentNode;
  postDate?: string;
  postImage?: PlaceholderImageProps;
  skipPrompts?: boolean;
}

export interface EditBlogPostOptions {
  postID?: string;
  postTitle?: string;
  postAuthor?: string;
  postCategory?: string;
  postExcerpt?: string;
  postBody: ParentNode;
  postDate?: string;
  postImage?: PlaceholderImageProps;
  skipPrompts?: boolean;
}

export interface DeleteBlogPostOptions {
  postID?: string;
  skipPrompts?: boolean;
}