import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaBell,
  FaChartBar,
  FaChevronLeft,
  FaCog,
  FaHome,
  FaMapMarkerAlt,
  FaTruck,
} from "react-icons/fa";

import sidebarLogo from "../../assets/sidebar.png";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";

import "./Sidebar.css";

type Page =
  | "dashboard"
  | "fleet"
  | "map"
  | "analytics"
  | "alerts";

interface SidebarProps {
  activePage?: Page | string;
  setActivePage?: (page: Page) => void;
}

interface MenuItem {
  id: Page;
  label: string;
  icon: typeof FaHome;
  path: string;
}

const menuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: FaHome,
    path: "/dashboard",
  },
  {
    id: "fleet",
    label: "Fleet",
    icon: FaTruck,
    path: "/fleet",
  },
  {
    id: "map",
    label: "Live Map",
    icon: FaMapMarkerAlt,
    path: "/map",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: FaChartBar,
    path: "/analytics",
  },
  {
    id: "alerts",
    label: "Alerts",
    icon: FaBell,
    path: "/alerts",
  },
];

function getInitials(name?: string) {
  return (name ?? "User")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function getPageFromPath(pathname: string): Page | undefined {
  if (
    pathname === "/dashboard" ||
    pathname === "/"
  ) {
    return "dashboard";
  }

  if (pathname.startsWith("/fleet")) {
    return "fleet";
  }

  if (pathname.startsWith("/map")) {
    return "map";
  }

  if (pathname.startsWith("/analytics")) {
    return "analytics";
  }

  if (pathname.startsWith("/alerts")) {
    return "alerts";
  }

  return undefined;
}

function Sidebar({
  activePage,
  setActivePage,
}: SidebarProps) {
  const [fallbackPage, setFallbackPage] =
    useState<Page>("dashboard");

  const [collapsed, setCollapsed] =
    useState(false);

  const {
    alerts,
    liveVehicles,
    connected,
  } = useSocket();

  const { user } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const routePage = getPageFromPath(
    location.pathname,
  );

  const currentPage =
    activePage ??
    routePage ??
    fallbackPage;

  const initials = useMemo(
    () => getInitials(user?.name),
    [user?.name],
  );

  const selectPage = (page: Page, path: string) => {
    if (setActivePage) {
      setActivePage(page);
    } else {
      setFallbackPage(page);
    }

    navigate(path);
  };

  const isSettingsActive =
    location.pathname.startsWith("/settings");

  return (
    <aside
      className={`sidebar ${
        collapsed
          ? "sidebar--collapsed"
          : ""
      }`}
      aria-label="Primary navigation"
    >
      {/* ==================================================
          BRAND
      ================================================== */}

      <div className="sidebar-brand">
        <img
          src={sidebarLogo}
          alt="FleetDash"
          className="sidebar-logo"
        />

        <div className="logo-text">
          <strong>FleetDash</strong>
          <span>Enterprise</span>
        </div>

        <button
          className="collapse-button"
          type="button"
          onClick={() =>
            setCollapsed(
              (value) => !value,
            )
          }
          aria-label={
            collapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
          }
          aria-expanded={!collapsed}
        >
          {collapsed ? (
            <FaBars aria-hidden="true" />
          ) : (
            <FaChevronLeft
              aria-hidden="true"
            />
          )}
        </button>
      </div>

      {/* ==================================================
          NAVIGATION
      ================================================== */}

      <nav
        className="sidebar-nav"
        aria-label="Main navigation"
      >
        <ul>
          {menuItems.map(
            ({
              id,
              label,
              icon: Icon,
              path,
            }) => {
              const isActive =
                currentPage === id;

              return (
                <li key={id}>
                  <button
                    className={`menu-item ${
                      isActive
                        ? "active"
                        : ""
                    }`}
                    type="button"
                    onClick={() =>
                      selectPage(id, path)
                    }
                    aria-current={
                      isActive
                        ? "page"
                        : undefined
                    }
                    title={
                      collapsed
                        ? label
                        : undefined
                    }
                  >
                    <Icon
                      aria-hidden="true"
                    />

                    <span>
                      {label}
                    </span>

                    {id === "fleet" && (
                      <small
                        className="menu-count"
                        aria-label={`${liveVehicles.length} vehicles`}
                      >
                        {liveVehicles.length >
                        999
                          ? "999+"
                          : liveVehicles.length}
                      </small>
                    )}

                    {id === "alerts" &&
                      alerts.length > 0 && (
                        <small
                          className="menu-badge"
                          aria-label={`${alerts.length} alerts`}
                        >
                          {alerts.length >
                          99
                            ? "99+"
                            : alerts.length}
                        </small>
                      )}
                  </button>
                </li>
              );
            },
          )}

          {/* Settings */}

          <li>
            <button
              className={`menu-item ${
                isSettingsActive
                  ? "active"
                  : ""
              }`}
              type="button"
              onClick={() =>
                navigate("/settings")
              }
              aria-current={
                isSettingsActive
                  ? "page"
                  : undefined
              }
              title={
                collapsed
                  ? "Settings"
                  : undefined
              }
            >
              <FaCog
                aria-hidden="true"
              />

              <span>Settings</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* ==================================================
          FOOTER
      ================================================== */}

      <div className="sidebar-footer">
        <div
          className={`connection ${
            connected
              ? "connection--online"
              : "connection--offline"
          }`}
          title={
            connected
              ? "Socket connection is active"
              : "Socket connection is offline"
          }
        >
          <span
            className={
              connected
                ? "online-dot"
                : "offline-dot"
            }
            aria-hidden="true"
          />

          <span>
            {connected
              ? "Live connection"
              : "Offline"}
          </span>
        </div>

        <div
          className="user-card"
          title={
            collapsed
              ? user?.name ?? "User"
              : undefined
          }
        >
          <span
            className="user-avatar"
            aria-hidden="true"
          >
            {initials}
          </span>

          <span className="user-info">
            <strong>
              {user?.name ?? "User"}
            </strong>

            <small>
              {connected
                ? "Online"
                : "Offline"}
            </small>
          </span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;