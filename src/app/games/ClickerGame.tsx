import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Home, Cookie, TrendingUp, RotateCcw } from "lucide-react";

type Upgrade = {
  id: string;
  name: string;
  cost: number;
  production: number;
  count: number;
};

const INITIAL_UPGRADES: Upgrade[] = [
  { id: "cursor", name: "Cursor", cost: 15, production: 1, count: 0 },
  { id: "grandma", name: "Grandma", cost: 100, production: 5, count: 0 },
  { id: "farm", name: "Cookie Farm", cost: 500, production: 25, count: 0 },
  { id: "factory", name: "Cookie Factory", cost: 3000, production: 100, count: 0 },
];

export function ClickerGame() {
  const [cookies, setCookies] = useState(0);
  const [totalCookies, setTotalCookies] = useState(0);
  const [upgrades, setUpgrades] = useState<Upgrade[]>(INITIAL_UPGRADES);
  const [clickPower, setClickPower] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      const passiveProduction = upgrades.reduce(
        (total, upgrade) => total + upgrade.production * upgrade.count,
        0
      );
      if (passiveProduction > 0) {
        setCookies((prev) => prev + passiveProduction);
        setTotalCookies((prev) => prev + passiveProduction);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [upgrades]);

  const handleClick = () => {
    setCookies(cookies + clickPower);
    setTotalCookies(totalCookies + clickPower);
  };

  const buyUpgrade = (upgradeId: string) => {
    const upgradeIndex = upgrades.findIndex((u) => u.id === upgradeId);
    const upgrade = upgrades[upgradeIndex];

    if (cookies >= upgrade.cost) {
      const newUpgrades = [...upgrades];
      newUpgrades[upgradeIndex] = {
        ...upgrade,
        count: upgrade.count + 1,
        cost: Math.floor(upgrade.cost * 1.15),
      };
      setUpgrades(newUpgrades);
      setCookies(cookies - upgrade.cost);
    }
  };

  const resetGame = () => {
    setCookies(0);
    setTotalCookies(0);
    setUpgrades(INITIAL_UPGRADES);
    setClickPower(1);
  };

  const cookiesPerSecond = upgrades.reduce(
    (total, upgrade) => total + upgrade.production * upgrade.count,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-pink-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/"
            className="flex items-center gap-2 text-white hover:text-pink-400 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>Back to Games</span>
          </Link>
          <h1 className="text-3xl font-bold text-white">Cookie Clicker</h1>
          <button
            onClick={resetGame}
            className="flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Cookie Clicker */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
            <div className="flex flex-col items-center">
              {/* Stats */}
              <div className="text-center mb-8 w-full">
                <div className="text-5xl font-bold text-white mb-2">
                  {Math.floor(cookies).toLocaleString()}
                </div>
                <div className="text-xl text-pink-300">cookies</div>
                <div className="text-lg text-gray-300 mt-2 flex items-center justify-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  {cookiesPerSecond} per second
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  Total earned: {Math.floor(totalCookies).toLocaleString()}
                </div>
              </div>

              {/* Cookie Button */}
              <button
                onClick={handleClick}
                className="w-64 h-64 bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center group relative"
              >
                <Cookie className="w-32 h-32 text-white group-hover:rotate-12 transition-transform" />
                <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>

              <div className="text-white mt-6 text-lg">
                +{clickPower} per click
              </div>
            </div>
          </div>

          {/* Right Panel - Upgrades */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">Upgrades</h2>
            <div className="space-y-4">
              {upgrades.map((upgrade) => {
                const canAfford = cookies >= upgrade.cost;
                return (
                  <button
                    key={upgrade.id}
                    onClick={() => buyUpgrade(upgrade.id)}
                    disabled={!canAfford}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      canAfford
                        ? "bg-pink-600/30 border-pink-400 hover:bg-pink-600/50 hover:scale-105"
                        : "bg-gray-800/30 border-gray-600 opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="text-lg font-bold text-white">
                          {upgrade.name}
                        </div>
                        <div className="text-sm text-pink-300">
                          +{upgrade.production} cookies/sec
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-yellow-400">
                          {upgrade.cost.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-300">
                          Owned: {upgrade.count}
                        </div>
                      </div>
                    </div>
                    {upgrade.count > 0 && (
                      <div className="text-xs text-green-400">
                        Producing {upgrade.production * upgrade.count}/sec
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
