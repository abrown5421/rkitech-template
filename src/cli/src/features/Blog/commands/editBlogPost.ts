import { input, select, number } from '@inquirer/prompts';
import fs from 'fs/promises';
import path from 'path';
import prettier from 'prettier';
import { BlogConfig, EditBlogPostOptions } from '../types/blogTypes.js';
import { PlaceholderImageProps } from 'rkitech-components';

export async function editBlogPost(options?: EditBlogPostOptions): Promise<string | undefined> {
  const {
    postID: optPostID,
    postTitle: optTitle,
    postAuthor: optAuthor,
    postCategory: optCategory,
    postExcerpt: optExcerpt,
    postBody: optBody,
    postDate: optDate,
    postImage: optImage,
    skipPrompts
  } = options || {};

  const blogJsonPath = path.resolve(
    process.cwd(),
    'src/cli/src/features/Blog/json/blog.json'
  );

  try {
    await fs.access(blogJsonPath);
  } catch (error) {
    console.error(`❌ Could not find blog.json at: ${blogJsonPath}`);
    console.log('Please ensure the blog.json file exists in the correct location.');
    return undefined;
  }

  let blog: BlogConfig;
  try {
    const blogRaw = await fs.readFile(blogJsonPath, 'utf-8');
    blog = JSON.parse(blogRaw);
  } catch (error) {
    console.error('❌ Error reading or parsing blog.json:', error);
    return undefined;
  }

  if (!blog.blogActive) {
    console.error('❌ Blog is not active. Please initialize the blog first.');
    return undefined;
  }

  if (blog.blogPosts.length === 0) {
    console.log('❌ No blog posts found to edit.');
    return undefined;
  }

  const postToEdit = skipPrompts && optPostID ? optPostID : await select({
    message: 'Select a blog post to edit:',
    choices: blog.blogPosts.map((post) => ({
      name: `${post.postTitle} - ${post.postCategory} (${post.postDate})`,
      value: post.postID,
    })),
  });

  const selectedPost = blog.blogPosts.find((p) => p.postID === postToEdit);
  if (!selectedPost) {
    console.error('❌ Selected post not found.');
    return undefined;
  }

  const newPostTitle = skipPrompts && optTitle ? optTitle : await input({
    message: 'Enter the post title:',
    default: selectedPost.postTitle,
    validate: (input: string) => {
      if (!input) return 'Post title is required';
      if (input !== selectedPost.postTitle && blog.blogPosts.some((p) => p.postTitle === input)) {
        return 'Post title already exists';
      }
      return true;
    },
  });

  const newPostAuthor = skipPrompts && optAuthor ? optAuthor : await input({
    message: 'Enter the post author:',
    default: selectedPost.postAuthor,
  });

  const newPostCategory = skipPrompts && optCategory ? optCategory : await select({
    message: 'Select the post category:',
    choices: blog.blogCategories.map((cat) => ({ name: cat, value: cat })),
    default: selectedPost.postCategory,
  });

  const newPostExcerpt = skipPrompts && optExcerpt ? optExcerpt : await input({
    message: 'Enter a brief excerpt for the post:',
    default: selectedPost.postExcerpt,
    validate: (input: string) => {
      if (!input) return 'Post excerpt is required';
      return true;
    },
  });

  const newPostBody = skipPrompts && optBody ? optBody : selectedPost.postBody;

  const newPostDate = skipPrompts && optDate ? optDate : await input({
    message: 'Enter the post date (YYYY-MM-DD):',
    default: selectedPost.postDate,
    validate: (input: string) => {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(input)) return 'Date must be in YYYY-MM-DD format';
      const date = new Date(input);
      if (isNaN(date.getTime())) return 'Invalid date';
      return true;
    },
  });

  let newPostImage: PlaceholderImageProps;

  if (skipPrompts && optImage) {
    newPostImage = optImage;
  } else {
    const cellSize = await number({
      message: 'Enter the placeholder image cell size:',
      default: selectedPost.postImage.cellSize,
      validate: (input) => {
        const value = Number(input);
        if (isNaN(value)) return 'Please enter a valid number.';
        if (!Number.isInteger(value)) return 'Please enter a whole number.';
        if (value <= 0) return 'Cell size must be positive.';
        return true;
      },
    });

    const variance = await number({
        message: 'Enter the placeholder image variance (0.1-1):',
        default: selectedPost.postImage.variance,
        step: 0.01, 
        validate: (input) => {
            const value = Number(input);
            if (isNaN(value)) return 'Please enter a valid number.';
            if (value < 0.1 || value > 1) return 'Variance must be between 0.1 and 1.';
            return true;
        },
    });

    newPostImage = {
      src: selectedPost.postImage.src || '',
      width: "100%",
      height: "150px",
      cellSize: cellSize as number,
      variance: variance as number,
      xColors: selectedPost.postImage.xColors,
      yColors: selectedPost.postImage.yColors
    };
  }

  const updatedPost = {
    ...selectedPost,
    postTitle: newPostTitle,
    postAuthor: newPostAuthor,
    postCategory: newPostCategory,
    postExcerpt: newPostExcerpt,
    postBody: newPostBody,
    postDate: newPostDate,
    postImage: newPostImage
  };

  const postIndex = blog.blogPosts.findIndex((p) => p.postID === postToEdit);
  blog.blogPosts[postIndex] = updatedPost;

  try {
    const formattedBlog = await prettier.format(JSON.stringify(blog), {
      parser: 'json',
    });
    await fs.writeFile(blogJsonPath, formattedBlog, 'utf-8');
    console.log(`✅ Blog post "${updatedPost.postTitle}" updated successfully!`);
  } catch (error) {
    console.error('❌ Error writing to blog.json:', error);
    return undefined;
  }

  return updatedPost.postID;
}