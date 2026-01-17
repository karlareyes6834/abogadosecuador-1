import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, ShoppingCart, Trophy, Zap, ArrowRight } from 'lucide-react';
import GamesHubProfessional from '../components/GamesHubProfessional';
import GameStoreIntegrado from '../components/GameStoreIntegrado';

type Vista = 'inicio' | 'juegos' | 'tienda' | 'estadisticas';

export const GamesIntegrationPage: React.FC = () => {
  const [vistaActual, setVistaActual] = useState<Vista>('inicio');

  const renderizarVista = () => {
    switch (vistaActual) {
      case 'juegos':
        return <GamesHubProfessional />;
      case 'tienda':
        return <GameStoreIntegrado />;
      case 'estadisticas':
        return <EstadisticasView />;
      default:
        return <VistaInicio onNavegar={setVistaActual} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* Navegación */}
      <nav className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Gamepad2 className="w-6 h-6 text-blue-400" />
            <h1 className="text-xl font-bold text-white">Centro de Juegos Profesional</h1>
          </div>
          <div className="flex gap-2">
            {(['inicio', 'juegos', 'tienda', 'estadisticas'] as Vista[]).map(vista => (
              <button
                key={vista}
                onClick={() => setVistaActual(vista)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  vistaActual === vista
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {vista === 'inicio' && '🏠 Inicio'}
                {vista === 'juegos' && '🎮 Juegos'}
                {vista === 'tienda' && '🛒 Tienda'}
                {vista === 'estadisticas' && '📊 Estadísticas'}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Contenido */}
      <AnimatePresence mode="wait">
        <motion.div
          key={vistaActual}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderizarVista()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const VistaInicio: React.FC<{ onNavegar: (vista: Vista) => void }> = ({ onNavegar }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-4 md:p-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto mb-12"
      >
        <div className="backdrop-blur-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/20 rounded-3xl p-8 md:p-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Plataforma de Juegos Profesional
          </h1>
          <p className="text-xl text-slate-300 mb-8">
            Juega, aprende y gana tokens en una plataforma integrada con servicios legales
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavegar('juegos')}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all flex items-center justify-center gap-2"
            >
              <Gamepad2 className="w-5 h-5" />
              Explorar Juegos
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => onNavegar('tienda')}
              className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-emerald-500/50 transition-all flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Comprar Tokens
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Características */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          {
            icono: '🎮',
            titulo: 'Juegos Variados',
            descripcion: 'Arcade, puzzles, estrategia y juegos legales educativos'
          },
          {
            icono: '💎',
            titulo: 'Sistema de Tokens',
            descripcion: 'Compra, vende y gana tokens jugando y completando desafíos'
          },
          {
            icono: '🏆',
            titulo: 'Logros y Recompensas',
            descripcion: 'Desbloquea logros, sube de nivel y obtén recompensas exclusivas'
          }
        ].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 hover:border-blue-400/50 transition-all"
          >
            <div className="text-4xl mb-4">{feature.icono}</div>
            <h3 className="text-xl font-bold text-white mb-2">{feature.titulo}</h3>
            <p className="text-slate-300">{feature.descripcion}</p>
          </motion.div>
        ))}
      </div>

      {/* Estadísticas rápidas */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Juegos Disponibles', valor: '8+' },
          { label: 'Jugadores Activos', valor: '1000+' },
          { label: 'Tokens en Circulación', valor: '50K+' },
          { label: 'Logros Desbloqueables', valor: '100+' }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-4 text-center"
          >
            <p className="text-2xl md:text-3xl font-bold text-blue-400 mb-2">{stat.valor}</p>
            <p className="text-sm text-slate-300">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const EstadisticasView: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-8">
            <Trophy className="w-8 h-8 text-yellow-400" />
            <h1 className="text-3xl font-bold text-white">Mis Estadísticas</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icono: '💎', label: 'Tokens Totales', valor: '1,250' },
              { icono: '⭐', label: 'Nivel', valor: '15' },
              { icono: '🎮', label: 'Juegos Comprados', valor: '6' },
              { icono: '🏆', label: 'Logros Desbloqueados', valor: '24' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="backdrop-blur-md bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/20 rounded-xl p-6 text-center"
              >
                <div className="text-4xl mb-3">{stat.icono}</div>
                <p className="text-slate-300 text-sm mb-2">{stat.label}</p>
                <p className="text-3xl font-bold text-white">{stat.valor}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Juegos Completados */}
            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-blue-400" />
                Juegos Completados
              </h3>
              <div className="space-y-3">
                {['Juicio Legal', 'Memoria Legal', 'Tetris Legal'].map((juego, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="text-slate-300">{juego}</span>
                    <span className="text-green-400 font-bold">✓</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Logros Recientes */}
            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Logros Recientes
              </h3>
              <div className="space-y-3">
                {['Primera Victoria', 'Maestro Legal', 'Speedrunner'].map((logro, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="text-slate-300">{logro}</span>
                    <span className="text-yellow-400 font-bold">⭐</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default GamesIntegrationPage;
