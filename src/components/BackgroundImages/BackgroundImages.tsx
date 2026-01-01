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

const FIXED_WIDTH = 1920;
const FIXED_HEIGHT = 1080;

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
  morphProgress?: number; // Para controlar la transición morfo
  targetType?: string; // Tipo objetivo para la transformación
  animationStartTime?: number;
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
  const morphIntervalRef = useRef<number | null>(null);

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
    const generatedShapes: Shape[] = [];
    const shapeCount = 19; // Reduced count for smaller spaces

    let attempts = 0;

    // Scale down shapes significantly to fit in small headers
    // Using a base scale relative to 1920x1080 (standard desktop) or just smaller fixed sizes
    // Let's use smaller fixed sizes for valid "pattern" look
    const scaleFactor =
      Math.min(FIXED_WIDTH, FIXED_HEIGHT) / 800; // auto-scale based on fixed size
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

      const left = Math.floor(Math.random() * (FIXED_WIDTH - width));
      const top = Math.floor(Math.random() * (FIXED_HEIGHT - height));

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
  }, [colorPalette]);

  // Sistema de transformación automática cada 2 segundos
  useEffect(() => {
    const startMorphing = () => {
      morphIntervalRef.current = window.setInterval(() => {
        setShapes(prevShapes => {
          return prevShapes.map(shape => {
            // Elegir un nuevo tipo de forma diferente al actual
            const currentIndex = SHAPE_TYPES.indexOf(shape.type);
            let newTypeIndex;
            do {
              newTypeIndex = Math.floor(Math.random() * SHAPE_TYPES.length);
            } while (newTypeIndex === currentIndex && SHAPE_TYPES.length > 1);

            const newType = SHAPE_TYPES[newTypeIndex];

            // Calcular nuevas dimensiones basadas en el tipo
            let newWidth = shape.width;
            let newHeight = shape.height;

            // Ajustar dimensiones según el nuevo tipo para transiciones más naturales
            if (newType === "circle" || newType.includes("ellipse")) {
              // Mantener área similar pero hacer más circular/elíptico
              const area = newWidth * newHeight;
              if (newType === "wide-ellipse") {
                newWidth = Math.sqrt(area * 1.5);
                newHeight = Math.sqrt(area / 1.5);
              } else if (newType === "tall-ellipse") {
                newHeight = Math.sqrt(area * 1.5);
                newWidth = Math.sqrt(area / 1.5);
              } else {
                // circle or regular ellipse - make more square-like
                const avgSize = Math.sqrt(area);
                newWidth = newHeight = avgSize;
              }
            } else if (newType === "square") {
              // Hacer cuadrado
              const avgSize = (newWidth + newHeight) / 2;
              newWidth = newHeight = avgSize;
            } else if (newType === "rectangle") {
              // Hacer más rectangular
              if (Math.random() > 0.5) {
                newWidth *= 1.3;
                newHeight *= 0.8;
              } else {
                newHeight *= 1.3;
                newWidth *= 0.8;
              }
            }

            return {
              ...shape,
              targetType: newType,
              morphProgress: 0,
              animationStartTime: Date.now(),
            };
          });
        });
      }, 2000); // Cada 2 segundos
    };

    // Iniciar el morphing después de un pequeño delay inicial
    const initialDelay = setTimeout(startMorphing, 1000);

    return () => {
      clearTimeout(initialDelay);
      if (morphIntervalRef.current) {
        clearInterval(morphIntervalRef.current);
      }
    };
  }, []);

  // Animación de morphing usando requestAnimationFrame
  useEffect(() => {
    let animationId: number;

    const animate = () => {
      setShapes(prevShapes => {
        return prevShapes.map(shape => {
          if (shape.targetType && shape.animationStartTime) {
            const elapsed = Date.now() - shape.animationStartTime;
            const duration = 1000; // 1 segundo de transición
            const progress = Math.min(elapsed / duration, 1);

            if (progress >= 1) {
              // Transición completa - cambiar al nuevo tipo
              return {
                ...shape,
                type: shape.targetType,
                targetType: undefined,
                morphProgress: undefined,
                animationStartTime: undefined,
              };
            }

            return {
              ...shape,
              morphProgress: progress,
            };
          }
          return shape;
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);
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

  // Función para interpolar entre dos valores
  const lerp = (start: number, end: number, progress: number): number => {
    return start + (end - start) * progress;
  };

  // Tipos para las propiedades de renderizado
  interface CircleProps {
    type: "circle";
    cx: number;
    cy: number;
    r: number;
  }

  interface EllipseProps {
    type: "ellipse";
    cx: number;
    cy: number;
    rx: number;
    ry: number;
  }

  interface RectProps {
    type: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
    rx: number;
  }

  interface PathProps {
    type: "path";
    d: string;
  }

  type ShapeRenderProps = CircleProps | EllipseProps | RectProps | PathProps;

  // Función para obtener las propiedades de renderizado de una forma
  const getShapeRenderProps = (shape: Shape): ShapeRenderProps => {
    const cx = shape.left + shape.width / 2;
    const cy = shape.top + shape.height / 2;

    switch (shape.type) {
      case "circle":
        return {
          type: "circle",
          cx,
          cy,
          r: Math.min(shape.width, shape.height) / 2,
        };
      case "ellipse":
      case "wide-ellipse":
      case "tall-ellipse":
        return {
          type: "ellipse",
          cx,
          cy,
          rx: shape.width / 2,
          ry: shape.height / 2,
        };
      case "rounded-rectangle":
        return {
          type: "rect",
          x: shape.left,
          y: shape.top,
          width: shape.width,
          height: shape.height,
          rx: Math.min(20, shape.width / 6),
        };
      case "square":
      case "rectangle":
        return {
          type: "rect",
          x: shape.left,
          y: shape.top,
          width: shape.width,
          height: shape.height,
          rx: 0,
        };
      case "semicircle-top":
        return {
          type: "path",
          d: `M ${shape.left} ${shape.top + shape.height} A ${shape.width / 2} ${shape.height} 0 0 1 ${shape.left + shape.width} ${shape.top + shape.height} L ${shape.left + shape.width} ${shape.top + shape.height} Z`,
        };
      case "semicircle-bottom":
        return {
          type: "path",
          d: `M ${shape.left} ${shape.top} A ${shape.width / 2} ${shape.height} 0 0 0 ${shape.left + shape.width} ${shape.top} L ${shape.left + shape.width} ${shape.top} Z`,
        };
      default:
        return {
          type: "rect",
          x: shape.left,
          y: shape.top,
          width: shape.width,
          height: shape.height,
          rx: 0,
        };
    }
  };

  // Función para renderizar una forma con posibles transiciones de morphing
  const renderShape = (shape: Shape) => {
    // Si está en transición de morphing
    if (shape.targetType && shape.morphProgress !== undefined) {
      // Crear forma objetivo temporal para comparación
      const targetShape = {
        ...shape,
        type: shape.targetType,
        width: shape.width,
        height: shape.height,
      };

      const currentProps = getShapeRenderProps(shape);
      const targetProps = getShapeRenderProps(targetShape);
      const progress = shape.morphProgress;

      // Intentar interpolar si ambos son del mismo tipo básico
      if (currentProps.type === targetProps.type) {
        switch (currentProps.type) {
          case "circle": {
            const currentCircle = currentProps as CircleProps;
            const targetCircle = targetProps as CircleProps;
            return (
              <circle
                key={shape.id}
                cx={lerp(currentCircle.cx, targetCircle.cx, progress)}
                cy={lerp(currentCircle.cy, targetCircle.cy, progress)}
                r={lerp(currentCircle.r, targetCircle.r, progress)}
                fill={shape.background}
              />
            );
          }
          case "ellipse": {
            const currentEllipse = currentProps as EllipseProps;
            const targetEllipse = targetProps as EllipseProps;
            return (
              <ellipse
                key={shape.id}
                cx={lerp(currentEllipse.cx, targetEllipse.cx, progress)}
                cy={lerp(currentEllipse.cy, targetEllipse.cy, progress)}
                rx={lerp(currentEllipse.rx, targetEllipse.rx, progress)}
                ry={lerp(currentEllipse.ry, targetEllipse.ry, progress)}
                fill={shape.background}
              />
            );
          }
          case "rect": {
            const currentRect = currentProps as RectProps;
            const targetRect = targetProps as RectProps;
            return (
              <rect
                key={shape.id}
                x={lerp(currentRect.x, targetRect.x, progress)}
                y={lerp(currentRect.y, targetRect.y, progress)}
                width={lerp(currentRect.width, targetRect.width, progress)}
                height={lerp(currentRect.height, targetRect.height, progress)}
                rx={lerp(currentRect.rx, targetRect.rx, progress)}
                fill={shape.background}
              />
            );
          }
        }
      }

      // Si no se puede interpolar, mostrar fade entre formas

      return (
        <g key={shape.id}>
          {/* Forma actual desvaneciéndose */}
          {renderShapeElement(shape, 1 - progress * 2)}
          {/* Forma objetivo apareciendo */}
          {renderShapeElement(targetShape, progress * 2)}
        </g>
      );
    }

    // Renderizado normal
    return renderShapeElement(shape, 1);
  };

  // Función auxiliar para renderizar un elemento de forma con opacidad
  const renderShapeElement = (shape: Shape, opacity: number = 1) => {
    const cx = shape.left + shape.width / 2;
    const cy = shape.top + shape.height / 2;
    const fill = `rgba(${hexToRgb(shape.background)}, ${opacity})`;

    switch (shape.type) {
      case "circle":
        return <circle cx={cx} cy={cy} r={Math.min(shape.width, shape.height) / 2} fill={fill} />;
      case "ellipse":
      case "wide-ellipse":
      case "tall-ellipse":
        return <ellipse cx={cx} cy={cy} rx={shape.width / 2} ry={shape.height / 2} fill={fill} />;
      case "rounded-rectangle":
        return <rect x={shape.left} y={shape.top} width={shape.width} height={shape.height} rx={Math.min(20, shape.width / 6)} fill={fill} />;
      case "semicircle-top":
        return <path d={`M ${shape.left} ${shape.top + shape.height} A ${shape.width / 2} ${shape.height} 0 0 1 ${shape.left + shape.width} ${shape.top + shape.height} L ${shape.left + shape.width} ${shape.top + shape.height} Z`} fill={fill} />;
      case "semicircle-bottom":
        return <path d={`M ${shape.left} ${shape.top} A ${shape.width / 2} ${shape.height} 0 0 0 ${shape.left + shape.width} ${shape.top} L ${shape.left + shape.width} ${shape.top} Z`} fill={fill} />;
      default:
        return <rect x={shape.left} y={shape.top} width={shape.width} height={shape.height} fill={fill} />;
    }
  };

  // Función auxiliar para convertir hex a rgb
  const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return "0,0,0";
    return `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`;
  };

  return (
    <div ref={containerRef} className={`background-images-container ${bgClassName || ""}`}>
      {/* 1. CAPA DE FORMAS - renderizado SVG (evita estilos inline) */}
      {containerSize.width > 0 && containerSize.height > 0 && (
        <svg
          className="background-shapes-svg"
          width={containerSize.width}
          height={containerSize.height}
          viewBox={`0 0 ${FIXED_WIDTH} ${FIXED_HEIGHT}`}
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
        >
          {shapes.map((shape) => (
            <g key={shape.id}>
              {renderShape(shape)}
            </g>
          ))}
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
