import {
  useEffect,
  type Dispatch,
  type SetStateAction,
} from "react";
import { Outlet } from "react-router-dom";

import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";

import "./Layout.css";

interface LayoutProps {
  search: string;
  setSearch: Dispatch<
    SetStateAction<string>
  >;
  theme: string;
  setTheme: Dispatch<
    SetStateAction<string>
  >;
}

function Layout({
  search,
  setSearch,
  theme,
  setTheme,
}: LayoutProps) {
  useEffect(() => {
    document.documentElement.dataset.theme =
      theme;

    if (theme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }

    localStorage.setItem(
      "theme",
      theme,
    );
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
        <Sidebar />

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