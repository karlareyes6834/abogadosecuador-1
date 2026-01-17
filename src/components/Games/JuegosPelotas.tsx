import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';

interface JuegosPelotasProps {
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

// Brick Breaker Profesional
const BrickBreakerGame: React.FC<{ nivel: number; onGanar: () => void; onPerder: () => void }> = ({ nivel, onGanar, onPerder }) => {
  const [posicionPala, setPosicionPala] = useState(50);
  const [bolaPosicion, setBolaPosicion] = useState({ x: 50, y: 80 });
  const [bolaVelocidad, setBolaVelocidad] = useState({ x: 2, y: -3 });
  const [bloques, setBloques] = useState(
    Array.from({ length: 18 + nivel * 3 }, (_, i) => ({
      id: i,
      x: (i % 6) * 16.67,
      y: Math.floor(i / 6) * 8,
      activo: true,
      color: ['bg-red-500', 'bg-orange-500', 'bg-yellow-500'][Math.floor(i / 6) % 3],
    }))
  );
  const [puntos, setPuntos] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [vidas, setVidas] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      setBolaPosicion(prev => {
        let nuevaX = prev.x + bolaVelocidad.x;
        let nuevaY = prev.y + bolaVelocidad.y;
        let nuevaVelocidad = { ...bolaVelocidad };

        // Colisión con paredes laterales
        if (nuevaX < 2 || nuevaX > 98) {
          nuevaVelocidad.x *= -1;
          nuevaX = Math.max(2, Math.min(98, nuevaX));
        }

        // Colisión con pared superior
        if (nuevaY < 2) {
          nuevaVelocidad.y *= -1;
          nuevaY = 2;
        }

        // Colisión con pala (rebote realista)
        if (nuevaY > 85 && nuevaX > posicionPala - 6 && nuevaX < posicionPala + 6) {
          nuevaVelocidad.y = Math.abs(nuevaVelocidad.y) * -1;
          const offset = (nuevaX - posicionPala) / 6;
          nuevaVelocidad.x = offset * 4;
          nuevaY = 85;
        }

        // Colisión con bloques (rebote realista)
        setBloques(prev => {
          let bloquesActualizados = [...prev];
          bloquesActualizados.forEach(bloque => {
            if (bloque.activo && nuevaX > bloque.x && nuevaX < bloque.x + 16.67 && nuevaY > bloque.y && nuevaY < bloque.y + 8) {
              bloque.activo = false;
              nuevaVelocidad.y *= -1;
              setPuntos(p => p + 10 + nivel);
            }
          });
          return bloquesActualizados;
        });

        // Caída de la bola
        if (nuevaY > 100) {
          setVidas(v => {
            if (v - 1 <= 0) {
              setGameOver(true);
              onPerder();
              return 0;
            }
            return v - 1;
          });
          return { x: 50, y: 80 };
        }

        setBolaVelocidad(nuevaVelocidad);
        return { x: nuevaX, y: nuevaY };
      });

      if (bloques.every(b => !b.activo)) {
        onGanar();
      }
    }, 30);

    return () => clearInterval(interval);
  }, [bolaVelocidad, posicionPala, bloques, nivel]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setPosicionPala(p => Math.max(6, p - 4));
      if (e.key === 'ArrowRight') setPosicionPala(p => Math.min(94, p + 4));
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="p-8 space-y-4">
      <div className="bg-gradient-to-b from-slate-900 to-black rounded-lg p-2 h-96 relative overflow-hidden border-2 border-cyan-500">
        {/* Bloques */}
        {bloques.map(bloque => (
          bloque.activo && (
            <div
              key={bloque.id}
              className={`absolute ${bloque.color} rounded transition-all`}
              style={{ left: `${bloque.x}%`, top: `${bloque.y}%`, width: '16.67%', height: '8%' }}
            ></div>
          )
        ))}

        {/* Bola con sombra */}
        <div
          className="absolute w-3 h-3 bg-white rounded-full shadow-lg"
          style={{ left: `${bolaPosicion.x}%`, top: `${bolaPosicion.y}%`, boxShadow: '0 0 10px rgba(255,255,255,0.8)' }}
        ></div>

        {/* Pala */}
        <div
          className="absolute bottom-1 w-16 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded transition-all shadow-lg"
          style={{ left: `${posicionPala}%`, transform: 'translateX(-50%)' }}
        ></div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <div className="bg-yellow-100 rounded p-2 text-center">
          <p className="text-xs text-slate-700">Puntos</p>
          <p className="text-xl font-bold text-yellow-600">{puntos}</p>
        </div>
        <div className="bg-blue-100 rounded p-2 text-center">
          <p className="text-xs text-slate-700">Bloques</p>
          <p className="text-xl font-bold text-blue-600">{bloques.filter(b => b.activo).length}</p>
        </div>
        <div className="bg-red-100 rounded p-2 text-center">
          <p className="text-xs text-slate-700">Vidas</p>
          <p className="text-xl font-bold text-red-600">❤️ {vidas}</p>
        </div>
        <div className="bg-green-100 rounded p-2 text-center">
          <p className="text-xs text-slate-700">Nivel</p>
          <p className="text-xl font-bold text-green-600">{nivel}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setPosicionPala(p => Math.max(6, p - 8))} className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded font-bold hover:bg-cyan-700">
          ← Izquierda
        </button>
        <button onClick={() => setPosicionPala(p => Math.min(94, p + 8))} className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded font-bold hover:bg-cyan-700">
          Derecha →
        </button>
      </div>

      <p className="text-xs text-slate-600 text-center">Usa flechas para mover la pala, rebota la bola contra los bloques</p>
    </div>
  );
};

