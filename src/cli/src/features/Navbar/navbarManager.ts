import inquirer from "inquirer";

export async function navbarManager() {
  const { navbarAction } = await inquirer.prompt([
    {
      type: "list",
      name: "navbarAction",
      message: "Navbar Menu - choose an action",
      choices: [
        "Add Navbar Item",
        "Edit Navbar Item",
        "Delete Navbar Item",
        "Back to Main Menu"
      ]
    }
  ]);

  switch (navbarAction) {
    case "Add Navbar Item":
      console.log("Adding navbar item...");
      break;
    case "Edit Navbar Item":
      console.log("Editing navbar item...");
      break;
    case "Delete Navbar Item":
      console.log("Deleting navbar item...");
      break;
    case "Back to Main Menu":
      return;
  }

  await navbarManager();
}
