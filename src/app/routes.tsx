import { createBrowserRouter } from "react-router";
import { Home } from "./pages/Home";
import { SnakeGame } from "./games/SnakeGame";
import { TicTacToe } from "./games/TicTacToe";
import { MemoryMatch } from "./games/MemoryMatch";
import { NumberPuzzle } from "./games/NumberPuzzle";
import { ClickerGame } from "./games/ClickerGame";
import { Outlet } from "react-router";

function Layout() {
  return <Outlet />;
}

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        Component: Home,
      },
      {
        path: "/snake",
        Component: SnakeGame,
      },
      {
        path: "/tictactoe",
        Component: TicTacToe,
      },
      {
        path: "/memory",
        Component: MemoryMatch,
      },
      {
        path: "/puzzle",
        Component: NumberPuzzle,
      },
      {
        path: "/clicker",
        Component: ClickerGame,
      },
    ],
  },
]);