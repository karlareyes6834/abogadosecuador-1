/**
 * Cursor Glow Effect - Efecto de resplandor que sigue al cursor
 */

import React, { useEffect, useState } from 'react';

const CursorGlow: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', updateMousePosition);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <>
      {/* Glow principal */}
      <div
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
        style={{
          opacity: isVisible ? 1 : 0,
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.15), transparent 40%)`,
        }}
      />
      
      {/* Glow secundario más pequeño */}
      <div
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-200"
        style={{
          opacity: isVisible ? 1 : 0,
          background: `radial-gradient(300px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(168, 85, 247, 0.1), transparent 40%)`,
        }}
      />

      {/* Punto de cursor personalizado (opcional) */}
      <div
        className="pointer-events-none fixed z-50 w-4 h-4 -ml-2 -mt-2 rounded-full border-2 border-blue-500/50 transition-transform duration-100"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          opacity: isVisible ? 1 : 0,
        }}
      >
        <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
      </div>
    </>
  );
};

export default CursorGlow;
