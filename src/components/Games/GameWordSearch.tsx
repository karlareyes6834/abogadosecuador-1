import React, { useState, useEffect } from 'react';

interface GameWordSearchProps {
  onClose: () => void;
}

export const GameWordSearch: React.FC<GameWordSearchProps> = ({ onClose }) => {
  const [puntuacion, setPuntuacion] = useState(0);
  const [tiempoTranscurrido, setTiempoTranscurrido] = useState(0);
  const [palabrasEncontradas, setPalabrasEncontradas] = useState<string[]>([]);
  const tiempoInicio = React.useRef<number>(Date.now());

  const palabrasABuscar = ['ABOGADO', 'JUSTICIA', 'DERECHO', 'LEGAL', 'CONTRATO', 'JUICIO'];
  const grid = [
    ['A', 'B', 'O', 'G', 'A', 'D', 'O', 'X'],
    ['J', 'U', 'S', 'T', 'I', 'C', 'I', 'A'],
    ['D', 'E', 'R', 'E', 'C', 'H', 'O', 'Y'],
    ['L', 'E', 'G', 'A', 'L', 'Z', 'W', 'Q'],
    ['C', 'O', 'N', 'T', 'R', 'A', 'T', 'O'],
    ['J', 'U', 'I', 'C', 'I', 'O', 'P', 'R']
  ];

  useEffect(() => {
    const intervalo = setInterval(() => {
      setTiempoTranscurrido(Math.floor((Date.now() - tiempoInicio.current) / 1000));
    }, 100);
    return () => clearInterval(intervalo);
  }, []);

  const encontrarPalabra = (palabra: string) => {
    if (!palabrasEncontradas.includes(palabra)) {
      setPalabrasEncontradas([...palabrasEncontradas, palabra]);
      setPuntuacion(puntuacion + palabra.length * 10);
    }
  };

  const formatearTiempo = (segundos: number) => {
    const mins = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${mins.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="backdrop-blur-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-white/20 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white">Sopa de Letras Legal</h3>
          <div className="flex gap-4">
            <div className="text-center">
              <p className="text-slate-400 text-xs">Puntuación</p>
              <p className="text-2xl font-bold text-yellow-400">{puntuacion}</p>
            </div>
            <div className="text-center">
              <p className="text-slate-400 text-xs">Tiempo</p>
              <p className="text-2xl font-bold text-blue-400">{formatearTiempo(tiempoTranscurrido)}</p>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(8, 1fr)' }}>
            {grid.map((fila, i) =>
              fila.map((letra, j) => (
                <div
                  key={`${i}-${j}`}
                  className="aspect-square bg-gradient-to-br from-blue-500/30 to-purple-500/30 border border-white/20 rounded flex items-center justify-center text-white font-bold text-sm hover:bg-blue-500/50 transition-all cursor-pointer"
                >
                  {letra}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Palabras a encontrar */}
        <div className="mb-6">
          <p className="text-white font-bold mb-3">Palabras a encontrar:</p>
          <div className="grid grid-cols-2 gap-2">
            {palabrasABuscar.map(palabra => (
              <button
                key={palabra}
                onClick={() => encontrarPalabra(palabra)}
                className={`p-2 rounded text-sm font-bold transition-all ${
                  palabrasEncontradas.includes(palabra)
                    ? 'bg-green-500/50 text-green-200 line-through'
                    : 'bg-blue-500/30 text-blue-200 hover:bg-blue-500/50'
                }`}
              >
                {palabra}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <p className="text-slate-400 text-sm">Encontradas: {palabrasEncontradas.length}/{palabrasABuscar.length}</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500/30 hover:bg-red-500/50 text-red-300 rounded-lg transition-all"
          >
            Salir
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameWordSearch;