// Pong Profesional
const PongGame: React.FC<{ nivel: number; onGanar: () => void; onPerder: () => void }> = ({ nivel, onGanar, onPerder }) => {
  const [bolaPosicion, setBolaPosicion] = useState({ x: 50, y: 50 });
  const [bolaVelocidad, setBolaVelocidad] = useState({ x: 2, y: 2 });
  const [posicionJugador, setPosicionJugador] = useState(50);
  const [posicionIA, setPosicionIA] = useState(50);
  const [puntosJugador, setPuntosJugador] = useState(0);
  const [puntosIA, setPuntosIA] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBolaPosicion(prev => {
        let nuevaX = prev.x + bolaVelocidad.x;
        let nuevaY = prev.y + bolaVelocidad.y;
        let nuevaVelocidad = { ...bolaVelocidad };

        // Colisión con paredes superior e inferior
        if (nuevaY < 2 || nuevaY > 98) {
          nuevaVelocidad.y *= -1;
        }

        // Colisión con pala del jugador
        if (nuevaX < 5 && nuevaY > posicionJugador - 8 && nuevaY < posicionJugador + 8) {
          nuevaVelocidad.x *= -1.05;
          nuevaX = 5;
        }

        // Colisión con pala de IA
        if (nuevaX > 95 && nuevaY > posicionIA - 8 && nuevaY < posicionIA + 8) {
          nuevaVelocidad.x *= -1.05;
          nuevaX = 95;
        }

        // Puntuación
        if (nuevaX < 0) {
          setPuntosIA(p => p + 1);
          return { x: 50, y: 50 };
        }
        if (nuevaX > 100) {
          setPuntosJugador(p => p + 1);
          return { x: 50, y: 50 };
        }

        // IA inteligente
        setPosicionIA(prev => {
          const diferencia = bolaPosicion.y - prev;
          if (Math.abs(diferencia) > 2) {
            return prev + (diferencia > 0 ? 2 + nivel * 0.5 : -2 - nivel * 0.5);
          }
          return prev;
        });

        if (puntosJugador >= 5 + nivel) {
          onGanar();
        }
        if (puntosIA >= 5 + nivel) {
          onPerder();
        }

        setBolaVelocidad(nuevaVelocidad);
        return { x: nuevaX, y: nuevaY };
      });
    }, 30);

    return () => clearInterval(interval);
  }, [bolaVelocidad, posicionJugador, posicionIA, puntosJugador, puntosIA, nivel]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') setPosicionJugador(p => Math.max(8, p - 4));
      if (e.key === 'ArrowDown') setPosicionJugador(p => Math.min(92, p + 4));
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="p-8 space-y-4">
      <div className="bg-black rounded-lg p-2 h-80 relative overflow-hidden border-2 border-white">
        {/* Línea central */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white opacity-30" style={{ transform: 'translateX(-50%)' }}></div>

        {/* Bola */}
        <div
          className="absolute w-3 h-3 bg-white rounded-full"
          style={{ left: `${bolaPosicion.x}%`, top: `${bolaPosicion.y}%` }}
        ></div>

        {/* Pala Jugador */}
        <div
          className="absolute left-1 w-2 h-16 bg-cyan-500 rounded transition-all"
          style={{ top: `${posicionJugador}%`, transform: 'translateY(-50%)' }}
        ></div>

        {/* Pala IA */}
        <div
          className="absolute right-1 w-2 h-16 bg-red-500 rounded transition-all"
          style={{ top: `${posicionIA}%`, transform: 'translateY(-50%)' }}
        ></div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-cyan-100 rounded p-4 text-center">
          <p className="text-sm text-slate-700">Tú</p>
          <p className="text-3xl font-bold text-cyan-600">{puntosJugador}</p>
        </div>
        <div className="bg-red-100 rounded p-4 text-center">
          <p className="text-sm text-slate-700">IA</p>
          <p className="text-3xl font-bold text-red-600">{puntosIA}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setPosicionJugador(p => Math.max(8, p - 6))} className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded font-bold hover:bg-cyan-700">
          ↑ Arriba
        </button>
        <button onClick={() => setPosicionJugador(p => Math.min(92, p + 6))} className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded font-bold hover:bg-cyan-700">
          ↓ Abajo
        </button>
      </div>

      <p className="text-xs text-slate-600 text-center">Juega contra la IA, primero a {5 + nivel} puntos gana</p>
    </div>
  );
};

// Componente Principal
export const JuegosPelotas: React.FC<JuegosPelotasProps> = ({
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
      case 'ladrillos':
        return (
          <BrickBreakerGame
            nivel={nivelActual}
            onGanar={() => setResultado('ganando')}
            onPerder={() => setResultado('perdiendo')}
          />
        );
      case 'pong':
        return (
          <PongGame
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
              <p className="text-lg font-bold text-green-700 mb-4">+120 Tokens 🪙</p>
            )}
            <div className="flex gap-4 justify-center">
              {resultado === 'ganando' && nivelActual < totalNiveles && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    onTokensChange(tokens + 120);
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
                    onTokensChange(tokens + 250);
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

export default JuegosPelotas;
