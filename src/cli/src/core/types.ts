export interface MenuItem {
  name: string;
  value: string;
  description?: string;
}

export interface ModuleContext {
  navigateBack: () => Promise<void>;
  navigateToMain: () => Promise<void>;
}

export type ModuleHandler = (context: ModuleContext) => Promise<void>;