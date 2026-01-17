
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { playRetroSound } from '../utils/audio';

const MicroSceneJump = () => {
    useEffect(() => { playRetroSound('JUMP'); }, []);
    return (
        <motion.div 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: [20, -40, 20], opacity: [0, 1, 0] }} 
            transition={{ duration: 0.6 }}
            className="absolute flex flex-col items-center"
        >
            <div className="w-8 h-8 bg-red-500 rounded-sm shadow-[0_0_10px_red]" /> {/* Mario-ish Cube */}
            <div className="mt-10 w-16 h-4 bg-yellow-500 border-2 border-yellow-200" /> {/* Ground/Block */}
        </motion.div>
    )
}

const MicroSceneBreak = () => {
    useEffect(() => { playRetroSound('EXPLOSION'); }, []);
    return (
        <motion.div 
            initial={{ scale: 0.5, opacity: 0 }} 
            animate={{ scale: 1.5, opacity: [0, 1, 0] }} 
            transition={{ duration: 0.6 }}
            className="absolute"
        >
            <div className="grid grid-cols-5 gap-1 mb-4">
                 {[...Array(5)].map((_,i) => <div key={i} className="w-4 h-2 bg-purple-500" />)}
            </div>
            <motion.div 
                className="w-2 h-2 bg-white rounded-full mx-auto" 
                animate={{ y: -20 }} transition={{ duration: 0.3 }}
            />
        </motion.div>
    )
}

const MicroScenePac = () => {
    useEffect(() => { playRetroSound('WAKA'); }, []);
    return (
        <motion.div 
            initial={{ x: -50, opacity: 0 }} 
            animate={{ x: 50, opacity: [0, 1, 0] }} 
            transition={{ duration: 0.6 }}
            className="absolute flex items-center gap-2"
        >
            <div className="w-8 h-8 bg-yellow-400 rounded-full" style={{ clipPath: 'polygon(100% 0, 100% 100%, 50% 50%, 0 50%, 0 0)'}} />
            <div className="w-2 h-2 bg-white rounded-full" />
            <div className="w-2 h-2 bg-white rounded-full" />
        </motion.div>
    )
}

export const Scene5Entry: React.FC = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
      
      {/* RGB Portal Ring */}
      <motion.div
        initial={{ scale: 0, rotate: 0, opacity: 0 }}
        animate={{ scale: 25, rotate: 180, opacity: 1 }}
        transition={{ duration: 2.0, ease: "circIn" }}
        className="absolute w-[200px] h-[200px] rounded-full border-[20px] border-white"
        style={{
            background: 'conic-gradient(from 0deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
            filter: 'blur(20px)',
            opacity: 0.8
        }}
      />
      
      {/* Inner Void that sucks player in */}
      <motion.div
        className="absolute w-[180px] h-[180px] bg-black rounded-full flex items-center justify-center overflow-hidden z-10"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1, 25] }}
        transition={{ times: [0, 0.2, 1], duration: 2.2, delay: 0.1 }}
      >
           {/* Brief flashes of gameplay history inside the portal */}
           <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute inset-0 bg-blue-900/50 mix-blend-overlay" />
                
                {/* Sequenced Micro Animations */}
                <motion.div className="absolute" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.1 }}>
                    <MicroSceneJump />
                </motion.div>
                
                <motion.div className="absolute" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.1 }}>
                    <MicroSceneBreak />
                </motion.div>

                <motion.div className="absolute" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3, duration: 0.1 }}>
                    <MicroScenePac />
                </motion.div>

                {/* Stars rushing past */}
                {[...Array(10)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white"
                        initial={{ x: 0, y: 0, opacity: 0 }}
                        animate={{ 
                            x: (Math.random() - 0.5) * 400, 
                            y: (Math.random() - 0.5) * 400, 
                            opacity: [1, 0] 
                        }}
                        transition={{ duration: 0.5, delay: 1.5 + (i * 0.05), repeat: Infinity }}
                    />
                ))}
           </div>
      </motion.div>

      {/* Final Flash White */}
      <motion.div
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ delay: 2.2, duration: 0.5 }}
         className="absolute inset-0 bg-white z-50"
      />

    </div>
  );
};
