/**
 * Floating Card 3D - Tarjetas con efecto 3D al hover
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface FloatingCard3DProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

const FloatingCard3D: React.FC<FloatingCard3DProps> = ({ 
  children, 
  className = '',
  intensity = 15 
}) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * intensity;
    const rotateY = ((x - centerX) / centerX) * -intensity;
    
    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  return (
    <motion.div
      className={`relative ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: rotation.x,
        rotateY: rotation.y,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2 },
      }}
    >
      <div
        style={{
          transform: 'translateZ(20px)',
        }}
      >
        {children}
      </div>
      
      {/* Glow effect en hover */}
      <motion.div
        className="absolute inset-0 -z-10 opacity-0 rounded-xl blur-xl bg-gradient-to-r from-blue-500/50 to-purple-500/50"
        animate={{
          opacity: rotation.x !== 0 || rotation.y !== 0 ? 0.6 : 0,
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

export default FloatingCard3D;
