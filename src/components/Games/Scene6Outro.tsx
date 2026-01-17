import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export const Scene6Outro: React.FC = () => {
  return (
    <motion.div
      className="absolute inset-0 z-50 flex items-center justify-center bg-white overflow-hidden"
      initial={{ backgroundColor: '#fff' }}
      animate={{ backgroundColor: '#000' }}
      transition={{ delay: 1.0, duration: 1.5 }}
    >
      {/* Falling Confetti Background - "Incorporated Final" */}
      <div className="absolute inset-0 pointer-events-none">
          {[...Array(30)].map((_, i) => (
             <motion.div 
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{ 
                    left: `${Math.random() * 100}%`, 
                    backgroundColor: ['#fff', '#facc15', '#22d3ee', '#c084fc'][i % 4] 
                }}
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: '100vh', opacity: [0, 1, 0] }}
                transition={{ 
                    duration: 2 + Math.random() * 2, 
                    delay: 1.0 + Math.random(), 
                    repeat: Infinity, 
                    ease: "linear" 
                }}
             />
          ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: [0, 1, 1, 0], scale: 1 }}
        transition={{ 
            times: [0, 0.2, 0.8, 1],
            duration: 2.5 
        }}
        className="relative flex flex-col items-center text-center p-4 z-10"
      >
        {/* Star Flare Decoration */}
        <motion.div 
            className="absolute -top-10"
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: [0, 1.5, 0], rotate: 180 }}
            transition={{ delay: 1.2, duration: 1 }}
        >
            <Star className="w-16 h-16 text-yellow-300 fill-yellow-100 drop-shadow-[0_0_25px_rgba(253,224,71,0.8)]" />
        </motion.div>

        <h2 className="text-3xl md:text-5xl font-['Orbitron'] font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 drop-shadow-[0_0_15px_rgba(255,255,255,0.6)] mb-2">
            WilexGameStation
        </h2>
        
        <div className="h-[1px] w-full max-w-md bg-gradient-to-r from-transparent via-cyan-500 to-transparent my-4 shadow-[0_0_10px_#22d3ee]" />

        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <span className="font-['Share_Tech_Mono'] text-xl md:text-2xl text-purple-400 tracking-widest font-bold animate-pulse">
                RETRO POWER
            </span>
            <span className="hidden md:block text-gray-500">•</span>
            <span className="font-['Share_Tech_Mono'] text-xl md:text-2xl text-cyan-400 tracking-widest font-bold animate-pulse drop-shadow-[0_0_5px_#22d3ee]" style={{ animationDelay: '0.2s' }}>
                NEXT LEVEL
            </span>
        </div>
      </motion.div>
    </motion.div>
  );
};
