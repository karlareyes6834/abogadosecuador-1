import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';

interface JuegosClasicosProps {
  juegoId: string;
  nombre: string;
  icono: string;
  nivelActual: number;
  totalNiveles: number;
  onAvanzarNivel: () => void;
  onPerder: () => void;
  onVolver: () => void;
  tokens: number;
  onTokensChange: (tokens: number) => void;
}

// Space Invaders Game
const SpaceInvadersGame: React.FC<{ nivel: number; onGanar: () => void; onPerder: () => void }> = ({ nivel, onGanar, onPerder }) => {
  const [posicionJugador, setPosicionJugador] = useState(50);
  const [enemigos, setEnemigos] = useState(Array.from({ length: 3 + nivel }, (_, i) => ({ id: i, x: Math.random() * 80, y: i * 15 })));
  const [disparos, setDisparos] = useState<{ id: number; x: number; y: number }[]>([]);
  const [puntos, setPuntos] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setEnemigos(prev => prev.map(e => ({ ...e, y: e.y + 2 })).filter(e => e.y < 100));
      setDisparos(prev => prev.map(d => ({ ...d, y: d.y - 5 })).filter(d => d.y > 0));

      // Verificar colisiones
      setDisparos(prev => {
        let nuevosDisparos = [...prev];
        let nuevosEnemigos = [...enemigos];
        
        nuevosDisparos.forEach(disparo => {
          nuevosEnemigos = nuevosEnemigos.filter(enemigo => {
            if (Math.abs(disparo.x - enemigo.x) < 5 && Math.abs(disparo.y - enemigo.y) < 5) {
              setPuntos(p => p + 10);
              return false;
            }
            return true;
          });
        });
        
        setEnemigos(nuevosEnemigos);
        return nuevosDisparos;
      });

      if (enemigos.some(e => e.y > 100)) {
        setGameOver(true);
        onPerder();
      }
      if (enemigos.length === 0) {
        onGanar();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [enemigos]);

  const disparar = () => {
    setDisparos(prev => [...prev, { id: Date.now(), x: posicionJugador, y: 85 }]);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setPosicionJugador(p => Math.max(5, p - 5));
      if (e.key === 'ArrowRight') setPosicionJugador(p => Math.min(95, p + 5));
      if (e.key === ' ') disparar();
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="p-8 space-y-4">
      <div className="bg-black rounded-lg p-4 h-80 relative overflow-hidden border-2 border-cyan-500">
        {/* Enemigos */}
        {enemigos.map(enemigo => (
          <div
            key={enemigo.id}
            className="absolute w-6 h-6 bg-red-500 rounded"
            style={{ left: `${enemigo.x}%`, top: `${enemigo.y}%` }}
          >
            👾
          </div>
        ))}

        {/* Disparos */}
        {disparos.map(disparo => (
          <div
            key={disparo.id}
            className="absolute w-1 h-4 bg-yellow-400"
            style={{ left: `${disparo.x}%`, top: `${disparo.y}%` }}
          ></div>
        ))}

        {/* Jugador */}
        <div
          className="absolute bottom-2 w-8 h-8 bg-cyan-500 rounded transition-all"
          style={{ left: `${posicionJugador}%`, transform: 'translateX(-50%)' }}
        >
          🚀
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-100 rounded p-3 text-center">
          <p className="text-sm text-slate-700">Puntos</p>
          <p className="text-2xl font-bold text-blue-600">{puntos}</p>
        </div>
        <div className="bg-green-100 rounded p-3 text-center">
          <p className="text-sm text-slate-700">Enemigos</p>
          <p className="text-2xl font-bold text-green-600">{enemigos.length}</p>
        </div>
        <div className="bg-red-100 rounded p-3 text-center">
          <p className="text-sm text-slate-700">Estado</p>
          <p className="text-2xl font-bold text-red-600">{gameOver ? 'Game Over' : 'Activo'}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setPosicionJugador(p => Math.max(5, p - 10))} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700">
          ← Izquierda
        </button>
        <button onClick={disparar} className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded font-bold hover:bg-yellow-700">
          🔫 Disparar
        </button>
        <button onClick={() => setPosicionJugador(p => Math.min(95, p + 10))} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700">
          Derecha →
        </button>
      </div>

      <p className="text-xs text-slate-600 text-center">Usa flechas o botones para moverte, ESPACIO o botón para disparar</p>
    </div>
  );
};

