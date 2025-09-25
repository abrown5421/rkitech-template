import inquirer from "inquirer";
import { initBlog } from "./commands/initBlog.js";
import { newBlogPost } from "./commands/newBlogPost.js";
import { editBlogPost } from "./commands/editBlogPost.js";
import { deleteBlogPost } from "./commands/deleteBlogPost.js";

export async function blogManager() {
    const { blogAction } = await inquirer.prompt([
    {
      type: "list",
      name: "blogAction",
      message: "Blog Menu - choose an action",
      choices: [
        "Manage Blog",
        "Manage Blog Posts",
        "Back to Main Menu"
      ]
    }
  ]);

  switch (blogAction) {
    case "Manage Blog":
      await initBlog('manage');
      break;
    case "Manage Blog Posts":
      const { blogPostAction } = await inquirer.prompt([
        {
          type: "list",
          name: "blogPostAction", 
          message: "Blog Post - choose an action",
          choices: [
            "Add Blog Post",
            "Edit Blog Post",
            "Delete Blog Post",
            "Back to Main Menu"
          ]
        }
      ]);

      switch (blogPostAction) {
        case "Add Blog Post":
          await newBlogPost();
          break;
        case "Edit Blog Post":
          await editBlogPost();
          break;
        case "Delete Blog Post":
          await deleteBlogPost();
          break;
        case "Back to Main Menu":
          break;
      }
      break;
    case "Back to Main Menu":
      return;
  }

  await blogManager();
}