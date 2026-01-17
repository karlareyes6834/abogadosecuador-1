import React from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Trophy, Zap, Radio } from 'lucide-react';

export const Scene4Logo: React.FC = () => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
      
      {/* Main Title - Appears above WGS */}
      <motion.div
        initial={{ y: -50, opacity: 0, scale: 0.9 }}
        animate={{ y: -120, opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="absolute z-30 flex flex-col items-center"
      >
        <h1 className="text-4xl md:text-5xl font-['Orbitron'] font-bold text-white tracking-widest uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
            <span className="text-cyan-400">Wilex</span>Game<span className="text-purple-500">Station</span>
        </h1>
        <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="h-1 bg-gradient-to-r from-transparent via-white to-transparent mt-2 shadow-[0_0_10px_white]"
        />
        <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-2 font-['Share_Tech_Mono'] text-purple-300 tracking-[0.5em] text-sm md:text-base"
        >
            RETRO NEON DIMENSION
        </motion.p>
      </motion.div>

      {/* Holographic Menus (Left & Right) */}
      <div className="absolute w-full max-w-5xl flex justify-between px-10">
          {/* Left Menu */}
          <motion.div 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col gap-4"
          >
             <MenuIcon Icon={Gamepad2} label="SYSTEM" delay={0.5} />
             <MenuIcon Icon={Trophy} label="LEGACY" delay={0.6} />
          </motion.div>

          {/* Right Menu */}
          <motion.div 
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col gap-4 items-end"
          >
             <MenuIcon Icon={Zap} label="POWER" delay={0.5} alignRight />
             <MenuIcon Icon={Radio} label="NETWORK" delay={0.6} alignRight />
          </motion.div>
      </div>

    </div>
  );
};

const MenuIcon = ({ Icon, label, delay, alignRight }: { Icon: any, label: string, delay: number, alignRight?: boolean }) => (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay }}
        className={`flex items-center gap-3 text-cyan-500/80 ${alignRight ? 'flex-row-reverse' : ''}`}
    >
        <div className="p-2 border border-cyan-500/30 rounded bg-cyan-900/10 backdrop-blur-sm">
            <Icon size={24} />
        </div>
        <div className="h-[1px] w-10 bg-cyan-500/50"></div>
        <span className="font-mono text-xs tracking-widest">{label}</span>
    </motion.div>
)
