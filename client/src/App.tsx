import { useEffect, useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import Dashboard from "./components/Dashboard/Dashboard";
import Fleet from "./components/Fleet/Fleet";
import { Toaster } from "react-hot-toast";
import "./App.css";

function App() {
  const [search, setSearch] = useState("");
  const [activePage, setActivePage] = useState("dashboard");

  // Theme State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  // Save Theme
  useEffect(() => {
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
            <Dashboard search={search} />
          )}

          {activePage === "fleet" && (
            <Fleet />
          )}
        </div>
      </div>
    </>
  );
}

export default App;