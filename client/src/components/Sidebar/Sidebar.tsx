import "./Sidebar.css";

interface SidebarProps {
  activePage: string;
  setActivePage: React.Dispatch<React.SetStateAction<string>>;
}

function Sidebar({
  activePage,
  setActivePage,
}: SidebarProps) {
  return (
    <aside className="sidebar">
      <ul>

        <li
          className={
            activePage === "dashboard"
              ? "menu-item active"
              : "menu-item"
          }
          onClick={() => setActivePage("dashboard")}
        >
          🏠 Dashboard
        </li>

        <li
          className={
            activePage === "fleet"
              ? "menu-item active"
              : "menu-item"
          }
          onClick={() => setActivePage("fleet")}
        >
          🚚 Fleet
        </li>

        <li className="menu-item">
          📍 Live Map
        </li>

        <li className="menu-item">
          🚨 Alerts
        </li>

        <li className="menu-item">
          ⚙ Settings
        </li>

      </ul>
    </aside>
  );
}

export default Sidebar;