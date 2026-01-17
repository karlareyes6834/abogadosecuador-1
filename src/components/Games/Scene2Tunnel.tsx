
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, Disc, Square, Star, Sparkles } from 'lucide-react';
import { playRetroSound } from '../utils/audio';

// --- Sub-components ---

// A single row of bricks moving towards the camera
const BrickRow: React.FC<{ delay: number; zStart: number }> = ({ delay, zStart }) => {
  return (
    <motion.div
      initial={{ z: zStart, opacity: 0 }}
      animate={{ z: [zStart, 600], opacity: [0, 1, 0] }}
      transition={{ 
        duration: 2, 
        repeat: Infinity, 
        delay: delay, 
        ease: "linear" 
      }}
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Floor Bricks (Blue Neon - Underground Theme) */}
      <div className="absolute top-[60%] flex gap-8">
         <div className="w-20 h-10 border-2 border-blue-600 bg-blue-900/30 shadow-[0_0_10px_#2563eb]" />
         <div className="w-20 h-10 border-2 border-blue-600 bg-blue-900/30 shadow-[0_0_10px_#2563eb]" />
         <div className="w-20 h-10 border-2 border-blue-600 bg-blue-900/30 shadow-[0_0_10px_#2563eb]" />
      </div>

      {/* Ceiling Bricks */}
      <div className="absolute bottom-[60%] flex gap-8">
         <div className="w-20 h-10 border-2 border-blue-800 bg-blue-950/30 opacity-50" />
         <div className="w-20 h-10 border-2 border-blue-800 bg-blue-950/30 opacity-50" />
         <div className="w-20 h-10 border-2 border-blue-800 bg-blue-950/30 opacity-50" />
      </div>

      {/* Green Pipe Reference (Side Walls) */}
      <div className="absolute left-[-300px] top-[45%] w-28 h-80 bg-gradient-to-r from-green-900/40 to-green-800/20 border-r-4 border-green-500 shadow-[0_0_20px_#22c55e] -translate-y-1/2 flex flex-col justify-between py-2">
         <div className="w-full h-4 bg-green-500/50 blur-[2px]" />
         <div className="w-full h-4 bg-green-500/50 blur-[2px]" />
      </div>
      <div className="absolute right-[-300px] top-[45%] w-28 h-80 bg-gradient-to-l from-green-900/40 to-green-800/20 border-l-4 border-green-500 shadow-[0_0_20px_#22c55e] -translate-y-1/2 flex flex-col justify-between py-2">
         <div className="w-full h-4 bg-green-500/50 blur-[2px]" />
         <div className="w-full h-4 bg-green-500/50 blur-[2px]" />
      </div>
    </motion.div>
  );
};

// Floating Gold/Metal Blocks
const FloatingPlatform: React.FC<{ delay: number }> = ({ delay }) => {
    return (
        <motion.div
            initial={{ z: -500, opacity: 0, x: 50 }}
            animate={{ z: [ -500, 600], opacity: [0, 1, 0], x: 50 }} // Moving towards camera
            transition={{ duration: 2, repeat: Infinity, delay: delay, ease: "linear" }}
            className="absolute flex gap-2 items-center justify-center"
            style={{ transformStyle: 'preserve-3d', top: '45%' }}
        >
            {/* Standard Golden Brick */}
            <div className="w-16 h-16 border-4 border-amber-600 bg-amber-800/60 shadow-[0_0_15px_#d97706] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_40%,rgba(255,255,255,0.4)_50%,transparent_60%)] animate-pulse" />
                <div className="w-14 h-1 border-t border-black/50 mt-1"></div>
                <div className="w-14 h-1 border-b border-black/50 mt-8"></div>
            </div>
            
            {/* Golden Mystery Block (Incognita Dorada) - Enhanced */}
            <div className="relative w-16 h-16">
                 <div className="absolute inset-0 border-4 border-yellow-300 bg-yellow-500 shadow-[0_0_30px_#facc15] flex items-center justify-center z-10 animate-pulse">
                    <HelpCircle className="text-yellow-900 w-10 h-10 font-bold" strokeWidth={3} />
                    <div className="absolute w-1 h-1 bg-yellow-200 top-1 left-1"></div>
                    <div className="absolute w-1 h-1 bg-yellow-900 top-1 right-1"></div>
                    <div className="absolute w-1 h-1 bg-yellow-900 bottom-1 left-1"></div>
                    <div className="absolute w-1 h-1 bg-yellow-900 bottom-1 right-1"></div>
                </div>
                {/* Glow behind */}
                <div className="absolute inset-0 bg-yellow-400 blur-md opacity-50 animate-ping" />
            </div>
        </motion.div>
    )
}