// Snake Game Profesional
const SnakeProfesionalGame: React.FC<{ nivel: number; onGanar: () => void; onPerder: () => void }> = ({ nivel, onGanar, onPerder }) => {
  const [serpiente, setSerpiente] = useState([{ x: 50, y: 50 }]);
  const [comida, setComida] = useState({ x: Math.random() * 100, y: Math.random() * 100 });
  const [direccion, setDireccion] = useState({ x: 1, y: 0 });
  const [puntos, setPuntos] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSerpiente(prev => {
        const cabeza = prev[0];
        const nuevaCabeza = {
          x: (cabeza.x + direccion.x * 5 + 100) % 100,
          y: (cabeza.y + direccion.y * 5 + 100) % 100,
        };

        // Verificar colisión con comida
        if (Math.abs(nuevaCabeza.x - comida.x) < 5 && Math.abs(nuevaCabeza.y - comida.y) < 5) {
          setPuntos(p => p + 10);
          setComida({ x: Math.random() * 100, y: Math.random() * 100 });
          return [nuevaCabeza, ...prev];
        }

        // Verificar colisión con sí misma
        if (prev.some(seg => Math.abs(seg.x - nuevaCabeza.x) < 2 && Math.abs(seg.y - nuevaCabeza.y) < 2)) {
          setGameOver(true);
          onPerder();
          return prev;
        }

        if (puntos >= 100) {
          onGanar();
        }

        return [nuevaCabeza, ...prev.slice(0, -1)];
      });
    }, 150 - nivel * 5);

    return () => clearInterval(interval);
  }, [direccion, comida, puntos, nivel]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' && direccion.y === 0) setDireccion({ x: 0, y: -1 });
      if (e.key === 'ArrowDown' && direccion.y === 0) setDireccion({ x: 0, y: 1 });
      if (e.key === 'ArrowLeft' && direccion.x === 0) setDireccion({ x: -1, y: 0 });
      if (e.key === 'ArrowRight' && direccion.x === 0) setDireccion({ x: 1, y: 0 });
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direccion]);

  return (
    <div className="p-8 space-y-4">
      <div className="bg-black rounded-lg p-2 h-80 relative overflow-hidden border-2 border-green-500">
        {/* Serpiente */}
        {serpiente.map((seg, i) => (
          <div
            key={i}
            className={`absolute w-4 h-4 rounded transition-all ${i === 0 ? 'bg-green-500' : 'bg-green-400'}`}
            style={{ left: `${seg.x}%`, top: `${seg.y}%` }}
          ></div>
        ))}

        {/* Comida */}
        <div
          className="absolute w-4 h-4 bg-red-500 rounded"
          style={{ left: `${comida.x}%`, top: `${comida.y}%` }}
        >
          🍎
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-100 rounded p-3 text-center">
          <p className="text-sm text-slate-700">Puntos</p>
          <p className="text-2xl font-bold text-green-600">{puntos}</p>
        </div>
        <div className="bg-blue-100 rounded p-3 text-center">
          <p className="text-sm text-slate-700">Longitud</p>
          <p className="text-2xl font-bold text-blue-600">{serpiente.length}</p>
        </div>
        <div className="bg-red-100 rounded p-3 text-center">
          <p className="text-sm text-slate-700">Estado</p>
          <p className="text-2xl font-bold text-red-600">{gameOver ? 'Game Over' : 'Activo'}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div></div>
        <button onClick={() => setDireccion({ x: 0, y: -1 })} className="px-4 py-2 bg-green-600 text-white rounded font-bold hover:bg-green-700">
          ↑
        </button>
        <div></div>
        <button onClick={() => setDireccion({ x: -1, y: 0 })} className="px-4 py-2 bg-green-600 text-white rounded font-bold hover:bg-green-700">
          ←
        </button>
        <button onClick={() => setDireccion({ x: 0, y: 1 })} className="px-4 py-2 bg-green-600 text-white rounded font-bold hover:bg-green-700">
          ↓
        </button>
        <button onClick={() => setDireccion({ x: 1, y: 0 })} className="px-4 py-2 bg-green-600 text-white rounded font-bold hover:bg-green-700">
          →
        </button>
      </div>

      <p className="text-xs text-slate-600 text-center">Usa flechas para moverte, come manzanas para crecer</p>
    </div>
  );
};

