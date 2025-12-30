import React, { useState, useEffect } from 'react';

// Paleta base (pueden ser colores fuertes, la capa blanca los suavizará)
const PALETTE = [
  '#E8E6D9', '#F2EFE5', '#EBDCE1', '#D9E4DD', '#CEDFE6', '#F5E6CA'
];

const SHAPE_TYPES = ['circle', 'ellipse', 'wide-ellipse', 'tall-ellipse', 'rectangle', 'rounded-rectangle', 'square', 'semicircle-top', 'semicircle-bottom', 'quarter-tl', 'quarter-tr', 'quarter-bl', 'quarter-br'];

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

const BackgroundImages: React.FC = () => {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lógica simple para evitar superposición (Bounding Box)
  const checkCollision = (newShape: Shape, existingShapes: Shape[]): boolean => {
    const padding = 10; // Más espacio entre formas
    return existingShapes.some(existing => {
      return !(
        newShape.left + newShape.width + padding < existing.left ||
        existing.left + existing.width + padding < newShape.left ||
        newShape.top + newShape.height + padding < existing.top ||
        existing.top + existing.height + padding < newShape.top
      );
    });
  };

  useEffect(() => {
    if (windowSize.width === 0) return;

    const generatedShapes: Shape[] = [];
    const shapeCount = 19; 
    
    let attempts = 0;
    while (generatedShapes.length < shapeCount && attempts < 2000) {
      attempts++;
      const type = SHAPE_TYPES[Math.floor(Math.random() * SHAPE_TYPES.length)];
      const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];

      const width = 235.79;
      const height = 324.64;
      let borderRadius = '0px';

      if (type === 'circle') {
        borderRadius = '50%';
      } else if (type === 'ellipse') {
        borderRadius = '50%';
      } else if (type === 'wide-ellipse') {
        borderRadius = '50%';
      } else if (type === 'tall-ellipse') {
        borderRadius = '50%';
      } else if (type === 'rectangle') {
        borderRadius = '0px';
      } else if (type === 'square') {
        borderRadius = '0px';
      } else if (type === 'rounded-rectangle') {
        borderRadius = '20px';
      } else if (type === 'semicircle-top') {
        borderRadius = '50% 50% 0 0';
      } else if (type === 'semicircle-bottom') {
        borderRadius = '0 0 50% 50%';
      } else if (type === 'quarter-tl') {
        borderRadius = '50% 0 0 0';
      } else if (type === 'quarter-tr') {
        borderRadius = '0 50% 0 0';
      } else if (type === 'quarter-bl') {
        borderRadius = '0 0 0 50%';
      } else if (type === 'quarter-br') {
        borderRadius = '0 0 50% 0';
      }

      const left = Math.floor(Math.random() * (windowSize.width - width));
      const top = Math.floor(Math.random() * (windowSize.height - height));

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
  }, [windowSize]);

  return (
    <div style={{
        position: 'fixed',
        top: 0, left: 0, width: '100vw', height: '100vh',
        zIndex: -1,
        background: '#f0f0f0ff', // Fondo base gris muy claro
        overflow: 'hidden',
    }}>
      
      {/* 1. CAPA DE FORMAS */}
      {shapes.map((shape) => (
        <div
          key={shape.id}
          style={{
            position: 'absolute',
            width: `${shape.width}px`,
            height: `${shape.height}px`,
            left: `${shape.left}px`,
            top: `${shape.top}px`,
            backgroundColor: shape.background,
            borderRadius: shape.borderRadius,
          }}
        />
      ))}

      {/* 2. CAPA OVERLAY (La magia ocurre aquí) */}
      <div 
        style={{
            position: 'absolute',
            inset: 0, // Ocupa toda la pantalla
            
            // A: COLOR BLANCO SEMI-TRANSPARENTE
            // Ajusta el 0.6 (60%) hacia arriba para que sea más blanco, o hacia abajo para ver más color.
            backgroundColor: 'rgba(255, 255, 255, 0)', 
            
            // B: DESENFOQUE (Opcional)
            // Esto crea el efecto "vidrio esmerilado" que difumina los bordes de las formas
            backdropFilter: 'blur(1px)', 
            
            zIndex: 1 // Se asegura de estar encima de las formas
        }}
      />
    </div>
  );
};

export default BackgroundImages;
