// Configuración extendida de juegos con más opciones y contexto legal

export interface GameConfigExtended {
  id: string;
  nameEs: string;
  nameEn: string;
  descriptionEs: string;
  descriptionEn: string;
  icon: string;
  category: 'legal' | 'arcade' | 'puzzle' | 'strategy' | 'cards' | 'casual';
  minLevel: number;
  maxLevel: number;
  baseTokenReward: number;
  baseXPReward: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  enabled: boolean;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export const EXTENDED_GAMES_CONFIG: Record<string, GameConfigExtended> = {
  'law-trial': {
    id: 'law-trial',
    nameEs: 'Juicio Legal',
    nameEn: 'Law Trial',
    descriptionEs: 'Resuelve casos legales complejos aplicando principios de justicia',
    descriptionEn: 'Resolve complex legal cases applying justice principles',
    icon: '⚖️',
    category: 'legal',
    minLevel: 1,
    maxLevel: 10,
    baseTokenReward: 50,
    baseXPReward: 100,
    difficulty: 'medium',
    enabled: true,
    colorScheme: {
      primary: 'from-blue-600 to-blue-400',
      secondary: 'from-blue-500/20 to-blue-400/20',
      accent: 'text-blue-400'
    }
  },
  'candy-crush-legal': {
    id: 'candy-crush-legal',
    nameEs: 'Candy Crush Legal',
    nameEn: 'Candy Crush Legal',
    descriptionEs: 'Elimina caramelos legales en este juego adictivo de match-3',
    descriptionEn: 'Eliminate legal candies in this addictive match-3 game',
    icon: '🍬',
    category: 'casual',
    minLevel: 1,
    maxLevel: 50,
    baseTokenReward: 30,
    baseXPReward: 60,
    difficulty: 'easy',
    enabled: true,
    colorScheme: {
      primary: 'from-pink-600 to-purple-400',
      secondary: 'from-pink-500/20 to-purple-400/20',
      accent: 'text-pink-400'
    }
  },
  'space-defenders': {
    id: 'space-defenders',
    nameEs: 'Defensores del Espacio',
    nameEn: 'Space Defenders',
    descriptionEs: 'Defiende tu nave de enemigos en el espacio infinito',
    descriptionEn: 'Defend your ship from enemies in infinite space',
    icon: '🛸',
    category: 'arcade',
    minLevel: 1,
    maxLevel: 20,
    baseTokenReward: 40,
    baseXPReward: 80,
    difficulty: 'medium',
    enabled: true,
    colorScheme: {
      primary: 'from-cyan-600 to-blue-400',
      secondary: 'from-cyan-500/20 to-blue-400/20',
      accent: 'text-cyan-400'
    }
  },
  'poker-legal': {
    id: 'poker-legal',
    nameEs: 'Póker Legal',
    nameEn: 'Legal Poker',
    descriptionEs: 'Juega póker con términos y conceptos legales',
    descriptionEn: 'Play poker with legal terms and concepts',
    icon: '🃏',
    category: 'cards',
    minLevel: 1,
    maxLevel: 15,
    baseTokenReward: 60,
    baseXPReward: 120,
    difficulty: 'hard',
    enabled: true,
    colorScheme: {
      primary: 'from-red-600 to-orange-400',
      secondary: 'from-red-500/20 to-orange-400/20',
      accent: 'text-red-400'
    }
  },
  'parchis-legal': {
    id: 'parchis-legal',
    nameEs: 'Parchís Legal',
    nameEn: 'Legal Parchís',
    descriptionEs: 'Clásico juego de tablero con reglas legales',
    descriptionEn: 'Classic board game with legal rules',
    icon: '🎲',
    category: 'strategy',
    minLevel: 1,
    maxLevel: 10,
    baseTokenReward: 45,
    baseXPReward: 90,
    difficulty: 'medium',
    enabled: true,
    colorScheme: {
      primary: 'from-yellow-600 to-orange-400',
      secondary: 'from-yellow-500/20 to-orange-400/20',
      accent: 'text-yellow-400'
    }
  },
  'tetris-legal': {
    id: 'tetris-legal',
    nameEs: 'Tetris Legal',
    nameEn: 'Legal Tetris',
    descriptionEs: 'Puzzle clásico con términos legales',
    descriptionEn: 'Classic puzzle with legal terms',
    icon: '🧩',
    category: 'puzzle',
    minLevel: 1,
    maxLevel: 30,
    baseTokenReward: 35,
    baseXPReward: 70,
    difficulty: 'easy',
    enabled: true,
    colorScheme: {
      primary: 'from-green-600 to-emerald-400',
      secondary: 'from-green-500/20 to-emerald-400/20',
      accent: 'text-green-400'
    }
  },
  'memory-legal': {
    id: 'memory-legal',
    nameEs: 'Memoria Legal',
    nameEn: 'Legal Memory',
    descriptionEs: 'Juego de memoria con conceptos legales',
    descriptionEn: 'Memory game with legal concepts',
    icon: '🧠',
    category: 'puzzle',
    minLevel: 1,
    maxLevel: 20,
    baseTokenReward: 30,
    baseXPReward: 60,
    difficulty: 'easy',
    enabled: true,
    colorScheme: {
      primary: 'from-purple-600 to-pink-400',
      secondary: 'from-purple-500/20 to-pink-400/20',
      accent: 'text-purple-400'
    }
  },
  'chess-legal': {
    id: 'chess-legal',
    nameEs: 'Ajedrez Legal',
    nameEn: 'Legal Chess',
    descriptionEs: 'Ajedrez estratégico con contexto legal',
    descriptionEn: 'Strategic chess with legal context',
    icon: '♟️',
    category: 'strategy',
    minLevel: 1,
    maxLevel: 15,
    baseTokenReward: 65,
    baseXPReward: 130,
    difficulty: 'hard',
    enabled: true,
    colorScheme: {
      primary: 'from-slate-600 to-gray-400',
      secondary: 'from-slate-500/20 to-gray-400/20',
      accent: 'text-slate-400'
    }
  },
  'checkers-legal': {
    id: 'checkers-legal',
    nameEs: 'Damas Legales',
    nameEn: 'Legal Checkers',
    descriptionEs: 'Damas clásicas con mecánicas legales',
    descriptionEn: 'Classic checkers with legal mechanics',
    icon: '⚫',
    category: 'strategy',
    minLevel: 1,
    maxLevel: 12,
    baseTokenReward: 50,
    baseXPReward: 100,
    difficulty: 'medium',
    enabled: true,
    colorScheme: {
      primary: 'from-indigo-600 to-blue-400',
      secondary: 'from-indigo-500/20 to-blue-400/20',
      accent: 'text-indigo-400'
    }
  },
  'trivia-legal': {
    id: 'trivia-legal',
    nameEs: '¿Quién Quiere Ser Abogado?',
    nameEn: 'Who Wants to Be a Lawyer?',
    descriptionEs: 'Trivia legal con preguntas progresivas',
    descriptionEn: 'Legal trivia with progressive questions',
    icon: '🎓',
    category: 'legal',
    minLevel: 1,
    maxLevel: 20,
    baseTokenReward: 45,
    baseXPReward: 90,
    difficulty: 'medium',
    enabled: true,
    colorScheme: {
      primary: 'from-teal-600 to-cyan-400',
      secondary: 'from-teal-500/20 to-cyan-400/20',
      accent: 'text-teal-400'
    }
  },
  'contract-builder': {
    id: 'contract-builder',
    nameEs: 'Constructor de Contratos',
    nameEn: 'Contract Builder',
    descriptionEs: 'Construye contratos legales válidos',
    descriptionEn: 'Build valid legal contracts',
    icon: '📋',
    category: 'legal',
    minLevel: 1,
    maxLevel: 10,
    baseTokenReward: 60,
    baseXPReward: 120,
    difficulty: 'hard',
    enabled: true,
    colorScheme: {
      primary: 'from-amber-600 to-yellow-400',
      secondary: 'from-amber-500/20 to-yellow-400/20',
      accent: 'text-amber-400'
    }
  }
};

// Paleta de colores profesional para diseño cristal
export const COLOR_PALETTE = {
  primary: {
    light: 'from-blue-500 to-cyan-400',
    dark: 'from-blue-900 to-blue-700',
    glass: 'from-blue-500/20 to-cyan-400/20'
  },
  secondary: {
    light: 'from-purple-500 to-pink-400',
    dark: 'from-purple-900 to-purple-700',
    glass: 'from-purple-500/20 to-pink-400/20'
  },
  accent: {
    success: 'from-green-500 to-emerald-400',
    warning: 'from-yellow-500 to-orange-400',
    danger: 'from-red-500 to-pink-400',
    info: 'from-blue-500 to-cyan-400'
  },
  neutral: {
    light: 'from-slate-100 to-gray-100',
    dark: 'from-slate-900 to-slate-800',
    glass: 'from-white/10 to-white/5'
  }
};

// Temas por categoría
export const CATEGORY_THEMES = {
  legal: {
    bg: 'from-blue-950 via-blue-900 to-slate-950',
    border: 'border-blue-400/30',
    text: 'text-blue-300',
    accent: 'text-blue-400'
  },
  arcade: {
    bg: 'from-cyan-950 via-blue-900 to-slate-950',
    border: 'border-cyan-400/30',
    text: 'text-cyan-300',
    accent: 'text-cyan-400'
  },
  puzzle: {
    bg: 'from-purple-950 via-purple-900 to-slate-950',
    border: 'border-purple-400/30',
    text: 'text-purple-300',
    accent: 'text-purple-400'
  },
  strategy: {
    bg: 'from-indigo-950 via-indigo-900 to-slate-950',
    border: 'border-indigo-400/30',
    text: 'text-indigo-300',
    accent: 'text-indigo-400'
  },
  cards: {
    bg: 'from-red-950 via-orange-900 to-slate-950',
    border: 'border-red-400/30',
    text: 'text-red-300',
    accent: 'text-red-400'
  },
  casual: {
    bg: 'from-pink-950 via-purple-900 to-slate-950',
    border: 'border-pink-400/30',
    text: 'text-pink-300',
    accent: 'text-pink-400'
  }
};

export default EXTENDED_GAMES_CONFIG;