// Breakout Game
const BreakoutGame: React.FC<{ nivel: number; onGanar: () => void; onPerder: () => void }> = ({ nivel, onGanar, onPerder }) => {
  const [posicionPala, setPosicionPala] = useState(50);
  const [bolaPosicion, setBolaPosicion] = useState({ x: 50, y: 80 });
  const [bolaVelocidad, setBolaVelocidad] = useState({ x: 2, y: -2 });
  const [bloques, setBloques] = useState(
    Array.from({ length: 12 + nivel * 2 }, (_, i) => ({ id: i, x: (i % 6) * 16.67, y: Math.floor(i / 6) * 10, activo: true }))
  );
  const [puntos, setPuntos] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBolaPosicion(prev => {
        let nuevaX = prev.x + bolaVelocidad.x;
        let nuevaY = prev.y + bolaVelocidad.y;
        let nuevaVelocidad = { ...bolaVelocidad };

        // Colisión con paredes
        if (nuevaX < 0 || nuevaX > 100) nuevaVelocidad.x *= -1;
        if (nuevaY < 0) nuevaVelocidad.y *= -1;

        // Colisión con pala
        if (nuevaY > 85 && nuevaX > posicionPala - 5 && nuevaX < posicionPala + 5) {
          nuevaVelocidad.y *= -1;
        }

        // Colisión con bloques
        setBloques(prev => {
          let bloquesActualizados = [...prev];
          bloquesActualizados.forEach(bloque => {
            if (bloque.activo && nuevaX > bloque.x && nuevaX < bloque.x + 16.67 && nuevaY > bloque.y && nuevaY < bloque.y + 10) {
              bloque.activo = false;
              nuevaVelocidad.y *= -1;
              setPuntos(p => p + 10);
            }
          });
          return bloquesActualizados;
        });

        if (nuevaY > 100) {
          onPerder();
        }

        setBolaVelocidad(nuevaVelocidad);
        return { x: Math.max(0, Math.min(100, nuevaX)), y: Math.max(0, Math.min(100, nuevaY)) };
      });

      if (bloques.every(b => !b.activo)) {
        onGanar();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [bolaVelocidad, posicionPala, bloques]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setPosicionPala(p => Math.max(0, p - 5));
      if (e.key === 'ArrowRight') setPosicionPala(p => Math.min(100, p + 5));
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="p-8 space-y-4">
      <div className="bg-black rounded-lg p-2 h-80 relative overflow-hidden border-2 border-yellow-500">
        {/* Bloques */}
        {bloques.map(bloque => (
          bloque.activo && (
            <div
              key={bloque.id}
              className="absolute bg-yellow-500 rounded"
              style={{ left: `${bloque.x}%`, top: `${bloque.y}%`, width: '16.67%', height: '10%' }}
            ></div>
          )
        ))}

        {/* Bola */}
        <div
          className="absolute w-3 h-3 bg-white rounded-full"
          style={{ left: `${bolaPosicion.x}%`, top: `${bolaPosicion.y}%` }}
        ></div>

        {/* Pala */}
        <div
          className="absolute bottom-1 w-12 h-2 bg-cyan-500 rounded transition-all"
          style={{ left: `${posicionPala}%`, transform: 'translateX(-50%)' }}
        ></div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-yellow-100 rounded p-3 text-center">
          <p className="text-sm text-slate-700">Puntos</p>
          <p className="text-2xl font-bold text-yellow-600">{puntos}</p>
        </div>
        <div className="bg-blue-100 rounded p-3 text-center">
          <p className="text-sm text-slate-700">Bloques</p>
          <p className="text-2xl font-bold text-blue-600">{bloques.filter(b => b.activo).length}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setPosicionPala(p => Math.max(0, p - 10))} className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded font-bold hover:bg-cyan-700">
          ← Izquierda
        </button>
        <button onClick={() => setPosicionPala(p => Math.min(100, p + 10))} className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded font-bold hover:bg-cyan-700">
          Derecha →
        </button>
      </div>

      <p className="text-xs text-slate-600 text-center">Usa flechas para mover la pala, rompe todos los bloques</p>
    </div>
  );
};

