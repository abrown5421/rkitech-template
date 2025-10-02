export interface BaseNode {
  type: string;
  tailwindClasses?: string;
  animationObject?: any;
  style?: React.CSSProperties;
  stateId?: string; 
  [key: string]: any;
}

export interface ParentNode extends BaseNode {
  children?: ParentNode[] | string | number;
}