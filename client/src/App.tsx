import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import Dashboard from "./components/Dashboard/Dashboard";
import Fleet from "./components/Fleet/Fleet";
import LiveMap from "./pages/LiveMap";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import ProtectedRoute from "./pages/ProtectedRoute";
import Alerts from "./pages/Alerts";
import { useSocket } from "./context/SocketContext";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";
import "./App.css";

function App() {
  const [search, setSearch] = useState("");
  const [activePage, setActivePage] =
    useState("dashboard");

  const { liveVehicles } = useSocket();

  const [theme, setTheme] = useState(() => {
    return (
      localStorage.getItem("theme") ||
      "light"
    );
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    if (theme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "10px",
          },
        }}
      />

     <Routes>

  {/* Public Routes */}
  <Route
    path="/login"
    element={<Login />}
  />

  <Route
    path="/register"
    element={<Register />}
  />

  {/* Protected Dashboard */}
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>

        <div className="app">

          <Navbar
            search={search}
            setSearch={setSearch}
            theme={theme}
            setTheme={setTheme}
          />

          <div className="content">

            <Sidebar
              activePage={activePage}
              setActivePage={setActivePage}
            />

            {activePage === "dashboard" && (
              <Dashboard
                search={search}
                liveVehicles={liveVehicles ?? []}
              />
            )}

            {activePage === "map" && (
              <LiveMap />
            )}

            {activePage === "analytics" && (
              <Analytics />
            )}

            {activePage === "fleet" && (
              <Fleet />
            )}

            {activePage === "alerts" && (
              <Alerts />
            )}

          </div>

        </div>

      </ProtectedRoute>
    }
  />

  {/* Profile */}
  <Route
    path="/profile"
    element={
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    }
  />

  {/* Settings */}
  <Route
    path="/settings"
    element={
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    }
  />

  {/* Root → Dashboard */}
  <Route
    path="/"
    element={
      <Navigate
        to="/dashboard"
        replace
      />
    }
  />

  {/* 404 */}
  <Route
    path="*"
    element={<NotFound />}
  />

</Routes>
    </>
  );
}

export default App;
