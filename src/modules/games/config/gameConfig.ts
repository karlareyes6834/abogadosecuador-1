// Configuración centralizada de juegos con contexto legal y sistema de tokens

export interface GameConfig {
  id: string;
  nameEs: string;
  nameEn: string;
  descriptionEs: string;
  descriptionEn: string;
  icon: string;
  category: 'legal' | 'arcade' | 'puzzle' | 'strategy';
  minLevel: number;
  maxLevel: number;
  baseTokenReward: number;
  baseXPReward: number;
  difficulty: 'easy' | 'medium' | 'hard';
  enabled: boolean;
}

export interface LevelConfig {
  level: number;
  enemySpawn?: number;
  enemySpeed?: number;
  maxEnemies?: number;
  bulletDamage?: number;
  timeLimit?: number;
  targetScore?: number;
  tokenMultiplier: number;
  xpMultiplier: number;
}

export const GAMES_CONFIG: Record<string, GameConfig> = {
  'law-trial': {
    id: 'law-trial',
    nameEs: 'Juicio Legal',
    nameEn: 'Law Trial',
    descriptionEs: 'Resuelve casos legales complejos aplicando principios de justicia',
    descriptionEn: 'Resolve complex legal cases applying justice principles',
    icon: '⚖️',
    category: 'legal',
    minLevel: 1,
    maxLevel: 5,
    baseTokenReward: 50,
    baseXPReward: 100,
    difficulty: 'medium',
    enabled: true
  },
  'space-shooter': {
    id: 'space-shooter',
    nameEs: 'Defensor del Espacio',
    nameEn: 'Space Defender',
    descriptionEs: 'Arcade de acción con niveles progresivos y desafíos crecientes',
    descriptionEn: 'Action arcade with progressive levels and growing challenges',
    icon: '🚀',
    category: 'arcade',
    minLevel: 1,
    maxLevel: 5,
    baseTokenReward: 40,
    baseXPReward: 80,
    difficulty: 'medium',
    enabled: true
  },
  'legal-tetris': {
    id: 'legal-tetris',
    nameEs: 'Tetris Legal',
    nameEn: 'Legal Tetris',
    descriptionEs: 'Puzzle con términos legales y mecánicas clásicas',
    descriptionEn: 'Puzzle with legal terms and classic mechanics',
    icon: '🧩',
    category: 'puzzle',
    minLevel: 1,
    maxLevel: 5,
    baseTokenReward: 35,
    baseXPReward: 70,
    difficulty: 'easy',
    enabled: true
  },
  'lawyer-trivia': {
    id: 'lawyer-trivia',
    nameEs: '¿Quién Quiere Ser Abogado?',
    nameEn: 'Who Wants to Be a Lawyer?',
    descriptionEs: 'Trivia legal con preguntas de dificultad creciente',
    descriptionEn: 'Legal trivia with increasing difficulty questions',
    icon: '🎓',
    category: 'legal',
    minLevel: 1,
    maxLevel: 5,
    baseTokenReward: 45,
    baseXPReward: 90,
    difficulty: 'medium',
    enabled: true
  },
  'contract-builder': {
    id: 'contract-builder',
    nameEs: 'Constructor de Contratos',
    nameEn: 'Contract Builder',
    descriptionEs: 'Construye contratos legales válidos siguiendo reglas profesionales',
    descriptionEn: 'Build valid legal contracts following professional rules',
    icon: '📋',
    category: 'strategy',
    minLevel: 1,
    maxLevel: 5,
    baseTokenReward: 60,
    baseXPReward: 120,
    difficulty: 'hard',
    enabled: true
  },
  'case-manager': {
    id: 'case-manager',
    nameEs: 'Gestor de Casos',
    nameEn: 'Case Manager',
    descriptionEs: 'Gestiona múltiples casos legales simultáneamente',
    descriptionEn: 'Manage multiple legal cases simultaneously',
    icon: '📁',
    category: 'strategy',
    minLevel: 1,
    maxLevel: 5,
    baseTokenReward: 55,
    baseXPReward: 110,
    difficulty: 'hard',
    enabled: true
  },
  'legal-memory': {
    id: 'legal-memory',
    nameEs: 'Memoria Legal',
    nameEn: 'Legal Memory',
    descriptionEs: 'Juego de memoria con términos y conceptos legales',
    descriptionEn: 'Memory game with legal terms and concepts',
    icon: '🧠',
    category: 'puzzle',
    minLevel: 1,
    maxLevel: 5,
    baseTokenReward: 30,
    baseXPReward: 60,
    difficulty: 'easy',
    enabled: true
  },
  'court-simulator': {
    id: 'court-simulator',
    nameEs: 'Simulador de Corte',
    nameEn: 'Court Simulator',
    descriptionEs: 'Simula procedimientos judiciales reales con decisiones estratégicas',
    descriptionEn: 'Simulates real judicial procedures with strategic decisions',
    icon: '⚔️',
    category: 'strategy',
    minLevel: 1,
    maxLevel: 5,
    baseTokenReward: 70,
    baseXPReward: 140,
    difficulty: 'hard',
    enabled: true
  },
  'legal-chess': {
    id: 'legal-chess',
    nameEs: 'Ajedrez Legal',
    nameEn: 'Legal Chess',
    descriptionEs: 'Ajedrez estratégico con contexto legal profesional',
    descriptionEn: 'Strategic chess with professional legal context',
    icon: '♟️',
    category: 'strategy',
    minLevel: 1,
    maxLevel: 5,
    baseTokenReward: 65,
    baseXPReward: 130,
    difficulty: 'hard',
    enabled: true
  },
  'legal-checkers': {
    id: 'legal-checkers',
    nameEs: 'Damas Legales',
    nameEn: 'Legal Checkers',
    descriptionEs: 'Damas clásicas con mecánicas legales',
    descriptionEn: 'Classic checkers with legal mechanics',
    icon: '⚫',
    category: 'strategy',
    minLevel: 1,
    maxLevel: 5,
    baseTokenReward: 50,
    baseXPReward: 100,
    difficulty: 'medium',
    enabled: true
  },
  'legal-domino': {
    id: 'legal-domino',
    nameEs: 'Dominó Legal',
    nameEn: 'Legal Domino',
    descriptionEs: 'Dominó con términos y conceptos legales',
    descriptionEn: 'Domino with legal terms and concepts',
    icon: '🎲',
    category: 'puzzle',
    minLevel: 1,
    maxLevel: 5,
    baseTokenReward: 40,
    baseXPReward: 80,
    difficulty: 'easy',
    enabled: true
  }
};

