import React, { useState, useEffect } from 'react';
import Card from '../Card';
import { useTokens } from '../../context/TokenContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Page, PublicRoute } from '../../types';

type SquareValue = 'X' | 'O' | null;
type BoardState = SquareValue[];
type GameResult = 'win' | 'loss' | 'draw' | null;

const calculateWinner = (squares: BoardState): SquareValue | null => {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
};

const getBestMove = (squares: BoardState): number => {
    // 1. Check for winning move
    for (let i = 0; i < 9; i++) {
        if (!squares[i]) {
            const tempBoard = [...squares];
            tempBoard[i] = 'O';
            if (calculateWinner(tempBoard) === 'O') {
                return i;
            }
        }
    }
    // 2. Block player's winning move
    for (let i = 0; i < 9; i++) {
        if (!squares[i]) {
            const tempBoard = [...squares];
            tempBoard[i] = 'X';
            if (calculateWinner(tempBoard) === 'X') {
                return i;
            }
        }
    }
    // 3. Take center
    if (!squares[4]) return 4;
    // 4. Take random corner
    const corners = [0, 2, 6, 8].filter(i => !squares[i]);
    if (corners.length > 0) return corners[Math.floor(Math.random() * corners.length)];
    // 5. Take random side
    const sides = [1, 3, 5, 7].filter(i => !squares[i]);
    if (sides.length > 0) return sides[Math.floor(Math.random() * sides.length)];

    return -1; // Should not happen in a normal game
};

interface TicTacToeProps {
    canPlay: boolean;
    onGameEnd: (result: GameResult) => void;
    onNavigate: (page: Page | PublicRoute) => void;
}

const TicTacToe: React.FC<TicTacToeProps> = ({ canPlay, onGameEnd, onNavigate }) => {
    const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);
    const [result, setResult] = useState<GameResult>(null);
    const { useToken, addTokens } = useTokens();

    const winner = calculateWinner(board);
    const isBoardFull = board.every(square => square !== null);

    useEffect(() => {
        if (winner) {
            const gameResult = winner === 'X' ? 'win' : 'loss';
            setResult(gameResult);
            if (gameResult === 'win') addTokens(3); // Win: 3 tokens
            onGameEnd(gameResult);
        } else if (isBoardFull) {
            setResult('draw');
            addTokens(1); // Draw: 1 token back
            onGameEnd('draw');
        } else if (!isPlayerTurn) {
            const timer = setTimeout(() => {
                const bestMove = getBestMove(board);
                if (bestMove !== -1) {
                    const newBoard = [...board];
                    newBoard[bestMove] = 'O';
                    setBoard(newBoard);
                    setIsPlayerTurn(true);
                }
            }, 500); // AI "thinks" for a moment
            return () => clearTimeout(timer);
        }
    }, [board, isPlayerTurn]);

    const handleClick = (index: number) => {
        if (board[index] || winner || !isPlayerTurn || !canPlay) return;

        if (board.every(s => s === null)) { // First move of the game
            if (!useToken(1)) {
                 alert("¡No tienes suficientes fichas para jugar!");
                 return;
            }
        }

        const newBoard = [...board];
        newBoard[index] = 'X';
        setBoard(newBoard);
        setIsPlayerTurn(false);
    };

    const handlePlayAgain = () => {
        setBoard(Array(9).fill(null));
        setIsPlayerTurn(true);
        setResult(null);
    };

    const renderSquare = (index: number) => (
        <button
            onClick={() => handleClick(index)}
            className="w-20 h-20 bg-[var(--background)] flex items-center justify-center text-4xl font-bold rounded-md"
            aria-label={`Square ${index + 1}`}
        >
            {board[index]}
        </button>
    );

    const getResultMessage = () => {
        switch(result) {
            case 'win': return "¡Ganaste! +3 Fichas";
            case 'loss': return "¡Perdiste!";
            case 'draw': return "¡Empate! +1 Ficha";
            default: return "";
        }
    }
    
    const overlayVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 },
    };

    return (
        <Card>
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Tres en Raya</h2>
                <p className="text-sm text-[var(--muted-foreground)] mb-6">Cuesta 1 ficha. Gana y obtén 3 fichas.</p>
                <div className="relative flex justify-center">
                    <div className="grid grid-cols-3 gap-2">
                        {Array(9).fill(null).map((_, i) => renderSquare(i))}
                    </div>
                    <AnimatePresence>
                    {result && (
                        <motion.div 
                            variants={overlayVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl">
                             <p className="text-2xl font-bold text-white mb-4">{getResultMessage()}</p>
                             <button onClick={handlePlayAgain} className="px-6 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md">Jugar de Nuevo</button>
                        </motion.div>
                    )}
                     {!canPlay && (
                        <motion.div 
                            variants={overlayVariants}
                            initial="hidden"
                            animate="visible"
                            className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl text-center p-4">
                             <p className="text-xl font-bold text-white mb-2">¡Gracias por probar!</p>
                             <p className="text-sm text-gray-300 mb-4">Regístrate para seguir jugando y ganar recompensas.</p>
                             <button onClick={() => onNavigate('register')} className="px-6 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md">Registrarse Gratis</button>
                        </motion.div>
                    )}
                    </AnimatePresence>
                </div>
            </div>
        </Card>
    );
};

export default TicTacToe;