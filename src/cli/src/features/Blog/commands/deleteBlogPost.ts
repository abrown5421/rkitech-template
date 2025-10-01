import { select, confirm } from '@inquirer/prompts';
import fs from 'fs/promises';
import path from 'path';
import prettier from 'prettier';
import { BlogConfig, DeleteBlogPostOptions } from '../types/blogTypes.js';

export async function deleteBlogPost(options?: DeleteBlogPostOptions): Promise<boolean> {
  const {
    postID: optPostID,
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
    return false;
  }

  let blog: BlogConfig;
  try {
    const blogRaw = await fs.readFile(blogJsonPath, 'utf-8');
    blog = JSON.parse(blogRaw);
  } catch (error) {
    console.error('❌ Error reading or parsing blog.json:', error);
    return false;
  }

  if (!blog.blogActive) {
    console.error('❌ Blog is not active. Please initialize the blog first.');
    return false;
  }

  if (blog.blogPosts.length === 0) {
    console.log('❌ No blog posts found to delete.');
    return false;
  }

  const postToDelete = skipPrompts && optPostID ? optPostID : await select({
    message: 'Select a blog post to delete:',
    choices: blog.blogPosts.map((post) => ({
      name: `${post.postTitle} - ${post.postCategory} (${post.postDate})`,
      value: post.postID,
    })),
  });

  const selectedPost = blog.blogPosts.find((p) => p.postID === postToDelete);
  if (!selectedPost) {
    console.error('❌ Selected post not found.');
    return false;
  }

  const confirmDelete = skipPrompts ? true : await confirm({
    message: `Are you sure you want to delete "${selectedPost.postTitle}"? This action cannot be undone.`,
    default: false,
  });

  if (!confirmDelete) {
    console.log('❌ Deletion cancelled.');
    return false;
  }

  const postTitle = selectedPost.postTitle;
  
  blog.blogPosts = blog.blogPosts.filter((p) => p.postID !== postToDelete);

  try {
    const formattedBlog = await prettier.format(JSON.stringify(blog), {
      parser: 'json',
    });
    await fs.writeFile(blogJsonPath, formattedBlog, 'utf-8');
    console.log(`✅ Blog post "${postTitle}" deleted successfully!`);
  } catch (error) {
    console.error('❌ Error writing to blog.json:', error);
    return false;
  }

  return true;
}