import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Home, RotateCcw, Star } from "lucide-react";

type Card = {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
};

const EMOJIS = ["🎮", "🎯", "🎲", "🎪", "🎨", "🎭", "🎸", "🎺"];

export function MemoryMatch() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [isWon, setIsWon] = useState(false);

  const initializeGame = () => {
    const gameEmojis = [...EMOJIS, ...EMOJIS];
    const shuffled = gameEmojis
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffled);
    setFlippedIndices([]);
    setMoves(0);
    setMatches(0);
    setIsWon(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (matches === EMOJIS.length) {
      setIsWon(true);
    }
  }, [matches]);

  const handleCardClick = (index: number) => {
    if (
      flippedIndices.length === 2 ||
      cards[index].isFlipped ||
      cards[index].isMatched
    ) {
      return;
    }

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);

    if (newFlippedIndices.length === 2) {
      setMoves(moves + 1);
      const [firstIndex, secondIndex] = newFlippedIndices;

      if (newCards[firstIndex].emoji === newCards[secondIndex].emoji) {
        // Match found
        newCards[firstIndex].isMatched = true;
        newCards[secondIndex].isMatched = true;
        setCards(newCards);
        setMatches(matches + 1);
        setFlippedIndices([]);
      } else {
        // No match
        setTimeout(() => {
          newCards[firstIndex].isFlipped = false;
          newCards[secondIndex].isFlipped = false;
          setCards([...newCards]);
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/"
            className="flex items-center gap-2 text-white hover:text-purple-400 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>Back to Games</span>
          </Link>
          <h1 className="text-3xl font-bold text-white">Memory Match</h1>
          <div className="text-white text-lg font-bold">
            Moves: {moves} | Matches: {matches}/{EMOJIS.length}
          </div>
        </div>

        {/* Game Container */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
          <div className="flex flex-col items-center">
            {/* Board */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              {cards.map((card, index) => (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(index)}
                  disabled={card.isFlipped || card.isMatched}
                  className={`w-20 h-20 rounded-lg text-4xl font-bold transition-all transform ${
                    card.isFlipped || card.isMatched
                      ? "bg-white/30 scale-105"
                      : "bg-purple-600 hover:bg-purple-700 hover:scale-105"
                  } ${card.isMatched ? "opacity-50" : ""}`}
                >
                  {card.isFlipped || card.isMatched ? card.emoji : "?"}
                </button>
              ))}
            </div>

            {/* Win Message */}
            {isWon && (
              <div className="mb-6 text-center bg-green-600/20 border-2 border-green-400 rounded-lg p-6">
                <Star className="w-12 h-12 text-yellow-400 mx-auto mb-2" />
                <h2 className="text-3xl font-bold text-white mb-2">You Won!</h2>
                <p className="text-xl text-green-400">Completed in {moves} moves</p>
              </div>
            )}

            {/* Controls */}
            <button
              onClick={initializeGame}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold transition-colors flex items-center gap-2"
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