// Retro Background Elements
const RetroSilhouette = ({ Icon, x, y, delay, rotate, color = "text-purple-600/30", spin = false, scale = 1 }: any) => (
    <motion.div
        initial={{ z: -800, opacity: 0 }}
        animate={{ 
            z: 200, 
            opacity: [0, 1, 0],
            rotate: spin ? [0, 360] : rotate
        }}
        transition={{ 
            z: { duration: 1.8, delay, ease: "linear" },
            opacity: { duration: 1.8, delay, ease: "linear" },
            rotate: spin ? { duration: 2, repeat: Infinity, ease: "linear" } : {}
        }}
        className={`absolute ${color}`}
        style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`, transform: !spin ? `rotate(${rotate}deg) scale(${scale})` : `scale(${scale})` }}
    >
        <Icon size={80} />
    </motion.div>
)

// Confetti Explosion System
const ConfettiExplosion = ({ triggerDelay }: { triggerDelay: number }) => {
    const colors = ['bg-white', 'bg-yellow-300', 'bg-cyan-400', 'bg-purple-500'];
    
    useEffect(() => {
        const timer = setTimeout(() => {
            playRetroSound('POWERUP');
        }, triggerDelay * 1000);
        return () => clearTimeout(timer);
    }, [triggerDelay]);
    
    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[60]">
             {[...Array(20)].map((_, i) => {
                 const angle = (i / 20) * 360;
                 const distance = 150 + Math.random() * 100;
                 const randomColor = colors[i % colors.length];
                 
                 return (
                     <motion.div
                        key={i}
                        className={`absolute w-3 h-3 ${randomColor} rounded-full shadow-[0_0_10px_white]`}
                        initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                        animate={{ 
                            x: Math.cos(angle * Math.PI / 180) * distance,
                            y: Math.sin(angle * Math.PI / 180) * distance,
                            scale: [0, 1, 0],
                            opacity: [1, 1, 0]
                        }}
                        transition={{ 
                            delay: triggerDelay,
                            duration: 0.8,
                            ease: "easeOut"
                        }}
                     />
                 )
             })}
             {/* Flash */}
             <motion.div 
                className="absolute inset-0 bg-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.3, 0] }}
                transition={{ delay: triggerDelay, duration: 0.2 }}
             />
        </div>
    )
}

export const Scene2Tunnel: React.FC = () => {

  // Synchronize Jump Sounds
  useEffect(() => {
    // Timings match the animation keyframes roughly
    const jumpInterval = setInterval(() => {
        playRetroSound('JUMP');
    }, 2000 * 0.2); // First jump
    
    // Actually the jump is a continuous loop of 2s with bounces at specific times
    // Let's just play a few specific ones
    const t1 = setTimeout(() => playRetroSound('JUMP'), 100);
    const t2 = setTimeout(() => playRetroSound('JUMP'), 900); // 2nd jump
    const t3 = setTimeout(() => playRetroSound('JUMP'), 1300); // 3rd jump

    // Also coin sound occasionally
    const c1 = setTimeout(() => playRetroSound('COIN'), 500);
    const c2 = setTimeout(() => playRetroSound('COIN'), 1500);

    return () => {
        clearInterval(jumpInterval);
        clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
        clearTimeout(c1); clearTimeout(c2);
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 3, filter: 'blur(10px)' }}
      className="absolute inset-0 bg-black overflow-hidden flex items-center justify-center perspective-[600px]"
    >
      {/* Background Grid Rolling */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,30,1),black)]" />

      {/* The Tunnel of Bricks & Pipes */}
      {[0, 0.4, 0.8, 1.2, 1.6].map((delay, i) => (
          <BrickRow key={i} delay={delay} zStart={-500} />
      ))}

      {/* Obstacles / Platforms */}
      <FloatingPlatform delay={0.2} />
      <FloatingPlatform delay={1.2} />

      {/* Retro Decor (Barrels/Shapes) */}
      <RetroSilhouette Icon={Disc} x={-300} y={100} delay={0.5} rotate={45} /> {/* Rolling Barrel Ref */}
      <RetroSilhouette Icon={Square} x={300} y={-100} delay={1.0} rotate={12} />
      
      {/* --- Star of Protection (Mario Star) --- */}
      <RetroSilhouette 
          Icon={Star} 
          x={0} 
          y={-120} 
          delay={0.6} 
          rotate={0} 
          color="text-yellow-300 drop-shadow-[0_0_20px_rgba(253,224,71,1)]" 
          spin={true} 
          scale={1.5}
      />
      
      {/* Confetti Trigger & Sound */}
      <ConfettiExplosion triggerDelay={1.6} />

      {/* HERO CUBE */}
      <motion.div
        className="absolute z-50 w-14 h-14"
        style={{ top: '60%' }} // Initial Floor position relative to screen
        initial={{ x: -200 }}
        animate={{ x: 0 }} // Center itself horizontally
        transition={{ duration: 1, ease: "circOut" }}
      >
        <motion.div
             // Jump Physics simulation
             animate={{ 
                 y: [0, -120, 0, 0, -120, 0], // Jump pattern
                 rotate: [0, -180, -360, -360, -540, -720] // Spin while jumping
             }}
             transition={{ 
                 duration: 2, // Matches the loop of platforms
                 ease: "linear",
                 repeat: Infinity,
                 times: [0, 0.2, 0.4, 0.5, 0.7, 0.9] // Timing for jump apex and landing
             }}
             className="w-full h-full bg-gradient-to-tr from-cyan-400 to-purple-600 border-2 border-white shadow-[0_0_20px_rgba(34,211,238,0.8)] rounded-sm flex items-center justify-center relative"
        >
            {/* Cube Face */}
            <div className="w-8 h-8 bg-black/40 flex gap-1 items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-sm" />
                <div className="w-2 h-2 bg-white rounded-sm" />
            </div>

            {/* Invincibility Sparkles (Triggered late) */}
            <motion.div 
               className="absolute inset-0 pointer-events-none"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 1.6, duration: 0.1 }}
            >
               <Sparkles className="absolute -top-4 -right-4 text-yellow-300 w-8 h-8 animate-pulse" />
               <Sparkles className="absolute -bottom-4 -left-4 text-white w-6 h-6 animate-pulse" />
            </motion.div>
        </motion.div>
        
        {/* Trail Effect */}
        <motion.div 
            className="absolute inset-0 bg-cyan-400 opacity-30 blur-md rounded-sm"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 0.2, repeat: Infinity }}
        />
      </motion.div>

    </motion.div>
  );
};
