import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Coins, Play, ShoppingCart, Trophy, Zap } from 'lucide-react';

interface Juego {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
  categoria: 'legal' | 'arcade' | 'puzzle' | 'estrategia';
  dificultad: 'fácil' | 'medio' | 'difícil';
  precioTokens: number;
  recompensaTokens: number;
  recompensaXP: number;
  esPropiedad: boolean;
  puntuacionAlta: number;
}

const JUEGOS_DISPONIBLES: Juego[] = [
  {
    id: 'juicio-legal',
    nombre: 'Juicio Legal',
    descripcion: 'Resuelve casos legales complejos aplicando principios de justicia',
    icono: '⚖️',
    categoria: 'legal',
    dificultad: 'medio',
    precioTokens: 50,
    recompensaTokens: 50,
    recompensaXP: 100,
    esPropiedad: false,
    puntuacionAlta: 0
  },
  {
    id: 'defensor-espacio',
    nombre: 'Defensor del Espacio',
    descripcion: 'Arcade de acción con niveles progresivos y desafíos crecientes',
    icono: '🚀',
    categoria: 'arcade',
    dificultad: 'medio',
    precioTokens: 40,
    recompensaTokens: 40,
    recompensaXP: 80,
    esPropiedad: false,
    puntuacionAlta: 0
  },
  {
    id: 'tetris-legal',
    nombre: 'Tetris Legal',
    descripcion: 'Puzzle con términos legales y mecánicas clásicas',
    icono: '🧩',
    categoria: 'puzzle',
    dificultad: 'fácil',
    precioTokens: 35,
    recompensaTokens: 35,
    recompensaXP: 70,
    esPropiedad: false,
    puntuacionAlta: 0
  },
  {
    id: 'quien-quiere-ser-abogado',
    nombre: '¿Quién Quiere Ser Abogado?',
    descripcion: 'Trivia legal con preguntas de dificultad creciente',
    icono: '🎓',
    categoria: 'legal',
    dificultad: 'medio',
    precioTokens: 45,
    recompensaTokens: 45,
    recompensaXP: 90,
    esPropiedad: false,
    puntuacionAlta: 0
  },
  {
    id: 'constructor-contratos',
    nombre: 'Constructor de Contratos',
    descripcion: 'Construye contratos legales válidos siguiendo reglas profesionales',
    icono: '📋',
    categoria: 'estrategia',
    dificultad: 'difícil',
    precioTokens: 60,
    recompensaTokens: 60,
    recompensaXP: 120,
    esPropiedad: false,
    puntuacionAlta: 0
  },
  {
    id: 'memoria-legal',
    nombre: 'Memoria Legal',
    descripcion: 'Juego de memoria con términos y conceptos legales',
    icono: '🧠',
    categoria: 'puzzle',
    dificultad: 'fácil',
    precioTokens: 30,
    recompensaTokens: 30,
    recompensaXP: 60,
    esPropiedad: false,
    puntuacionAlta: 0
  },
  {
    id: 'ajedrez-legal',
    nombre: 'Ajedrez Legal',
    descripcion: 'Ajedrez estratégico con contexto legal profesional',
    icono: '♟️',
    categoria: 'estrategia',
    dificultad: 'difícil',
    precioTokens: 65,
    recompensaTokens: 65,
    recompensaXP: 130,
    esPropiedad: false,
    puntuacionAlta: 0
  },
  {
    id: 'damas-legales',
    nombre: 'Damas Legales',
    descripcion: 'Damas clásicas con mecánicas legales',
    icono: '⚫',
    categoria: 'estrategia',
    dificultad: 'medio',
    precioTokens: 50,
    recompensaTokens: 50,
    recompensaXP: 100,
    esPropiedad: false,
    puntuacionAlta: 0
  }
];

type Filtro = 'todos' | 'legal' | 'arcade' | 'puzzle' | 'estrategia' | 'propiedad';

