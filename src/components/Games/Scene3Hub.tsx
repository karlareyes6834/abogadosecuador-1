
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { playRetroSound } from '../utils/audio';

interface Scene3HubProps {
  showFullLogo: boolean;
  enterPortal: boolean;
}

export const Scene3Hub: React.FC<Scene3HubProps> = ({ showFullLogo, enterPortal }) => {
  
  useEffect(() => {
    // Letter thuds
    setTimeout(() => playRetroSound('WGS'), 0);
    setTimeout(() => playRetroSound('WGS'), 150);
    setTimeout(() => playRetroSound('WGS'), 300);
  }, []);

  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center perspective-[1200px] overflow-hidden">

      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.05, y: 40, rotateX: 18 }}
        animate={{
          scale: enterPortal ? 1.15 : 1,
          y: enterPortal ? -40 : 0,
        }}
        transition={{ duration: enterPortal ? 1.2 : 1.6, ease: 'easeInOut' }}
        style={{ transformStyle: 'preserve-3d' }}
      >

        {/* Retro Grid Floor - Vaporwave Style */}
        <motion.div
          className="absolute bottom-[-25%] left-1/2 -translate-x-1/2 w-[260%] h-[170%] bg-[linear-gradient(transparent_0%,rgba(168,85,247,0.25)_1px,transparent_2px),linear-gradient(90deg,transparent_0%,rgba(34,211,238,0.25)_1px,transparent_2px)] bg-[length:70px_70px]"
          style={{
            rotateX: 63,
            backgroundPosition: 'center bottom',
            maskImage: 'linear-gradient(to top, black 20%, transparent 90%)',
          }}
          animate={{ backgroundPositionY: [0, 160] }}
          transition={{
            duration: enterPortal ? 0.6 : 4,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Columnas de luz monumentales al fondo */}
        <div className="absolute inset-x-0 top-0 h-full opacity-60">
          <div className="relative w-full h-full flex justify-center gap-12 md:gap-20">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-[40px] md:w-[60px] bg-gradient-to-b from-cyan-500/0 via-cyan-400/40 to-purple-700/40 blur-[2px]"
                style={{ transform: 'translateZ(-300px)' }}
                animate={{
                  opacity: [0.2, 0.8, 0.3],
                  scaleY: [0.7, 1.2, 0.9],
                }}
                transition={{
                  duration: 5 + i,
                  repeat: Infinity,
                  repeatType: 'mirror',
                  delay: i * 0.4,
                }}
              />
            ))}
          </div>
        </div>

        {/* --- Floating Retro Elements --- */}

        {/* 1. Pong / Tennis (Left Side) */}
        <motion.div
          className="absolute left-[6%] md:left-[10%] top-[40%] w-32 h-20 opacity-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.45 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="w-2 h-8 bg-cyan-100 absolute left-0"
            animate={{ y: [0, 40, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="w-2 h-8 bg-cyan-100 absolute right-0"
            animate={{ y: [40, 0, 40] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="w-2 h-2 bg-cyan-200 absolute"
            animate={{ x: [10, 110, 10], y: [10, 50, 10] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>

        {/* 2. Pac-Chase (Floor level) */}
        <motion.div
          className="absolute bottom-[24%] right-[-15%] flex gap-4"
          initial={{ x: '40vw' }}
          animate={{ x: '-120vw' }}
          transition={{ duration: 9, repeat: Infinity, ease: 'linear', delay: 1 }}
        >
          {/* Pac */}
          <div className="w-8 h-8 rounded-full bg-yellow-400 relative overflow-hidden animate-pulse">
            <div
              className="absolute right-0 top-0 w-full h-full bg-black"
              style={{ clipPath: 'polygon(100% 0, 100% 100%, 50% 50%)' }}
            />
          </div>
          {/* Ghost */}
          <div className="w-8 h-8 rounded-t-full bg-red-500 relative">
            <div className="absolute top-2 left-1 w-2 h-2 bg-white rounded-full">
              <div className="w-1 h-1 bg-blue-900 rounded-full ml-1" />
            </div>
            <div className="absolute top-2 right-1 w-2 h-2 bg-white rounded-full">
              <div className="w-1 h-1 bg-blue-900 rounded-full" />
            </div>
            <div className="absolute bottom-0 w-full flex justify-between px-1">
              <div className="w-1 h-2 bg-red-500 rounded-full translate-y-1" />
              <div className="w-1 h-2 bg-red-500 rounded-full translate-y-1" />
              <div className="w-1 h-2 bg-red-500 rounded-full translate-y-1" />
            </div>
          </div>
        </motion.div>

        {/* 3. Ship dodging particles (Top Right) */}
        <motion.div
          className="absolute top-[18%] right-[10%] md:right-[15%] w-20 h-20 opacity-40"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[20px] border-b-cyan-400" />
        </motion.div>

        {/* Secciones de tipos de juegos alrededor del salón */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full max-w-5xl h-[60vh]">
            {/* Plataformas retro */}
            <motion.div
              className="absolute left-2 md:left-6 top-[18%] flex flex-col items-start gap-2 text-xs md:text-sm"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex gap-2">
                <div className="w-10 h-4 bg-purple-500/60 border border-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
                <div className="w-10 h-4 bg-purple-500/40 border border-purple-200 shadow-[0_0_10px_rgba(168,85,247,0.6)] translate-y-2" />
              </div>
              <div className="w-5 h-10 bg-green-500/60 border border-green-300 shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
              <span className="font-['Share_Tech_Mono'] tracking-[0.35em] text-cyan-300/80">
                RETRO PLATFORMS
              </span>
            </motion.div>

            {/* Ritmo / Geometry Dash */}
            <motion.div
              className="absolute right-4 md:right-8 top-[26%] flex flex-col items-end gap-2 text-xs md:text-sm"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
            >
              <motion.div
                className="flex gap-2"
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-4 h-4 bg-gradient-to-br from-cyan-400 to-purple-500 border border-white/40 shadow-[0_0_10px_rgba(56,189,248,0.9)]"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </motion.div>
              <span className="font-['Share_Tech_Mono'] tracking-[0.35em] text-purple-300/80">
                RHYTHM / DASH
              </span>
            </motion.div>

            {/* Puzzles */}
            <motion.div
              className="absolute left-[12%] bottom-[30%] flex flex-col gap-2 text-xs md:text-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <div className="flex gap-1">
                <div className="w-4 h-4 bg-cyan-500/70" />
                <div className="w-4 h-4 bg-pink-500/70 rotate-3" />
                <div className="w-4 h-4 bg-indigo-500/70 -rotate-3" />
                <div className="w-4 h-4 bg-yellow-400/70" />
              </div>
              <span className="font-['Share_Tech_Mono'] tracking-[0.35em] text-cyan-200/80">
                PUZZLES
              </span>
            </motion.div>

            {/* Deportes */}
            <motion.div
              className="absolute right-[16%] bottom-[32%] flex flex-col items-end gap-2 text-xs md:text-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
            >
              <div className="flex gap-2">
                {[0, 1].map((i) => (
                  <motion.div
                    key={i}
                    className="w-5 h-5 rounded-full border border-cyan-200 bg-cyan-500/30 shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 1 + i * 0.3, repeat: Infinity }}
                  />
                ))}
              </div>
              <span className="font-['Share_Tech_Mono'] tracking-[0.35em] text-cyan-300/80">
                SPORTS
              </span>
            </motion.div>

            {/* Cartas / Estrategia */}
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 top-[12%] flex flex-col items-center gap-2 text-xs md:text-sm"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <div className="flex gap-1">
                <div className="w-6 h-8 border border-cyan-300/60 bg-slate-900/70 rotate-[-10deg]" />
                <div className="w-6 h-8 border border-purple-300/60 bg-slate-900/70 -translate-y-1" />
                <div className="w-6 h-8 border border-emerald-300/60 bg-slate-900/70 rotate-[10deg]" />
              </div>
              <span className="font-['Share_Tech_Mono'] tracking-[0.35em] text-purple-200/80">
                CARDS & STRATEGY
              </span>
            </motion.div>

            {/* Aventura / Mundo abierto */}
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 bottom-[14%] flex flex-col items-center gap-2 text-xs md:text-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
            >
              <div className="relative w-24 h-10 rounded-full border border-purple-400/70 bg-gradient-to-r from-cyan-500/40 to-purple-600/40 overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.5),transparent_60%)]"
                  animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.2, 0.6, 0.3] }}
                  transition={{ duration: 2.4, repeat: Infinity }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-['Share_Tech_Mono'] tracking-[0.25em] text-cyan-50/90">
                  WORLD GATES
                </div>
              </div>
              <span className="font-['Share_Tech_Mono'] tracking-[0.35em] text-cyan-200/80">
                ADVENTURE
              </span>
            </motion.div>
          </div>
        </div>

        {/* Paneles holográficos de menú principales */}
        <div className="absolute inset-0 flex items-center justify-between px-4 md:px-10 pointer-events-none">
          <div className="flex flex-col gap-3 md:gap-4 text-[10px] md:text-xs font-['Share_Tech_Mono'] tracking-[0.35em] text-cyan-200/80">
            {['GAMES', 'FRIENDS', 'MULTIPLAYER'].map((label, i) => (
              <motion.div
                key={label}
                className="relative px-3 py-2 rounded-md border border-cyan-500/40 bg-cyan-900/10 backdrop-blur-md shadow-[0_0_18px_rgba(8,145,178,0.65)] overflow-hidden"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-purple-500/20" />
                <div className="relative flex items-center justify-between gap-3">
                  <span>{label}</span>
                  <span className="text-[8px] text-cyan-400/80">ONLINE</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col items-end gap-3 md:gap-4 text-[10px] md:text-xs font-['Share_Tech_Mono'] tracking-[0.35em] text-purple-200/80">
            {['STORE', 'QUESTS', 'RANKING'].map((label, i) => (
              <motion.div
                key={label}
                className="relative px-3 py-2 rounded-md border border-purple-500/40 bg-purple-900/10 backdrop-blur-md shadow-[0_0_18px_rgba(147,51,234,0.65)] overflow-hidden"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
              >
                <div className="absolute inset-0 bg-gradient-to-l from-purple-500/15 via-transparent to-cyan-500/20" />
                <div className="relative flex items-center justify-between gap-3">
                  <span>{label}</span>
                  <span className="text-[8px] text-purple-300/80">SYNC</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* --- Main Centerpiece --- */}

        {/* WGS Letters */}
        <div className="relative z-20 flex flex-col items-center gap-3 mb-6">
          <div className="flex gap-4">
            {['W', 'G', 'S'].map((letter, i) => (
              <motion.div
                key={letter}
                initial={{ y: 200, opacity: 0, rotateX: -90 }}
                animate={{
                  y: 0,
                  opacity: 1,
                  rotateX: 0,
                  rotateY: showFullLogo ? [0, 360] : 0,
                }}
                transition={{
                  delay: i * 0.15,
                  duration: 0.8,
                  type: 'spring',
                  bounce: 0.5,
                  rotateY: showFullLogo
                    ? {
                        delay: 2,
                        duration: 3,
                        repeat: Infinity,
                        repeatDelay: 2,
                        ease: 'easeInOut',
                      }
                    : undefined,
                }}
                className="text-7xl md:text-8xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-purple-200 drop-shadow-[0_0_25px_rgba(34,211,238,0.8)]"
                style={{
                  WebkitTextStroke: '1px rgba(34,211,238,0.8)',
                  filter: 'drop-shadow(0 0 10px rgba(192,132,252,0.6))',
                }}
              >
                {letter}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 0.6, scale: [0.9, 1.05, 0.9] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-[10px] md:text-xs font-['Share_Tech_Mono'] tracking-[0.55em] text-cyan-300/70"
          >
            W.A.I.G // JUSTICE BALANCE
          </motion.div>
        </div>

        {/* Pedestal / Hologram Base */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.7 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="absolute top-[64%] left-1/2 -translate-x-1/2 w-[260px] md:w-[320px] h-[55px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-400/60 via-purple-500/25 to-transparent blur-xl"
        />

        {/* Scanning ring around pedestal */}
        <motion.div
          className="absolute top-[61%] left-1/2 -translate-x-1/2 w-[340px] md:w-[420px] h-[110px] border border-cyan-500/30 rounded-full"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: [1, 1.15], opacity: [0.5, 0] }}
          transition={{ duration: 2.2, repeat: Infinity }}
          style={{ rotateX: 60 }}
        />

        {/* Portal RGB de entrada al juego */}
        <motion.div
          className="absolute bottom-[4%] left-1/2 -translate-x-1/2 w-[200px] md:w-[260px] h-[80px] flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: enterPortal ? 1 : 0.85,
            scale: enterPortal ? [1, 1.1, 1.2] : [0.95, 1.05, 0.95],
          }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div
            className="absolute inset-0 rounded-full border border-white/60"
            style={{
              background:
                'conic-gradient(from 0deg, #22d3ee, #a855f7, #ec4899, #22c55e, #22d3ee)',
              filter: 'blur(10px)',
              opacity: 0.95,
            }}
          />
          <div className="relative w-[85%] h-[60%] rounded-full bg-black/80 border border-cyan-300/60 flex items-center justify-center overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.7),transparent_60%)]"
              animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.3, 0.7, 0.4] }}
              transition={{ duration: 2.3, repeat: Infinity }}
            />
            <span className="relative z-10 text-[10px] md:text-xs font-['Share_Tech_Mono'] tracking-[0.45em] text-cyan-50">
              ENTER GAME
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
