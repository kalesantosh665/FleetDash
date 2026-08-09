import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaBell, FaChartBar, FaChevronLeft, FaCog, FaHome, FaMapMarkerAlt, FaTruck } from "react-icons/fa";
import sidebarLogo from "../../assets/sidebar.png";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import "./Sidebar.css";

type Page = "dashboard" | "fleet" | "map" | "analytics" | "alerts";

interface SidebarProps {
  activePage?: Page | string;
  setActivePage?: (page: Page) => void;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: FaHome },
  { id: "fleet", label: "Fleet", icon: FaTruck },
  { id: "map", label: "Live Map", icon: FaMapMarkerAlt },
  { id: "analytics", label: "Analytics", icon: FaChartBar },
  { id: "alerts", label: "Alerts", icon: FaBell },
] as const;

function getInitials(name?: string) {
  return (name ?? "User").split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function Sidebar({ activePage, setActivePage }: SidebarProps) {
  const [fallbackPage, setFallbackPage] = useState<Page>("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const { alerts, liveVehicles, connected } = useSocket();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPage = activePage ?? fallbackPage;

  const selectPage = (page: Page) => {
    if (setActivePage) setActivePage(page);
    else setFallbackPage(page);
  };

  return (
    <aside className={`sidebar ${collapsed ? "sidebar--collapsed" : ""}`} aria-label="Primary navigation">
      <div className="sidebar-brand">
        <img src={sidebarLogo} alt="" className="sidebar-logo" />
        <div className="logo-text"><strong>FleetDash</strong><span>Enterprise</span></div>
        <button className="collapse-button" type="button" onClick={() => setCollapsed((value) => !value)} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
          {collapsed ? <FaBars aria-hidden="true" /> : <FaChevronLeft aria-hidden="true" />}
        </button>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {menuItems.map(({ id, label, icon: Icon }) => {
            const isActive = currentPage === id;
            return (
              <li key={id}>
                <button className={`menu-item ${isActive ? "active" : ""}`} type="button" onClick={() => selectPage(id)} aria-current={isActive ? "page" : undefined} title={collapsed ? label : undefined}>
                  <Icon aria-hidden="true" />
                  <span>{label}</span>
                  {id === "fleet" && <small className="menu-count">{liveVehicles.length}</small>}
                  {id === "alerts" && alerts.length > 0 && <small className="menu-badge">{alerts.length > 99 ? "99+" : alerts.length}</small>}
                </button>
              </li>
            );
          })}
          <li>
            <button className={`menu-item ${location.pathname === "/settings" ? "active" : ""}`} type="button" onClick={() => navigate("/settings")} aria-current={location.pathname === "/settings" ? "page" : undefined} title={collapsed ? "Settings" : undefined}>
              <FaCog aria-hidden="true" /><span>Settings</span>
            </button>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="connection"><span className={connected ? "online-dot" : "offline-dot"} />{connected ? "Live connection" : "Offline"}</div>
        <div className="user-card"><span className="user-avatar">{getInitials(user?.name)}</span><span><strong>{user?.name ?? "User"}</strong><small>Online</small></span></div>
      </div>
    </aside>
  );
}

export default Sidebar;
