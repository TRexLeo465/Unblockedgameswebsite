import { Link } from "react-router";
import { Gamepad2, ArrowRight } from "lucide-react";

const games = [
  {
    id: "snake",
    title: "Snake Game",
    description: "Classic snake game - eat food and grow longer!",
    path: "/snake",
    color: "bg-green-600",
  },
  {
    id: "tictactoe",
    title: "Tic Tac Toe",
    description: "Play against a computer opponent",
    path: "/tictactoe",
    color: "bg-blue-600",
  },
  {
    id: "memory",
    title: "Memory Match",
    description: "Find matching pairs of cards",
    path: "/memory",
    color: "bg-purple-600",
  },
  {
    id: "puzzle",
    title: "Number Puzzle",
    description: "Slide numbers to solve the puzzle",
    path: "/puzzle",
    color: "bg-orange-600",
  },
  {
    id: "clicker",
    title: "Cookie Clicker",
    description: "Click to earn points and buy upgrades",
    path: "/clicker",
    color: "bg-pink-600",
  },
];

export function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Gamepad2 className="w-8 h-8 text-purple-400" />
            <h1 className="text-3xl font-bold text-white">Unblocked Games</h1>
          </div>
          <p className="text-gray-300 mt-2">Play free games anytime, anywhere!</p>
        </div>
      </header>

      {/* Games Grid */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <Link
              key={game.id}
              to={game.path}
              className="group relative bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all hover:scale-105 hover:shadow-2xl"
            >
              <div className={`w-16 h-16 ${game.color} rounded-lg mb-4 flex items-center justify-center`}>
                <Gamepad2 className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">{game.title}</h2>
              <p className="text-gray-300 mb-4">{game.description}</p>
              <div className="flex items-center text-purple-400 group-hover:text-purple-300 transition-colors">
                <span className="font-semibold">Play Now</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 py-8 bg-black/30 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
          <p>© 2026 Unblocked Games - All games are free to play</p>
        </div>
      </footer>
    </div>
  );
}
