import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { playRetroSound } from '../utils/audio';
import { usePlayer } from '../contexts/PlayerContext';

interface Enemy {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  health: number;
}

interface Bullet {
  id: number;
  x: number;
  y: number;
}

interface GameSpaceShooterProps {
  onExit: () => void;
}

const LEVEL_CONFIG = {
  1: { enemySpawn: 1500, enemySpeed: 2, maxEnemies: 3, bulletDamage: 1 },
  2: { enemySpawn: 1200, enemySpeed: 2.5, maxEnemies: 5, bulletDamage: 1 },
  3: { enemySpawn: 900, enemySpeed: 3, maxEnemies: 7, bulletDamage: 2 },
};

export const GameSpaceShooter: React.FC<GameSpaceShooterProps> = ({ onExit }) => {
  const { profile, addTokens, addXP, updateSpaceScore, addBadge, incrementGamesPlayed } = usePlayer();
  const [level, setLevel] = useState(1);
  const [playerX, setPlayerX] = useState(180);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(100);
  const [isRunning, setIsRunning] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [levelComplete, setLevelComplete] = useState(false);
  const [rewardShown, setRewardShown] = useState(false);

  const frameRef = useRef<number | null>(null);
  const lastSpawnRef = useRef<number>(0);
  const keysRef = useRef<{ [key: string]: boolean }>({});

  const config = LEVEL_CONFIG[level as keyof typeof LEVEL_CONFIG] || LEVEL_CONFIG[1];

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key] = true;
      if (e.key === ' ') {
        e.preventDefault();
        // Shoot
      }
      if (e.key === 'Escape') onExit();
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [onExit]);

  useEffect(() => {
    let lastTime = performance.now();

    const loop = (time: number) => {
      const delta = Math.min((time - lastTime) / 16.67, 2);
      lastTime = time;

      if (!isRunning) {
        frameRef.current = requestAnimationFrame(loop);
        return;
      }

      // Player movement
      if (keysRef.current['ArrowLeft'] || keysRef.current['a']) {
        setPlayerX((x) => Math.max(0, x - 5));
      }
      if (keysRef.current['ArrowRight'] || keysRef.current['d']) {
        setPlayerX((x) => Math.min(360, x + 5));
      }

      // Shoot
      if (keysRef.current[' ']) {
        setBullets((prev) => [
          ...prev,
          { id: time, x: playerX + 8, y: 280 },
        ]);
        playRetroSound('LASER');
        keysRef.current[' '] = false;
      }

      // Update bullets
      setBullets((prev) =>
        prev
          .map((b) => ({ ...b, y: b.y - 8 }))
          .filter((b) => b.y > 0)
      );

      // Spawn enemies
      if (time - lastSpawnRef.current > config.enemySpawn) {
        setEnemies((prev) => {
          if (prev.length < config.maxEnemies) {
            return [
              ...prev,
              {
                id: time,
                x: Math.random() * 340,
                y: -20,
                width: 20,
                height: 20,
                health: 1,
              },
            ];
          }
          return prev;
        });
        lastSpawnRef.current = time;
      }

      // Update enemies
      setEnemies((prev) => {
        let updated = prev.map((e) => ({
          ...e,
          y: e.y + config.enemySpeed * delta * 3,
        }));

        // Check collisions with bullets
        setBullets((prevBullets) => {
          let newBullets = [...prevBullets];
          updated = updated.filter((enemy) => {
            let hit = false;
            newBullets = newBullets.filter((bullet) => {
              if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + 4 > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + 8 > enemy.y
              ) {
                hit = true;
                return false; // Remove bullet
              }
              return true;
            });
            if (hit) {
              setScore((s) => s + 10);
              playRetroSound('COIN');
              return false; // Remove enemy
            }
            return true;
          });
          return newBullets;
        });

        // Check collisions with player
        updated.forEach((enemy) => {
          if (
            playerX < enemy.x + enemy.width &&
            playerX + 20 > enemy.x &&
            300 < enemy.y + enemy.height &&
            300 + 20 > enemy.y
          ) {
            setHealth((h) => Math.max(0, h - 20));
            playRetroSound('EXPLOSION');
          }
        });

        return updated.filter((e) => e.y < 320);
      });

      setScore((s) => s + 1);

      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [isRunning, playerX, config]);

  useEffect(() => {
    if (health <= 0) {
      setIsRunning(false);
      setGameOver(true);
      incrementGamesPlayed();
      updateSpaceScore(score);
      const tokenReward = Math.floor(30 + score / 50);
      const xpReward = Math.floor(60 + score / 25);
      addTokens(tokenReward);
      addXP(xpReward);
      setRewardShown(true);
      playRetroSound('EXPLOSION');
    }
  }, [health, score, addTokens, addXP, updateSpaceScore, incrementGamesPlayed]);

  const handleNextLevel = () => {
    if (level < 3) {
      setLevel((l) => l + 1);
      setEnemies([]);
      setBullets([]);
      setScore(0);
      setHealth(100);
      setIsRunning(true);
      setLevelComplete(false);
      setRewardShown(false);
      lastSpawnRef.current = 0;
      playRetroSound('POWERUP');
    } else {
      // Game complete
      addBadge('space-master');
      onExit();
    }
  };

  const handleRetry = () => {
    setLevel(1);
    setEnemies([]);
    setBullets([]);
    setScore(0);
    setHealth(100);
    setIsRunning(true);
    setGameOver(false);
    setRewardShown(false);
    lastSpawnRef.current = 0;
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center select-none">
      <div className="mb-4 flex items-center justify-between w-full max-w-xl px-4 text-[10px] md:text-xs font-['Share_Tech_Mono'] tracking-[0.35em] text-cyan-200">
        <span>WILEX // SPACE SHOOTER [LEVEL {level}]</span>
        <span>SCORE {score.toString().padStart(4, '0')}</span>
      </div>

      <div className="relative w-full max-w-xl h-80 rounded-xl border border-cyan-500/40 bg-black backdrop-blur-xl overflow-hidden shadow-[0_0_30px_rgba(34,211,238,0.6)]">
        {/* Starfield background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.1),transparent_60%)]" />
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}

        {/* Player */}
        <motion.div
          className="absolute bottom-4 w-5 h-8 bg-gradient-to-t from-cyan-400 to-purple-500 border border-white/70 shadow-[0_0_12px_rgba(56,189,248,0.9)]"
          style={{ left: playerX }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-2 bg-yellow-300" />
        </motion.div>

        {/* Bullets */}
        {bullets.map((b) => (
          <div
            key={b.id}
            className="absolute w-1 h-2 bg-yellow-300 shadow-[0_0_6px_rgba(253,224,71,0.9)]"
            style={{ left: b.x, top: b.y }}
          />
        ))}

        {/* Enemies */}
        {enemies.map((e) => (
          <motion.div
            key={e.id}
            className="absolute w-5 h-5 bg-gradient-to-b from-red-500 to-red-700 border border-red-300 shadow-[0_0_10px_rgba(239,68,68,0.8)]"
            style={{ left: e.x, top: e.y }}
          >
            <div className="absolute inset-1 border border-red-200/50" />
          </motion.div>
        ))}

        {/* Health bar */}
        <div className="absolute top-2 left-2 right-2 h-2 rounded-full border border-cyan-400/60 bg-black/60">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full transition-all"
            style={{ width: `${health}%` }}
          />
        </div>

        {/* Game Over */}
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md">
            <div className="text-sm md:text-base font-['Orbitron'] tracking-[0.3em] text-red-300 mb-2">
              GAME OVER
            </div>
            {rewardShown && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center mb-3"
              >
                <div className="text-[10px] md:text-xs font-['Share_Tech_Mono'] text-emerald-300 mb-1">
                  +{Math.floor(30 + score / 50)} TOKENS
                </div>
                <div className="text-[10px] md:text-xs font-['Share_Tech_Mono'] text-cyan-300">
                  +{Math.floor(60 + score / 25)} XP
                </div>
              </motion.div>
            )}
            <button
              onClick={handleRetry}
              className="px-4 py-1 rounded-md border border-cyan-400/70 bg-black/60 text-[10px] md:text-xs font-['Share_Tech_Mono'] tracking-[0.25em] text-cyan-100 hover:bg-cyan-500/10"
            >
              RETRY
            </button>
          </div>
        )}

        {/* Level Complete */}
        {levelComplete && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md">
            <div className="text-sm md:text-base font-['Orbitron'] tracking-[0.3em] text-emerald-300 mb-2">
              LEVEL {level} COMPLETE
            </div>
            <button
              onClick={handleNextLevel}
              className="px-4 py-1 rounded-md border border-emerald-400/70 bg-black/60 text-[10px] md:text-xs font-['Share_Tech_Mono'] tracking-[0.25em] text-emerald-100 hover:bg-emerald-500/10"
            >
              {level < 3 ? 'NEXT LEVEL' : 'FINISH'}
            </button>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between w-full max-w-xl px-4 text-[9px] md:text-[10px] font-['Share_Tech_Mono'] text-slate-300/80">
        <span>ARROWS / A-D · SPACE TO SHOOT</span>
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