// Componente Principal
export const JuegosClasicos: React.FC<JuegosClasicosProps> = ({
  juegoId,
  nombre,
  icono,
  nivelActual,
  totalNiveles,
  onAvanzarNivel,
  onPerder,
  onVolver,
  tokens,
  onTokensChange,
}) => {
  const [resultado, setResultado] = useState<'ganando' | 'perdiendo' | null>(null);

  const renderizarJuego = () => {
    switch (juegoId) {
      case 'naves':
        return (
          <SpaceInvadersGame
            nivel={nivelActual}
            onGanar={() => setResultado('ganando')}
            onPerder={() => setResultado('perdiendo')}
          />
        );
      case 'snake':
        return (
          <SnakeProfesionalGame
            nivel={nivelActual}
            onGanar={() => setResultado('ganando')}
            onPerder={() => setResultado('perdiendo')}
          />
        );
      case 'breakout':
        return (
          <BreakoutGame
            nivel={nivelActual}
            onGanar={() => setResultado('ganando')}
            onPerder={() => setResultado('perdiendo')}
          />
        );
      default:
        return <p className="p-8 text-center text-slate-600">Juego no disponible</p>;
    }
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto">
      <button
        onClick={onVolver}
        className="flex items-center gap-2 text-blue-600 mb-6 hover:text-blue-700 font-bold"
      >
        <ChevronLeft className="w-5 h-5" />
        Volver a Juegos
      </button>

      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <span className="text-4xl">{icono}</span>
              <div>
                <h2 className="text-2xl font-bold">{nombre}</h2>
                <p className="text-blue-100">Nivel {nivelActual} de {totalNiveles}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-100">Tokens</p>
              <p className="text-3xl font-bold text-yellow-300">{tokens}</p>
            </div>
          </div>
          <div className="w-full bg-blue-900/50 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(nivelActual / totalNiveles) * 100}%` }}
              className="bg-green-400 h-full rounded-full"
            />
          </div>
        </div>

        {/* Contenido del Juego */}
        <div className="bg-slate-50">{renderizarJuego()}</div>

        {/* Resultado */}
        {resultado && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 text-center ${resultado === 'ganando' ? 'bg-green-100' : 'bg-red-100'}`}
          >
            <p className={`text-2xl font-bold mb-4 ${resultado === 'ganando' ? 'text-green-700' : 'text-red-700'}`}>
              {resultado === 'ganando' ? '¡Ganaste! 🎉' : 'Perdiste 😢'}
            </p>
            {resultado === 'ganando' && (
              <p className="text-lg font-bold text-green-700 mb-4">+100 Tokens 🪙</p>
            )}
            <div className="flex gap-4 justify-center">
              {resultado === 'ganando' && nivelActual < totalNiveles && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    onTokensChange(tokens + 100);
                    setResultado(null);
                    onAvanzarNivel();
                  }}
                  className="px-6 py-3 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600"
                >
                  Siguiente Nivel →
                </motion.button>
              )}
              {resultado === 'ganando' && nivelActual === totalNiveles && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    onTokensChange(tokens + 200);
                    onVolver();
                  }}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600"
                >
                  ¡Juego Completado! Volver
                </motion.button>
              )}
              {resultado === 'perdiendo' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setResultado(null)}
                  className="px-6 py-3 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600"
                >
                  Reintentar
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default JuegosClasicos;
