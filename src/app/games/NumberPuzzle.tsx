import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Home, RotateCcw, Shuffle, Star } from "lucide-react";

type Board = number[];

const WINNING_BOARD = [1, 2, 3, 4, 5, 6, 7, 8, 0];

export function NumberPuzzle() {
  const [board, setBoard] = useState<Board>(WINNING_BOARD);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);

  const shuffleBoard = () => {
    let shuffled = [...WINNING_BOARD];
    // Perform random valid moves to ensure solvability
    for (let i = 0; i < 100; i++) {
      const emptyIndex = shuffled.indexOf(0);
      const validMoves = getValidMoves(emptyIndex);
      const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
      [shuffled[emptyIndex], shuffled[randomMove]] = [shuffled[randomMove], shuffled[emptyIndex]];
    }
    setBoard(shuffled);
    setMoves(0);
    setIsWon(false);
  };

  useEffect(() => {
    shuffleBoard();
  }, []);

  const getValidMoves = (emptyIndex: number): number[] => {
    const row = Math.floor(emptyIndex / 3);
    const col = emptyIndex % 3;
    const validMoves = [];

    if (row > 0) validMoves.push(emptyIndex - 3); // Up
    if (row < 2) validMoves.push(emptyIndex + 3); // Down
    if (col > 0) validMoves.push(emptyIndex - 1); // Left
    if (col < 2) validMoves.push(emptyIndex + 1); // Right

    return validMoves;
  };

  const checkWin = (currentBoard: Board): boolean => {
    return currentBoard.every((val, idx) => val === WINNING_BOARD[idx]);
  };

  const handleTileClick = (index: number) => {
    if (isWon) return;

    const emptyIndex = board.indexOf(0);
    const validMoves = getValidMoves(emptyIndex);

    if (validMoves.includes(index)) {
      const newBoard = [...board];
      [newBoard[emptyIndex], newBoard[index]] = [newBoard[index], newBoard[emptyIndex]];
      setBoard(newBoard);
      setMoves(moves + 1);

      if (checkWin(newBoard)) {
        setIsWon(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/"
            className="flex items-center gap-2 text-white hover:text-orange-400 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>Back to Games</span>
          </Link>
          <h1 className="text-3xl font-bold text-white">Number Puzzle</h1>
          <div className="text-white text-lg font-bold">Moves: {moves}</div>
        </div>

        {/* Game Container */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
          <div className="flex flex-col items-center">
            <p className="text-white mb-6 text-center">
              Arrange the numbers in order from 1 to 8
            </p>

            {/* Board */}
            <div className="grid grid-cols-3 gap-3 mb-8 bg-black/40 p-4 rounded-lg">
              {board.map((tile, index) => (
                <button
                  key={index}
                  onClick={() => handleTileClick(index)}
                  disabled={tile === 0}
                  className={`w-24 h-24 rounded-lg text-3xl font-bold transition-all ${
                    tile === 0
                      ? "bg-transparent cursor-default"
                      : "bg-orange-600 hover:bg-orange-700 text-white hover:scale-105"
                  }`}
                >
                  {tile !== 0 && tile}
                </button>
              ))}
            </div>

            {/* Win Message */}
            {isWon && (
              <div className="mb-6 text-center bg-green-600/20 border-2 border-green-400 rounded-lg p-6">
                <Star className="w-12 h-12 text-yellow-400 mx-auto mb-2" />
                <h2 className="text-3xl font-bold text-white mb-2">Puzzle Solved!</h2>
                <p className="text-xl text-green-400">Completed in {moves} moves</p>
              </div>
            )}

            {/* Controls */}
            <button
              onClick={shuffleBoard}
              className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold transition-colors flex items-center gap-2"
            >
              <Shuffle className="w-5 h-5" />
              New Puzzle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
