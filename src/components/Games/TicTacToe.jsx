import React, { useState } from 'react';

const initialBoard = Array(9).fill(null);
const winningCombos = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

export default function TicTacToe() {
  const [board, setBoard] = useState(initialBoard);
  const [turn, setTurn] = useState('X');
  const [winner, setWinner] = useState(null);

  const checkWinner = (b) => {
    for (const [a, c, d] of winningCombos) {
      if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a];
    }
    if (b.every(Boolean)) return 'Empate';
    return null;
  };

  const handleClick = (idx) => {
    if (board[idx] || winner) return;
    const next = [...board];
    next[idx] = turn;
    const w = checkWinner(next);
    setBoard(next);
    if (w) setWinner(w);
    else setTurn(turn === 'X' ? 'O' : 'X');
  };

  const reset = () => {
    setBoard(initialBoard);
    setTurn('X');
    setWinner(null);
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">3 en raya</h1>
      <div className="grid grid-cols-3 gap-2">
        {board.map((cell, idx) => (
          <button
            key={idx}
            onClick={() => handleClick(idx)}
            className="h-20 bg-white border rounded text-2xl font-bold hover:bg-gray-50"
          >
            {cell}
          </button>
        ))}
      </div>
      <div className="mt-4 text-center">
        {winner ? (
          <div className="space-y-2">
            <p className="text-lg font-semibold">{winner === 'Empate' ? 'Empate' : `Ganó ${winner}`}</p>
            <button onClick={reset} className="px-4 py-2 bg-blue-600 text-white rounded">Reiniciar</button>
          </div>
        ) : (
          <p>Turno: <span className="font-semibold">{turn}</span></p>
        )}
      </div>
    </div>
  );
}




