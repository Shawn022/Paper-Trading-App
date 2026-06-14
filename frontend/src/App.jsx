import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { useEffect } from "react";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import PortfolioPage from "./pages/PortfolioPage";
import MarketsPage from "./pages/MarketsPage";
import HistoryPage from "./pages/HistoryPage";
import StockPage from "./pages/StockPage";
import AppInit from "./AppInit";

import ProtectedRoute from "./routes/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";

import { connectWebSocket ,disconnectWebSocket } from "./services/websocket";

function App() {

  useEffect(() => {
    connectWebSocket();

    return () => disconnectWebSocket();
  }, []);

  return (
    <BrowserRouter>

      <AppInit />

      <Routes>


        <Route
          path="/login"
          element={<LoginPage />}
        />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>

          {/* Layout Routes */}
          <Route element={<MainLayout />}>

            <Route
              path="/"
              element={<DashboardPage />}
            />

            <Route
              path="/portfolio"
              element={<PortfolioPage />}
            />

            <Route
              path="/markets"
              element={<MarketsPage />}
            />

            <Route
              path="/history"
              element={<HistoryPage />}
            />

            <Route
              path="/stocks/:symbol"
              element={<StockPage />}
            />

          </Route>

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;