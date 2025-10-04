declare module 'inquirer-file-selector' {
  import type { PromptModule } from 'inquirer';
  export function file(options: {
    message: string;
    root?: string;
    onlyShowDir?: boolean;
    default?: string;
  }): Promise<string | null>;
}
