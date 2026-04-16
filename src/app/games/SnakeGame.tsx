import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router";
import { Home, RotateCcw } from "lucide-react";

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Position = { x: number; y: number };

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION: Direction = "RIGHT";
const GAME_SPEED = 150;

export function SnakeGame() {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const directionRef = useRef<Direction>(INITIAL_DIRECTION);

  const generateFood = useCallback((currentSnake: Position[]): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (
      currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)
    );
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(generateFood(INITIAL_SNAKE));
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (directionRef.current) {
        case "UP":
          newHead.y -= 1;
          break;
        case "DOWN":
          newHead.y += 1;
          break;
        case "LEFT":
          newHead.x -= 1;
          break;
        case "RIGHT":
          newHead.x += 1;
          break;
      }

      // Check wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setGameOver(true);
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((prev) => prev + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [gameOver, isPaused, food, generateFood]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const key = e.key;
      
      if (key === " ") {
        e.preventDefault();
        setIsPaused((prev) => !prev);
        return;
      }

      if (isPaused) return;

      const newDirection =
        key === "ArrowUp" && directionRef.current !== "DOWN"
          ? "UP"
          : key === "ArrowDown" && directionRef.current !== "UP"
          ? "DOWN"
          : key === "ArrowLeft" && directionRef.current !== "RIGHT"
          ? "LEFT"
          : key === "ArrowRight" && directionRef.current !== "LEFT"
          ? "RIGHT"
          : null;

      if (newDirection) {
        e.preventDefault();
        setDirection(newDirection);
        directionRef.current = newDirection;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isPaused]);

  useEffect(() => {
    const interval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(interval);
  }, [moveSnake]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/"
            className="flex items-center gap-2 text-white hover:text-green-400 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>Back to Games</span>
          </Link>
          <h1 className="text-3xl font-bold text-white">Snake Game</h1>
          <div className="text-white text-xl font-bold">Score: {score}</div>
        </div>

        {/* Game Container */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
          <div className="flex flex-col items-center">
            {/* Game Board */}
            <div
              className="relative bg-black/40 border-4 border-green-600 rounded-lg"
              style={{
                width: GRID_SIZE * CELL_SIZE,
                height: GRID_SIZE * CELL_SIZE,
              }}
            >
              {/* Snake */}
              {snake.map((segment, index) => (
                <div
                  key={index}
                  className={`absolute ${
                    index === 0 ? "bg-green-400" : "bg-green-600"
                  } rounded-sm`}
                  style={{
                    width: CELL_SIZE - 2,
                    height: CELL_SIZE - 2,
                    left: segment.x * CELL_SIZE + 1,
                    top: segment.y * CELL_SIZE + 1,
                  }}
                />
              ))}

              {/* Food */}
              <div
                className="absolute bg-red-500 rounded-full"
                style={{
                  width: CELL_SIZE - 4,
                  height: CELL_SIZE - 4,
                  left: food.x * CELL_SIZE + 2,
                  top: food.y * CELL_SIZE + 2,
                }}
              />

              {/* Game Over Overlay */}
              {gameOver && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded">
                  <div className="text-center">
                    <h2 className="text-4xl font-bold text-white mb-4">Game Over!</h2>
                    <p className="text-2xl text-green-400 mb-6">Final Score: {score}</p>
                    <button
                      onClick={resetGame}
                      className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-colors flex items-center gap-2 mx-auto"
                    >
                      <RotateCcw className="w-5 h-5" />
                      Play Again
                    </button>
                  </div>
                </div>
              )}

              {/* Pause Overlay */}
              {isPaused && !gameOver && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded">
                  <h2 className="text-4xl font-bold text-white">PAUSED</h2>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="mt-8 text-center">
              <p className="text-white mb-4">Use arrow keys to move • Space to pause</p>
              <button
                onClick={resetGame}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-colors"
              >
                Restart Game
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
