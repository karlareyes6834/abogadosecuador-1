import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Play, ShoppingCart, Menu, X, User } from 'lucide-react';

type Vista = 'hub' | 'juego' | 'tienda' | 'personaje';

interface Juego {
  id: string;
  nombre: string;
  icono: string;
  categoria: string;
  dificultad: string;
  precio: number;
  recompensa: number;
  niveles: number;
}

interface Personaje {
  id: string;
  nombre: string;
  icono: string;
  precio: number;
  bonus: number;
}

const JUEGOS: Juego[] = [
  { id: 'trivia', nombre: 'Trivia Legal', icono: '🎓', categoria: 'legal', dificultad: 'media', precio: 10, recompensa: 50, niveles: 10 },
  { id: 'memoria', nombre: 'Memoria Legal', icono: '🧠', categoria: 'puzzle', dificultad: 'fácil', precio: 5, recompensa: 30, niveles: 8 },
  { id: 'sopa', nombre: 'Sopa de Letras', icono: '🔤', categoria: 'puzzle', dificultad: 'media', precio: 8, recompensa: 40, niveles: 12 },
  { id: 'ladrillos', nombre: 'Rompe Ladrillos', icono: '🧱', categoria: 'arcade', dificultad: 'media', precio: 10, recompensa: 45, niveles: 15 },
  { id: 'naves', nombre: 'Defensor Espacial', icono: '🛸', categoria: 'arcade', dificultad: 'difícil', precio: 15, recompensa: 60, niveles: 20 },
  { id: 'ajedrez', nombre: 'Ajedrez Legal', icono: '♟️', categoria: 'estrategia', dificultad: 'difícil', precio: 20, recompensa: 80, niveles: 10 },
];

const PERSONAJES: Personaje[] = [
  { id: 'abogado', nombre: 'Abogado Profesional', icono: '👨‍⚖️', precio: 100, bonus: 10 },
  { id: 'juez', nombre: 'Juez Supremo', icono: '👨‍⚖️', precio: 150, bonus: 15 },
  { id: 'notario', nombre: 'Notario Experto', icono: '📝', precio: 120, bonus: 12 },
];