export const LEVEL_CONFIGS: Record<string, LevelConfig[]> = {
  'space-shooter': [
    { level: 1, enemySpawn: 1500, enemySpeed: 2, maxEnemies: 3, bulletDamage: 1, tokenMultiplier: 1, xpMultiplier: 1 },
    { level: 2, enemySpawn: 1200, enemySpeed: 2.5, maxEnemies: 5, bulletDamage: 1, tokenMultiplier: 1.2, xpMultiplier: 1.2 },
    { level: 3, enemySpawn: 900, enemySpeed: 3, maxEnemies: 7, bulletDamage: 2, tokenMultiplier: 1.5, xpMultiplier: 1.5 },
    { level: 4, enemySpawn: 600, enemySpeed: 3.5, maxEnemies: 10, bulletDamage: 2, tokenMultiplier: 1.8, xpMultiplier: 1.8 },
    { level: 5, enemySpawn: 400, enemySpeed: 4, maxEnemies: 15, bulletDamage: 3, tokenMultiplier: 2, xpMultiplier: 2 }
  ],
  'law-trial': [
    { level: 1, timeLimit: 60, targetScore: 50, tokenMultiplier: 1, xpMultiplier: 1 },
    { level: 2, timeLimit: 50, targetScore: 100, tokenMultiplier: 1.2, xpMultiplier: 1.2 },
    { level: 3, timeLimit: 40, targetScore: 150, tokenMultiplier: 1.5, xpMultiplier: 1.5 },
    { level: 4, timeLimit: 30, targetScore: 200, tokenMultiplier: 1.8, xpMultiplier: 1.8 },
    { level: 5, timeLimit: 20, targetScore: 250, tokenMultiplier: 2, xpMultiplier: 2 }
  ],
  'legal-tetris': [
    { level: 1, timeLimit: 120, targetScore: 100, tokenMultiplier: 1, xpMultiplier: 1 },
    { level: 2, timeLimit: 100, targetScore: 200, tokenMultiplier: 1.2, xpMultiplier: 1.2 },
    { level: 3, timeLimit: 80, targetScore: 300, tokenMultiplier: 1.5, xpMultiplier: 1.5 },
    { level: 4, timeLimit: 60, targetScore: 400, tokenMultiplier: 1.8, xpMultiplier: 1.8 },
    { level: 5, timeLimit: 40, targetScore: 500, tokenMultiplier: 2, xpMultiplier: 2 }
  ],
  'lawyer-trivia': [
    { level: 1, timeLimit: 30, targetScore: 5, tokenMultiplier: 1, xpMultiplier: 1 },
    { level: 2, timeLimit: 25, targetScore: 8, tokenMultiplier: 1.2, xpMultiplier: 1.2 },
    { level: 3, timeLimit: 20, targetScore: 10, tokenMultiplier: 1.5, xpMultiplier: 1.5 },
    { level: 4, timeLimit: 15, targetScore: 12, tokenMultiplier: 1.8, xpMultiplier: 1.8 },
    { level: 5, timeLimit: 10, targetScore: 15, tokenMultiplier: 2, xpMultiplier: 2 }
  ]
};

