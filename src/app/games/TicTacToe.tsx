import { useState } from "react";
import { Link } from "react-router";
import { Home, RotateCcw } from "lucide-react";

type Player = "X" | "O" | null;

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function TicTacToe() {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<Player | "draw" | null>(null);

  const checkWinner = (squares: Player[]): Player | "draw" | null => {
    for (const [a, b, c] of WINNING_COMBINATIONS) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    if (squares.every((square) => square !== null)) {
      return "draw";
    }
    return null;
  };

  const makeComputerMove = (currentBoard: Player[]) => {
    // Simple AI: random available move
    const availableMoves = currentBoard
      .map((cell, index) => (cell === null ? index : null))
      .filter((val) => val !== null) as number[];

    if (availableMoves.length > 0) {
      const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
      return randomMove;
    }
    return null;
  };

  const handleClick = (index: number) => {
    if (board[index] || winner || !isXNext) return;

    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);
    setIsXNext(false);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      return;
    }

    // Computer's turn
    setTimeout(() => {
      const computerMove = makeComputerMove(newBoard);
      if (computerMove !== null) {
        const updatedBoard = [...newBoard];
        updatedBoard[computerMove] = "O";
        setBoard(updatedBoard);
        setIsXNext(true);

        const finalWinner = checkWinner(updatedBoard);
        if (finalWinner) {
          setWinner(finalWinner);
        }
      }
    }, 500);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/"
            className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>Back to Games</span>
          </Link>
          <h1 className="text-3xl font-bold text-white">Tic Tac Toe</h1>
          <div className="w-32"></div>
        </div>

        {/* Game Container */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
          <div className="flex flex-col items-center">
            {/* Status */}
            <div className="mb-8 text-center">
              {winner ? (
                winner === "draw" ? (
                  <h2 className="text-3xl font-bold text-yellow-400">It's a Draw!</h2>
                ) : (
                  <h2 className="text-3xl font-bold text-green-400">
                    {winner === "X" ? "You Win!" : "Computer Wins!"}
                  </h2>
                )
              ) : (
                <h2 className="text-2xl font-bold text-white">
                  {isXNext ? "Your Turn (X)" : "Computer's Turn (O)"}
                </h2>
              )}
            </div>

            {/* Board */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              {board.map((cell, index) => (
                <button
                  key={index}
                  onClick={() => handleClick(index)}
                  disabled={!isXNext || !!cell || !!winner}
                  className="w-24 h-24 bg-white/20 hover:bg-white/30 disabled:hover:bg-white/20 border-2 border-white/40 rounded-lg text-5xl font-bold text-white transition-all hover:scale-105 disabled:cursor-not-allowed"
                >
                  {cell === "X" && <span className="text-blue-400">X</span>}
                  {cell === "O" && <span className="text-red-400">O</span>}
                </button>
              ))}
            </div>

            {/* Controls */}
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              New Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
