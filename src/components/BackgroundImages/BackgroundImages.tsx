import React, { useState, useEffect, useRef } from "react";

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
  width: number;
  height: number;
  left: number;
  top: number;
  background: string;
  borderRadius: string;
  rotation: number;
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
        width,
        height,
        left,
        top,
        background: color,
        borderRadius,
        rotation: Math.random() * 360,
      };

      if (!checkCollision(newShape, generatedShapes)) {
        generatedShapes.push(newShape);
      }
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShapes(generatedShapes);
  }, [containerSize, colorPalette]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0, // Should be background
        background: backgroundColor, // Fondo base configurable
        overflow: "hidden",
      }}
    >
      {/* 1. CAPA DE FORMAS */}
      {shapes.map((shape) => (
        <div
          key={shape.id}
          style={{
            position: "absolute",
            width: `${shape.width}px`,
            height: `${shape.height}px`,
            left: `${shape.left}px`,
            top: `${shape.top}px`,
            backgroundColor: shape.background,
            borderRadius: shape.borderRadius,
            transformOrigin: "center center",
          }}
        />
      ))}

      {/* 2. CAPA OVERLAY (La magia ocurre aquí) */}
      {(applyBlur || applyOverlay) && (
        <div
          style={{
            position: "absolute",
            inset: 0, // Ocupa toda la pantalla

            // A: COLOR BLANCO SEMI-TRANSPARENTE
            // Ajusta el 0.6 (60%) hacia arriba para que sea más blanco, o hacia abajo para ver más color.
            backgroundColor: applyOverlay
              ? "rgba(255, 255, 255, 0)"
              : "transparent",

            // B: DESENFOQUE (Opcional)
            // Esto crea el efecto "vidrio esmerilado" que difumina los bordes de las formas
            backdropFilter: applyBlur ? "blur(1px)" : "none",

            zIndex: 1, // Se asegura de estar encima de las formas
          }}
        />
      )}
    </div>
  );
};

export default BackgroundImages;
