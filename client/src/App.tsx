import { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Layout from "./components/Layout/Layout";
import Dashboard from "./components/Dashboard/Dashboard";
import Fleet from "./components/Fleet/Fleet";

import LiveMap from "./pages/LiveMap";
import Analytics from "./pages/Analytics";
import Alerts from "./pages/Alerts";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import ProtectedRoute from "./pages/ProtectedRoute";
import NotFound from "./pages/NotFound";

import { useSocket } from "./context/SocketContext";

import "./App.css";

function App() {
  const [search, setSearch] = useState("");

  const { liveVehicles } = useSocket();

  const [theme, setTheme] = useState(() => {
    return (
      localStorage.getItem("theme") ||
      "light"
    );
  });

  useEffect(() => {
    document.documentElement.dataset.theme =
      theme;

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
        {/* ==========================================
            PUBLIC ROUTES
        ========================================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* ==========================================
            PROTECTED APPLICATION
        ========================================== */}

        <Route
          element={
            <ProtectedRoute>
              <Layout
                search={search}
                setSearch={setSearch}
                theme={theme}
                setTheme={setTheme}
              />
            </ProtectedRoute>
          }
        >
          {/* Dashboard */}

          <Route
            path="/dashboard"
            element={
              <Dashboard
                search={search}
                liveVehicles={
                  liveVehicles ?? []
                }
              />
            }
          />

          {/* Fleet */}

          <Route
            path="/fleet"
            element={<Fleet />}
          />

          {/* Live Map */}

          <Route
            path="/map"
            element={<LiveMap />}
          />

          {/* Analytics */}

          <Route
            path="/analytics"
            element={<Analytics />}
          />

          {/* Alerts */}

          <Route
            path="/alerts"
            element={<Alerts />}
          />

          {/* Profile */}

          <Route
            path="/profile"
            element={<Profile />}
          />

          {/* Settings */}

          <Route
            path="/settings"
            element={<Settings />}
          />
        </Route>

        {/* ==========================================
            ROOT
        ========================================== */}

        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

        {/* ==========================================
            404
        ========================================== */}

        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>
    </>
  );
}

export default App;