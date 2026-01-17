import React from 'react';
import { motion } from 'framer-motion';

export const Scene1Balance: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(20px)' }}
      className="absolute inset-0 flex items-center justify-center bg-black"
    >
      {/* Subliminal Background Patterns */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <motion.div 
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: 1.2, opacity: [0, 0.5, 0] }}
           transition={{ duration: 1, repeat: 1 }}
           className="text-[20vw] font-bold text-cyan-900 tracking-tighter select-none"
        >
          W.A.I.G.
        </motion.div>
      </div>

      {/* The Scales Geometry */}
      <div className="relative w-64 h-64">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]">
          {/* Base */}
          <motion.path
            d="M 20 90 L 80 90"
            fill="transparent"
            stroke="#22d3ee"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
           {/* Center Pillar */}
          <motion.path
            d="M 50 90 L 50 20"
            fill="transparent"
            stroke="#22d3ee"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
          />
          {/* Arms */}
          <motion.path
            d="M 20 40 L 80 40"
            fill="transparent"
            stroke="#c084fc"
            strokeWidth="2"
            initial={{ pathLength: 0, rotate: -10, scale: 0 }}
            animate={{ pathLength: 1, rotate: 0, scale: 1 }}
            style={{ originX: '50%', originY: '40%' }} // Transform origin for balance effect
            transition={{ delay: 0.6, duration: 0.6, type: "spring" }}
          />
          {/* Scales Plates */}
          <motion.circle 
            cx="20" cy="55" r="8" 
            stroke="#c084fc" strokeWidth="1" fill="transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          />
          <motion.circle 
            cx="80" cy="55" r="8" 
            stroke="#c084fc" strokeWidth="1" fill="transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          />
        </svg>
      </div>
      
      {/* Glitch Overlay Text */}
      <motion.div
        className="absolute bottom-10 text-cyan-500 font-mono text-xs tracking-[1em] opacity-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.5, 0] }}
        transition={{ duration: 0.2, repeat: 3, repeatDelay: 0.3 }}
      >
        JUSTICE_SYSTEM_INIT
      </motion.div>
    </motion.div>
  );
};