import chalk from "chalk";

export function showSuccess(message: string): void {
  console.log(chalk.green(`✓ ${message}`));
}

export function showError(message: string): void {
  console.log(chalk.red(`✗ ${message}`));
}

export function showInfo(message: string): void {
  console.log(chalk.blue(`ℹ ${message}`));
}

export function showWarning(message: string): void {
  console.log(chalk.yellow(`⚠ ${message}`));
}

export function showSection(title: string): void {
  console.log("\n" + chalk.bold.cyan(`═══ ${title} ═══`) + "\n");
}