import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { playRetroSound } from '../utils/audio';

const GROUND_Y = 0;
const JUMP_STRENGTH = 26;
const GRAVITY = 2.1;
const MAX_JUMPS = 3;

interface Obstacle {
  id: number;
  x: number;
  width: number;
  height: number;
}

interface GameDashProps {
  onExit: () => void;
}

export const GameDash: React.FC<GameDashProps> = ({ onExit }) => {
  const [playerY, setPlayerY] = useState(0);
  const [velocityY, setVelocityY] = useState(0);
  const [jumpCount, setJumpCount] = useState(0);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [isRunning, setIsRunning] = useState(true);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const frameRef = useRef<number | null>(null);
  const lastSpawnRef = useRef<number>(0);

  const resetGame = () => {
    setPlayerY(0);
    setVelocityY(0);
    setJumpCount(0);
    setObstacles([]);
    setScore(0);
    setIsRunning(true);
    setIsGameOver(false);
    lastSpawnRef.current = 0;
  };

  const handleJump = () => {
    if (!isRunning) return;
    if (jumpCount >= MAX_JUMPS) return;
    playRetroSound('JUMP');
    setVelocityY(-JUMP_STRENGTH);
    setJumpCount((c) => c + 1);
  };

  // Keyboard controls
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        handleJump();
      }
      if (e.code === 'Escape') {
        onExit();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [jumpCount, isRunning, onExit]);

  // Core game loop
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (time: number) => {
      const delta = Math.min((time - lastTime) / 16.67, 2); // aprox 60fps
      lastTime = time;

      if (isRunning) {
        setVelocityY((vy) => vy + GRAVITY * delta);
        setPlayerY((y) => {
          const nextY = y + velocityY * delta;
          if (nextY >= GROUND_Y) {
            setJumpCount(0);
            return GROUND_Y;
          }
          return nextY;
        });

        setObstacles((prev) => {
          const speed = 7;
          const updated = prev
            .map((ob) => ({ ...ob, x: ob.x - speed * delta * 3 }))
            .filter((ob) => ob.x + ob.width > -40);

          // Spawn new obstacles con separación variable
          if (time - lastSpawnRef.current > 900) {
            const lastX = updated.length ? updated[updated.length - 1].x : 260;
            const baseX = Math.max(lastX, 260) + 80 + Math.random() * 80;
            const height = 30 + Math.random() * 20;
            const width = 20 + Math.random() * 10;
            updated.push({
              id: time,
              x: baseX,
              width,
              height,
            });
            lastSpawnRef.current = time;
          }

          return updated;
        });

        setScore((s) => s + 1);
      }

      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [isRunning, velocityY]);

  // Simple collision (jugador = cuadrado fijo)
  useEffect(() => {
    if (!isRunning) return;
    const playerX = 80;
    const playerWidth = 26;
    const playerHeight = 26;

    for (const ob of obstacles) {
      const overlapX = playerX < ob.x + ob.width && playerX + playerWidth > ob.x;
      const overlapY = playerY + playerHeight > -ob.height && playerY <= 0;
      if (overlapX && overlapY) {
        setIsRunning(false);
        setIsGameOver(true);
        setAttempts((a) => a + 1);
        playRetroSound('EXPLOSION');
        break;
      }
    }
  }, [obstacles, playerY, isRunning]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center select-none">
      <div className="mb-4 flex items-center justify-between w-full max-w-xl px-4 text-[10px] md:text-xs font-['Share_Tech_Mono'] tracking-[0.35em] text-cyan-200">
        <span>WILEX // GEOMETRY TRIAL</span>
        <span>SCORE {score.toString().padStart(4, '0')}</span>
      </div>

      <div
        className="relative w-full max-w-xl h-48 md:h-56 rounded-xl border border-cyan-500/40 bg-slate-900/60 backdrop-blur-xl overflow-hidden shadow-[0_0_30px_rgba(34,211,238,0.6)]"
        onClick={handleJump}
      >
        {/* Fondo retro */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.2),transparent_60%)]" />
        <div className="absolute inset-0 opacity-30 bg-[linear-gradient(transparent_0%,rgba(148,163,184,0.35)_1px,transparent_2px),linear-gradient(90deg,transparent_0%,rgba(148,163,184,0.35)_1px,transparent_2px)] bg-[length:20px_20px]" />

        {/* Suelo */}
        <div className="absolute bottom-6 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 shadow-[0_0_12px_rgba(56,189,248,0.9)]" />

        {/* Obstáculos */}
        {obstacles.map((ob) => (
          <motion.div
            key={ob.id}
            className="absolute bottom-6 bg-gradient-to-t from-purple-600 to-cyan-400 border border-white/40 shadow-[0_0_16px_rgba(129,140,248,0.9)]"
            style={{
              left: ob.x,
              width: ob.width,
              height: ob.height,
            }}
          />
        ))}

        {/* Jugador (cubo) */}
        <motion.div
          className="absolute bg-gradient-to-tr from-cyan-400 to-purple-500 border border-white/70 shadow-[0_0_16px_rgba(56,189,248,0.9)] flex items-center justify-center"
          style={{
            left: 80,
            bottom: 6 - playerY,
            width: 26,
            height: 26,
          }}
        >
          <div className="w-3 h-3 bg-black/60 rounded-sm flex gap-0.5">
            <div className="w-1.5 h-1.5 bg-white/90 rounded-sm" />
            <div className="w-1.5 h-1.5 bg-white/90 rounded-sm" />
          </div>
        </motion.div>

        {/* Info de saltos */}
        <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-black/40 border border-cyan-400/60 text-[9px] font-['Share_Tech_Mono'] tracking-[0.25em] text-cyan-100">
          JUMPS {jumpCount}/{MAX_JUMPS}
        </div>

        {/* Estado de juego */}
        {isGameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-md">
            <div className="text-xs md:text-sm font-['Orbitron'] tracking-[0.3em] text-red-300 mb-2">
              GAME OVER
            </div>
            <div className="text-[10px] md:text-xs font-['Share_Tech_Mono'] text-cyan-200 mb-4">
              ATTEMPTS {attempts.toString().padStart(2, '0')}
            </div>
            <button
              onClick={resetGame}
              className="px-4 py-1 rounded-md border border-cyan-400/70 bg-black/60 text-[10px] md:text-xs font-['Share_Tech_Mono'] tracking-[0.25em] text-cyan-100 hover:bg-cyan-500/10"
            >
              RETRY TRIAL
            </button>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between w-full max-w-xl px-4 text-[9px] md:text-[10px] font-['Share_Tech_Mono'] text-slate-300/80">
        <span>SPACE / TAP · UP TO 3 JUMPS</span>
        <button
          onClick={onExit}
          className="px-3 py-1 rounded-full border border-slate-500/60 bg-black/40 hover:bg-slate-800/60"
        >
          EXIT HUB
        </button>
      </div>
    </div>
  );
};
