import type { ModuleContext } from "./types.js";

export class NavigationStack {
  private stack: (() => Promise<void>)[] = [];

  push(handler: () => Promise<void>): void {
    this.stack.push(handler);
  }

  pop(): (() => Promise<void>) | undefined {
    return this.stack.pop();
  }

  clear(): void {
    this.stack = [];
  }

  get size(): number {
    return this.stack.length;
  }
}

export const navigationStack = new NavigationStack();

export function createModuleContext(
  onBack: () => Promise<void>,
  onMain: () => Promise<void>
): ModuleContext {
  return {
    navigateBack: onBack,
    navigateToMain: onMain,
  };
}