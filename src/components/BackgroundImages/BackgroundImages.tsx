import React, { useState, useEffect, useRef } from "react";
import "./BackgroundImages.css";

// Paleta base (pueden ser colores fuertes, la capa blanca los suavizará)
const PALETTE = [
  "#E8E6D9",
  "#F2EFE5",
  "#EBDCE1",
  "#D9E4DD",
  "#CEDFE6",
  "#F5E6CA",
];

const SHAPE_TYPES = [
  "circle",
  "ellipse",
  "wide-ellipse",
  "tall-ellipse",
  "rectangle",
  "rounded-rectangle",
  "square",
  "semicircle-top",
  "semicircle-bottom",
  "quarter-tl",
  "quarter-tr",
  "quarter-bl",
  "quarter-br",
];

interface Shape {
  id: string;
  type: string;
  width: number;
  height: number;
  left: number;
  top: number;
  background: string;
  borderRadius: string;
} 

interface BackgroundImagesProps {
  applyBlur?: boolean;
  applyOverlay?: boolean;
  backgroundColor?: string;
  colorPalette?: string[];
}

const BackgroundImages: React.FC<BackgroundImagesProps> = ({
  applyBlur = true,
  applyOverlay = true,
  backgroundColor = "#f0f0f0ff",
  colorPalette = PALETTE,
}) => {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setContainerSize({ width: clientWidth, height: clientHeight });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    // Add a ResizeObserver to detect container size changes more reliably
    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("resize", updateSize);
      resizeObserver.disconnect();
    };
  }, []);

  // Lógica simple para evitar superposición (Bounding Box)
  const checkCollision = (
    newShape: Shape,
    existingShapes: Shape[]
  ): boolean => {
    const padding = -15; // Permitir solapamiento para que quepan más formas en espacios pequeños
    return existingShapes.some((existing) => {
      return !(
        newShape.left + newShape.width + padding < existing.left ||
        existing.left + existing.width + padding < newShape.left ||
        newShape.top + newShape.height + padding < existing.top ||
        existing.top + existing.height + padding < newShape.top
      );
    });
  };

  useEffect(() => {
    if (containerSize.width === 0 || containerSize.height === 0) return;

    const generatedShapes: Shape[] = [];
    const shapeCount = 19; // Reduced count for smaller spaces

    let attempts = 0;

    // Scale down shapes significantly to fit in small headers
    // Using a base scale relative to 1920x1080 (standard desktop) or just smaller fixed sizes
    // Let's use smaller fixed sizes for valid "pattern" look
    const scaleFactor =
      Math.min(containerSize.width, containerSize.height) / 800; // auto-scale based on container size
    const baseScale = Math.max(0.12, scaleFactor); // Escala más pequeña para encabezados

    while (generatedShapes.length < shapeCount && attempts < 2000) {
      attempts++;
      const type = SHAPE_TYPES[Math.floor(Math.random() * SHAPE_TYPES.length)];
      const color =
        colorPalette[Math.floor(Math.random() * colorPalette.length)];

      // Much smaller base size for header usage
      const width = 235.79 * baseScale;
      const height = 324.64 * baseScale;

      let borderRadius = "0px";

      if (type === "circle") {
        borderRadius = "50%";
      } else if (type === "ellipse") {
        borderRadius = "50%";
      } else if (type === "wide-ellipse") {
        borderRadius = "50%";
      } else if (type === "tall-ellipse") {
        borderRadius = "50%";
      } else if (type === "rectangle") {
        borderRadius = "0px";
      } else if (type === "square") {
        borderRadius = "0px";
      } else if (type === "rounded-rectangle") {
        borderRadius = "20px";
      } else if (type === "semicircle-top") {
        borderRadius = "50% 50% 0 0";
      } else if (type === "semicircle-bottom") {
        borderRadius = "0 0 50% 50%";
      } else if (type === "quarter-tl") {
        borderRadius = "50% 0 0 0";
      } else if (type === "quarter-tr") {
        borderRadius = "0 50% 0 0";
      } else if (type === "quarter-bl") {
        borderRadius = "0 0 0 50%";
      } else if (type === "quarter-br") {
        borderRadius = "0 0 50% 0";
      }

      const left = Math.floor(Math.random() * (containerSize.width - width));
      const top = Math.floor(Math.random() * (containerSize.height - height));

      const newShape: Shape = {
        id: `shape-${attempts}`,
        type,
        width,
        height,
        left,
        top,
        background: color,
        borderRadius,
      }; 

      if (!checkCollision(newShape, generatedShapes)) {
        generatedShapes.push(newShape);
      }
    }
     
    // Avoid synchronous state updates directly inside effect to prevent cascading renders
    requestAnimationFrame(() => setShapes(generatedShapes));
  }, [containerSize, colorPalette]);
  // Generate a dynamic class for the container background color (no inline styles)
  const bgClassName = React.useMemo(() => {
    if (!backgroundColor) return null;
    const hash = Array.from(backgroundColor).reduce((acc, c) => acc * 31 + c.charCodeAt(0), 0);
    return `bg-images-bg-${Math.abs(hash)}`;
  }, [backgroundColor]);

  const bgStyleIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!bgClassName) return undefined;
    const styleId = `style-${bgClassName}`;
    bgStyleIdRef.current = styleId;

    if (!document.getElementById(styleId)) {
      const styleEl = document.createElement("style");
      styleEl.id = styleId;
      styleEl.textContent = `.${bgClassName} { background-color: ${backgroundColor}; }`;
      document.head.appendChild(styleEl);

      return () => {
        const el = document.getElementById(styleId);
        if (el) el.remove();
      };
    }

    return undefined;
  }, [bgClassName, backgroundColor]);

  return (
    <div ref={containerRef} className={`background-images-container ${bgClassName || ""}`}>
      {/* 1. CAPA DE FORMAS - renderizado SVG (evita estilos inline) */}
      {containerSize.width > 0 && containerSize.height > 0 && (
        <svg
          className="background-shapes-svg"
          width={containerSize.width}
          height={containerSize.height}
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          {shapes.map((shape) => {
            const cx = shape.left + shape.width / 2;
            const cy = shape.top + shape.height / 2;

            switch (shape.type) {
              case "circle":
                return (
                  <g key={shape.id}>
                    <circle cx={cx} cy={cy} r={Math.min(shape.width, shape.height) / 2} fill={shape.background} />
                  </g>
                );
              case "ellipse":
              case "wide-ellipse":
              case "tall-ellipse":
                return (
                  <g key={shape.id}>
                    <ellipse cx={cx} cy={cy} rx={shape.width / 2} ry={shape.height / 2} fill={shape.background} />
                  </g>
                );
              case "rounded-rectangle":
                return (
                  <g key={shape.id}>
                    <rect x={shape.left} y={shape.top} width={shape.width} height={shape.height} rx={Math.min(20, shape.width / 6)} fill={shape.background} />
                  </g>
                );
              case "semicircle-top":
                return (
                  <g key={shape.id}>
                    <path d={`M ${shape.left} ${shape.top + shape.height} A ${shape.width / 2} ${shape.height} 0 0 1 ${shape.left + shape.width} ${shape.top + shape.height} L ${shape.left + shape.width} ${shape.top + shape.height} Z`} fill={shape.background} />
                  </g>
                );
              case "semicircle-bottom":
                return (
                  <g key={shape.id}>
                    <path d={`M ${shape.left} ${shape.top} A ${shape.width / 2} ${shape.height} 0 0 0 ${shape.left + shape.width} ${shape.top} L ${shape.left + shape.width} ${shape.top} Z`} fill={shape.background} />
                  </g>
                );
              default:
                return (
                  <g key={shape.id}>
                    <rect x={shape.left} y={shape.top} width={shape.width} height={shape.height} fill={shape.background} />
                  </g>
                );
            }
          })}
        </svg>
      )}

      {/* 2. CAPA OVERLAY (ahora usando clases CSS) */}
      {(applyBlur || applyOverlay) && (
        <div
          className={`background-overlay ${applyBlur ? "background-overlay--blur" : ""} ${applyOverlay ? "background-overlay--on" : "background-overlay--off"}`}
        />
      )}
    </div>
  );
};

export default BackgroundImages;
