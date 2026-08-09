import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";

import "./Layout.css";

function Layout() {
  const [search, setSearch] = useState("");
  const [activePage, setActivePage] = useState<"dashboard" | "fleet" | "map" | "analytics" | "alerts">("dashboard");

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
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
    <div className="layout">

      <Navbar
        search={search}
        setSearch={setSearch}
        theme={theme}
        setTheme={setTheme}
      />

      <div className="layout-body">

        <Sidebar activePage={activePage} setActivePage={setActivePage} />

        <main className="layout-content">

          <Outlet
            context={{
              search,
            }}
          />

        </main>

      </div>

    </div>
  );
}

export default Layout;
