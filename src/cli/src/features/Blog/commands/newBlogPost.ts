import { input, select, number } from '@inquirer/prompts';
import fs from 'fs/promises';
import path from 'path';
import prettier from 'prettier';
import { BlogConfig, NewBlogPostOptions } from '../types/blogTypes.js';
import { createGUID } from '../../../shared/utils/createGUID.js';
import { PlaceholderImageProps } from 'rkitech-components';

export async function newBlogPost(options?: NewBlogPostOptions): Promise<string | undefined> {
  const {
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

  const postTitle = skipPrompts && optTitle ? optTitle : await input({
    message: 'Enter the post title:',
    validate: (input: string) => {
      if (!input) return 'Post title is required';
      if (blog.blogPosts.some((p) => p.postTitle === input)) {
        return 'Post title already exists';
      }
      return true;
    },
  });

  const postAuthor = skipPrompts && optAuthor ? optAuthor : await input({
    message: 'Enter the post author:',
    default: 'Rkitech Blog',
  });

  const postCategory = skipPrompts && optCategory ? optCategory : await select({
    message: 'Select the post category:',
    choices: blog.blogCategories.map((cat) => ({ name: cat, value: cat })),
  });

  const postExcerpt = skipPrompts && optExcerpt ? optExcerpt : await input({
    message: 'Enter a brief excerpt for the post:',
    validate: (input: string) => {
      if (!input) return 'Post excerpt is required';
      return true;
    },
  });

  const postBody = skipPrompts && optBody ? optBody : {
    "type": "Container",
    "tailwindClasses": "flex-col w-full gap-4",
    "children": [
      {
        "type": "Text",
        "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      },
      {
        "type": "Text",
        "text": "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"
      }
    ]
  };

  const postDate = skipPrompts && optDate ? optDate : await input({
    message: 'Enter the post date (YYYY-MM-DD):',
    default: new Date().toISOString().split('T')[0],
    validate: (input: string) => {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(input)) return 'Date must be in YYYY-MM-DD format';
      const date = new Date(input);
      if (isNaN(date.getTime())) return 'Invalid date';
      return true;
    },
  });

  let postImage: PlaceholderImageProps;
  
  if (skipPrompts && optImage) {
    postImage = optImage;
  } else {
    const cellSize = await number({
      message: 'Enter the placeholder image cell size:',
      default: 28,
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
        default: 0.5,
        step: 0.01, 
        validate: (input) => {
            const value = Number(input);
            if (isNaN(value)) return 'Please enter a valid number.';
            if (value < 0.1 || value > 1) return 'Variance must be between 0.1 and 1.';
            return true;
        },
    });

    postImage = {
      src: '',
      width: "100%",
      height: "150px",
      cellSize: cellSize as number,
      variance: variance as number,
      xColors: [
        { color: 'gray', intensity: 900 },
        { color: 'yellow', intensity: 700 }
      ],
      yColors: [
        { color: 'amber', intensity: 600 },
        { color: 'orange', intensity: 600 }
      ]
    };
  }

  const newPost = {
    postID: createGUID(),
    postTitle,
    postAuthor,
    postCategory,
    postExcerpt,
    postBody,
    postDate,
    postImage
  };

  blog.blogPosts.push(newPost);

  try {
    const formattedBlog = await prettier.format(JSON.stringify(blog), {
      parser: 'json',
    });
    await fs.writeFile(blogJsonPath, formattedBlog, 'utf-8');
    console.log(`✅ Blog post "${newPost.postTitle}" added successfully!`);
  } catch (error) {
    console.error('❌ Error writing to blog.json:', error);
    return undefined;
  }

  return newPost.postID;
}