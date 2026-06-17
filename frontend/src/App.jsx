import {
  Routes,
  Route,
  useLocation
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage"
import DashboardPage from "./pages/DashboardPage";
import PortfolioPage from "./pages/PortfolioPage";
import MarketsPage from "./pages/MarketsPage";
import HistoryPage from "./pages/HistoryPage";
import StockPage from "./pages/StockPage";
import AppInit from "./AppInit";
import ProfilePage from "./pages/ProfilePage";

import ProtectedRoute from "./routes/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";



function App() {

  const location = useLocation();

  const hideAppInit =
    location.pathname === "/login" ||
    location.pathname === "/register";


  return (

    <>

      {!hideAppInit && <AppInit />}

      <Routes>

        <Route
          path="/login"
          element={<LoginPage />}
        />
        <Route
          path="/register"
          element={<RegisterPage />}
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
              path="/profile"
              element={<ProfilePage />}
            />

            <Route
              path="/stocks/:symbol"
              element={<StockPage />}
            />

          </Route>

        </Route>

      </Routes>
    </>

  );
}

export default App;
