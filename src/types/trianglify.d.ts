// src/trianglify.d.ts
declare module 'trianglify' {
  interface TrianglifyOptions {
    width?: number;
    height?: number;
    cellSize?: number;
    variance?: number;
    seed?: string | number | null;
    xColors?: string[];
    yColors?: string[];
    colorSpace?: string;
    strokeWidth?: number;
    fill?: boolean;
  }

  interface TrianglifyPattern {
    toCanvas(canvas: HTMLCanvasElement): void;
    toSVG(): string;
    toSVGTree(): any;
  }

  function trianglify(options?: TrianglifyOptions): TrianglifyPattern;

  export = trianglify;
}