import React, { useEffect, useRef } from "react";
import { Image, tailwindToHex } from "rkitech-components";
import trianglify from "trianglify";
import type { PlaceholderImageProps } from "./placeholderImageTypes";

const PlaceholderImage: React.FC<PlaceholderImageProps> = ({
  src = "",
  width,
  height,
  cellSize = 75,
  variance = 0.5,
  xColors = [],
  yColors = [],
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const clampedCellSize = Math.min(Math.max(cellSize, 10), 100);
  const clampedVariance = Math.min(Math.max(variance, 0.1), 1);

  const hexedXColors: string[] = xColors.map(c => 
    tailwindToHex(c.color, c.intensity)
  );
  
  const hexedYColors: string[] = yColors.map(c => 
    tailwindToHex(c.color, c.intensity)
  );

  const getActualDimensions = (): { width: number; height: number } => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      return {
        width: rect.width || 300,
        height: rect.height || 300
      };
    }
    
    return {
      width: typeof width === 'number' ? width : (width.includes('%') ? 300 : parseInt(width) || 300),
      height: typeof height === 'number' ? height : (height.includes('%') ? 300 : parseInt(height) || 300)
    };
  };

  useEffect(() => {
    if (!src && canvasRef.current && hexedXColors.length > 0 && hexedYColors.length > 0) {
      const canvas = canvasRef.current;
      const dimensions = getActualDimensions();
      
      const pattern = trianglify({
        width: dimensions.width,
        height: dimensions.height,
        cellSize: clampedCellSize,
        variance: clampedVariance,
        xColors: hexedXColors,
        yColors: hexedYColors,
      });
      
      canvas.width = dimensions.width;
      canvas.height = dimensions.height;
      pattern.toCanvas(canvas);
    }
  });

  useEffect(() => {
    if (!src && containerRef.current) {
      const resizeObserver = new ResizeObserver(() => {
        if (canvasRef.current && hexedXColors.length > 0 && hexedYColors.length > 0) {
          const canvas = canvasRef.current;
          const dimensions = getActualDimensions();
          
          const pattern = trianglify({
            width: dimensions.width,
            height: dimensions.height,
            cellSize: clampedCellSize,
            variance: clampedVariance,
            xColors: hexedXColors,
            yColors: hexedYColors,
          });
          
          canvas.width = dimensions.width;
          canvas.height = dimensions.height;
          pattern.toCanvas(canvas);
        }
      });

      resizeObserver.observe(containerRef.current);
      
      return () => resizeObserver.disconnect();
    }
  }, [src, clampedCellSize, clampedVariance, hexedXColors, hexedYColors]);

  const dimensionStyle = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div ref={containerRef} style={dimensionStyle}>
      {src ? (
        <Image 
          src={src} 
          width={width} 
          height={height}
          style={dimensionStyle}
        />
      ) : (
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: '100%', display: 'block' }}
        />
      )}
    </div>
  );
};

export default PlaceholderImage;