export const GamesHubProfessional: React.FC = () => {
  const [juegos, setJuegos] = useState<Juego[]>(JUEGOS_DISPONIBLES);
  const [tokensUsuario, setTokensUsuario] = useState(0);
  const [filtroActual, setFiltroActual] = useState<Filtro>('todos');
  const [cargando, setCargando] = useState(true);
  const [nivelUsuario, setNivelUsuario] = useState(1);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      // Cargar datos de demostración
      setTokensUsuario(1000);
      setNivelUsuario(5);
      setJuegos(JUEGOS_DISPONIBLES);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setCargando(false);
    }
  };

  const juegosFiltrados = juegos.filter(juego => {
    if (filtroActual === 'propiedad') return juego.esPropiedad;
    if (filtroActual === 'todos') return true;
    return juego.categoria === filtroActual;
  });

  const comprarJuego = async (juego: Juego) => {
    if (tokensUsuario < juego.precioTokens) {
      alert(`No tienes suficientes tokens. Necesitas ${juego.precioTokens} tokens`);
      return;
    }

    try {
      setTokensUsuario(tokensUsuario - juego.precioTokens);
      setJuegos(juegos.map((j: Juego) => 
        j.id === juego.id ? { ...j, esPropiedad: true } : j
      ));

      alert(`¡Juego "${juego.nombre}" comprado exitosamente!`);
    } catch (error) {
      console.error('Error comprando juego:', error);
      alert('Error al comprar el juego');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-4 md:p-8">
      {/* Header con diseño cristal */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <Gamepad2 className="w-8 h-8 text-blue-400" />
                Centro de Juegos
              </h1>
              <p className="text-slate-300">Plataforma profesional de juegos legales</p>
            </div>
            <div className="flex gap-4">
              <div className="backdrop-blur-md bg-blue-500/20 border border-blue-400/30 rounded-xl p-4">
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-yellow-400" />
                  <span className="text-white font-bold">{tokensUsuario}</span>
                  <span className="text-slate-300">Tokens</span>
                </div>
              </div>
              <div className="backdrop-blur-md bg-purple-500/20 border border-purple-400/30 rounded-xl p-4">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-purple-400" />
                  <span className="text-white font-bold">Nivel {nivelUsuario}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filtros */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-8 flex flex-wrap gap-3"
      >
        {(['todos', 'legal', 'arcade', 'puzzle', 'estrategia', 'propiedad'] as Filtro[]).map(filtro => (
          <button
            key={filtro}
            onClick={() => setFiltroActual(filtro)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filtroActual === filtro
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50'
                : 'backdrop-blur-md bg-white/10 border border-white/20 text-slate-300 hover:bg-white/20'
            }`}
          >
            {filtro === 'todos' && 'Todos'}
            {filtro === 'legal' && '⚖️ Legal'}
            {filtro === 'arcade' && '🎮 Arcade'}
            {filtro === 'puzzle' && '🧩 Puzzle'}
            {filtro === 'estrategia' && '♟️ Estrategia'}
            {filtro === 'propiedad' && '🎁 Mis Juegos'}
          </button>
        ))}
      </motion.div>

      {/* Grid de juegos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {juegosFiltrados.map((juego, index) => (
            <motion.div
              key={juego.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              className="group"
            >
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl overflow-hidden hover:border-blue-400/50 transition-all duration-300 h-full flex flex-col shadow-xl hover:shadow-2xl hover:shadow-blue-500/20">
                {/* Encabezado del juego */}
                <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-4 border-b border-white/10">
                  <div className="text-4xl mb-2">{juego.icono}</div>
                  <h3 className="text-lg font-bold text-white">{juego.nombre}</h3>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs px-2 py-1 rounded bg-blue-500/30 text-blue-200">
                      {juego.categoria}
                    </span>
                    <span className="text-xs px-2 py-1 rounded bg-yellow-500/30 text-yellow-200">
                      {juego.dificultad}
                    </span>
                  </div>
                </div>

                {/* Descripción */}
                <div className="p-4 flex-1">
                  <p className="text-sm text-slate-300 mb-4">{juego.descripcion}</p>

                  {/* Recompensas */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Coins className="w-4 h-4 text-yellow-400" />
                      <span className="text-slate-300">
                        Recompensa: <span className="text-yellow-400 font-bold">{juego.recompensaTokens}</span> tokens
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Zap className="w-4 h-4 text-purple-400" />
                      <span className="text-slate-300">
                        XP: <span className="text-purple-400 font-bold">{juego.recompensaXP}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Botón de acción */}
                <div className="p-4 border-t border-white/10">
                  {juego.esPropiedad ? (
                    <button
                      onClick={() => alert(`Juego: ${juego.nombre} - Próximamente disponible para jugar`)}
                      className="w-full py-2 px-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-green-500/50 transition-all flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      Jugar Ahora
                    </button>
                  ) : (
                    <button
                      onClick={() => comprarJuego(juego)}
                      className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Comprar {juego.precioTokens} tokens
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Estado de carga */}
      {cargando && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Sin resultados */}
      {!cargando && juegosFiltrados.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-400 text-lg">No hay juegos disponibles en esta categoría</p>
        </div>
      )}
    </div>
  );
};

export default GamesHubProfessional;