const GamesPage: React.FC = () => {
  const [vistaActual, setVistaActual] = useState<Vista>('hub');
  const [tokens, setTokens] = useState(1000);
  const [nivel, setNivel] = useState(5);
  const [juegoSeleccionado, setJuegoSeleccionado] = useState<Juego | null>(null);
  const [nivelActual, setNivelActual] = useState(1);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [personajeSeleccionado, setPersonajeSeleccionado] = useState('abogado');

  const jugarJuego = (juego: Juego) => {
    if (tokens < juego.precio) {
      alert('No tienes suficientes tokens');
      return;
    }
    setJuegoSeleccionado(juego);
    setNivelActual(1);
    setVistaActual('juego');
  };

  const finalizarJuego = (gano: boolean) => {
    if (gano) {
      const recompensa = juegoSeleccionado?.recompensa || 0;
      setTokens(tokens + recompensa);
      setNivel(nivel + 1);
    } else {
      setTokens(tokens - (juegoSeleccionado?.precio || 0));
    }
    setVistaActual('hub');
  };

  const comprarPersonaje = (personaje: Personaje) => {
    if (tokens < personaje.precio) {
      alert('No tienes suficientes tokens');
      return;
    }
    setTokens(tokens - personaje.precio);
    setPersonajeSeleccionado(personaje.id);
    alert(`¡Personaje ${personaje.nombre} desbloqueado!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* Header */}
      <motion.header className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Gamepad2 className="w-8 h-8 text-blue-400" />
            <h1 className="text-2xl font-bold text-white">Centro de Juegos</h1>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <div className="backdrop-blur-md bg-blue-500/20 border border-blue-400/30 rounded-lg px-4 py-2">
              <p className="text-sm text-slate-300">Tokens</p>
              <p className="text-2xl font-bold text-yellow-400">{tokens}</p>
            </div>
            <div className="backdrop-blur-md bg-purple-500/20 border border-purple-400/30 rounded-lg px-4 py-2">
              <p className="text-sm text-slate-300">Nivel</p>
              <p className="text-2xl font-bold text-purple-400">{nivel}</p>
            </div>
          </div>

          <button onClick={() => setMenuAbierto(!menuAbierto)} className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20">
            {menuAbierto ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.header>

      {/* Contenido Principal */}
      <AnimatePresence mode="wait">
        {vistaActual === 'hub' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto px-4 md:px-8 py-8">
            {/* Navegación */}
            <div className="flex flex-wrap gap-4 mb-8">
              {[
                { id: 'hub', label: '', icon: Gamepad2 },
                { id: 'tienda', label: '', icon: ShoppingCart },
                { id: 'personaje', label: '', icon: User }
              ].map(nav => (
                <button
                  key={nav.id}
                  onClick={() => setVistaActual(nav.id as Vista)}
                  className={`px-6 py-3 rounded-lg font-bold transition-all ${
                    vistaActual === nav.id
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50'
                      : 'backdrop-blur-md bg-white/10 border border-white/20 text-slate-300 hover:bg-white/20'
                  }`}
                >
                  {nav.label}
                </button>
              ))}
            </div>

            {/* Grid de Juegos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {JUEGOS.map(juego => (
                <motion.div
                  key={juego.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="backdrop-blur-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/20 rounded-2xl p-6 hover:border-blue-400/50 transition-all group cursor-pointer"
                  onClick={() => jugarJuego(juego)}
                >
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{juego.icono}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{juego.nombre}</h3>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-slate-300"> {juego.niveles} niveles</p>
                    <p className="text-sm text-slate-300"> Dificultad: {juego.dificultad}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-400 font-bold">{juego.precio} tokens</span>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all flex items-center gap-2">
                      <Play className="w-4 h-4" />
                      Jugar
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {vistaActual === 'tienda' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto px-4 md:px-8 py-8">
            <h2 className="text-3xl font-bold text-white mb-8">Tienda de Tokens</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { tokens: 100, precio: 4.99, desc: 0 },
                { tokens: 500, precio: 19.99, desc: 8 },
                { tokens: 1000, precio: 34.99, desc: 15 },
                { tokens: 2500, precio: 74.99, desc: 25 }
              ].map((paquete, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="backdrop-blur-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-white/20 rounded-2xl p-6 text-center"
                >
                  <p className="text-4xl font-bold text-white mb-2">{paquete.tokens}</p>
                  <p className="text-slate-300 mb-4">Tokens</p>
                  <p className="text-2xl font-bold text-yellow-400 mb-4">${paquete.precio}</p>
                  {paquete.desc > 0 && <p className="text-green-400 text-sm mb-4">Ahorra {paquete.desc}%</p>}
                  <button className="w-full px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all">
                    Comprar
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {vistaActual === 'personaje' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto px-4 md:px-8 py-8">
            <h2 className="text-3xl font-bold text-white mb-8">Personajes</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PERSONAJES.map(personaje => (
                <motion.div
                  key={personaje.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`backdrop-blur-xl border rounded-2xl p-6 text-center transition-all ${
                    personajeSeleccionado === personaje.id
                      ? 'bg-gradient-to-br from-yellow-500/30 to-orange-500/30 border-yellow-400/50'
                      : 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-white/20'
                  }`}
                >
                  <div className="text-6xl mb-4">{personaje.icono}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{personaje.nombre}</h3>
                  <p className="text-sm text-slate-300 mb-4">+{personaje.bonus}% Bonus</p>
                  {personajeSeleccionado === personaje.id ? (
                    <button className="w-full px-4 py-2 bg-green-500 text-white rounded-lg font-bold">
                      Seleccionado
                    </button>
                  ) : (
                    <button
                      onClick={() => comprarPersonaje(personaje)}
                      className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                    >
                      {personaje.precio} Tokens
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {vistaActual === 'juego' && juegoSeleccionado && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-4xl mx-auto px-4 md:px-8 py-8">
            <div className="backdrop-blur-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/20 rounded-2xl p-8">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">{juegoSeleccionado.icono}</div>
                <h2 className="text-3xl font-bold text-white mb-2">{juegoSeleccionado.nombre}</h2>
                <p className="text-slate-300">Nivel {nivelActual} de {juegoSeleccionado.niveles}</p>
              </div>

              <div className="bg-gradient-to-b from-slate-900 to-black rounded-lg p-8 mb-8 h-64 flex items-center justify-center">
                <p className="text-white text-center">Área de Juego - {juegoSeleccionado.nombre}</p>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => finalizarJuego(true)}
                  className="px-8 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-all"
                >
                  Ganaste
                </button>
                <button
                  onClick={() => finalizarJuego(false)}
                  className="px-8 py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-all"
                >
                  Perdiste
                </button>
                <button
                  onClick={() => setVistaActual('hub')}
                  className="px-8 py-3 bg-slate-600 text-white font-bold rounded-lg hover:bg-slate-700 transition-all"
                >
                  Salir
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GamesPage;