export const ACHIEVEMENTS = {
  'first-victory': { id: 'first-victory', nameEs: 'Primera Victoria', nameEn: 'First Victory', tokens: 10 },
  'law-master': { id: 'law-master', nameEs: 'Maestro Legal', nameEn: 'Law Master', tokens: 50 },
  'arcade-champion': { id: 'arcade-champion', nameEs: 'Campeón Arcade', nameEn: 'Arcade Champion', tokens: 50 },
  'perfect-score': { id: 'perfect-score', nameEs: 'Puntuación Perfecta', nameEn: 'Perfect Score', tokens: 100 },
  'speedrunner': { id: 'speedrunner', nameEs: 'Corredor Rápido', nameEn: 'Speedrunner', tokens: 75 },
  'all-games-master': { id: 'all-games-master', nameEs: 'Maestro de Todos', nameEn: 'Master of All', tokens: 200 }
};

export function calculateTokenReward(gameId: string, level: number, score: number, maxScore: number): number {
  const gameConfig = GAMES_CONFIG[gameId];
  const levelConfig = LEVEL_CONFIGS[gameId]?.[level - 1];
  
  if (!gameConfig || !levelConfig) return 0;
  
  const baseReward = gameConfig.baseTokenReward * levelConfig.tokenMultiplier;
  const scoreMultiplier = (score / maxScore) * 1.5; // Bonus for high scores
  
  return Math.floor(baseReward * scoreMultiplier);
}

export function calculateXPReward(gameId: string, level: number, score: number, maxScore: number): number {
  const gameConfig = GAMES_CONFIG[gameId];
  const levelConfig = LEVEL_CONFIGS[gameId]?.[level - 1];
  
  if (!gameConfig || !levelConfig) return 0;
  
  const baseReward = gameConfig.baseXPReward * levelConfig.xpMultiplier;
  const scoreMultiplier = (score / maxScore) * 1.5;
  
  return Math.floor(baseReward * scoreMultiplier);
}
