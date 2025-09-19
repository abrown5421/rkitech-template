import prettier from "prettier";
import fs from "fs/promises";

export async function formatFile(filePath: string) {
  try {
    const content = await fs.readFile(filePath, "utf-8");

    const formatted = await prettier.format(content, {
      parser: "typescript",
      singleQuote: true,
      trailingComma: "all",
      tabWidth: 2,
      printWidth: 100,
    });

    await fs.writeFile(filePath, formatted, { encoding: "utf-8" });

    console.log(`✅ Formatted ${filePath}`);
  } catch (err) {
    console.error(`❌ Error formatting ${filePath}:`, err);
  }
}