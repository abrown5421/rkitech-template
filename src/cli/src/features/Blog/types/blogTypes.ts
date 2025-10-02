import { PlaceholderImageProps } from "rkitech-components";

export interface BaseNode {
  type: string;
  tailwindClasses?: string;
  animationObject?: any;
  style?: React.CSSProperties;
  stateId?: string; 
  [key: string]: any;
}

export interface ParentNode extends BaseNode {
  children?: ParentNode[] | string | number;
}

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