import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import {
  FaBars,
  FaBell,
  FaCircle,
  FaMoon,
  FaSearch,
  FaSun,
  FaUserCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import type { Alert } from "../../types/alert";
import logo from "../../assets/logo.png";
import "./Navbar.css";

interface NavbarProps {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  theme: string;
  setTheme: Dispatch<SetStateAction<string>>;
  onMenuClick?: () => void;
  /** Vehicle names/registration numbers shown below the search field. */
  searchSuggestions?: string[];
  /** Receives a query only after the user pauses typing for 300 ms. */
  onDebouncedSearch?: (query: string) => void;
  breadcrumb?: string;
  onMarkAllRead?: () => void;
  onClearNotifications?: () => void;
  onViewAllNotifications?: () => void;
}

const timeFormatter = new Intl.DateTimeFormat([], {
  hour: "2-digit",
  minute: "2-digit",
});
const dayFormatter = new Intl.DateTimeFormat([], { weekday: "short" });

function getInitials(name?: string) {
  return (name ?? "User")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function relativeTime(timestamp?: string | Date) {
  if (!timestamp) return undefined;
  const minutes = Math.max(
    0,
    Math.floor((Date.now() - new Date(timestamp).getTime()) / 60_000),
  );
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  return hours < 24 ? `${hours} hr ago` : `${Math.floor(hours / 24)} d ago`;
}

function Navbar({
  search,
  setSearch,
  theme,
  setTheme,
  onMenuClick,
  searchSuggestions = [],
  onDebouncedSearch,
  breadcrumb = "Dashboard",
  onMarkAllRead,
  onClearNotifications,
  onViewAllNotifications,
}: NavbarProps) {
  const { user, logout } = useAuth();
  const { alerts, connected } = useSocket();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState(search);
  const [now, setNow] = useState(() => new Date());
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const initials = useMemo(() => getInitials(user?.name), [user?.name]);

  const suggestions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return normalized
      ? searchSuggestions
          .filter((item) => item.toLowerCase().includes(normalized))
          .slice(0, 5)
      : [];
  }, [query, searchSuggestions]);

  useEffect(() => setQuery(search), [search]);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(query);
      onDebouncedSearch?.(query);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [query, setSearch, onDebouncedSearch]);
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1_000);
    return () => window.clearInterval(timer);
  }, []);

  const closeOverlays = () => {
    setShowNotifications(false);
    setShowProfile(false);
    setShowSearch(false);
  };

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!notificationRef.current?.contains(target))
        setShowNotifications(false);
      if (!profileRef.current?.contains(target)) setShowProfile(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setShowSearch(true);
        requestAnimationFrame(() => searchInputRef.current?.focus());
      }
      if (event.key === "Escape") closeOverlays();
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const navigateTo = useCallback(
    (path: string) => {
      setShowProfile(false);
      navigate(path);
    },
    [navigate],
  );

  return (
    <nav className="navbar" aria-label="Application navigation">
      <div className="navbar-left">
        <button
          className="icon-button menu-btn"
          type="button"
          aria-label="Open navigation menu"
          onClick={onMenuClick}
        >
          <FaBars aria-hidden="true" />
        </button>
        <a
          className="logo-container"
          href="/dashboard"
          aria-label="FleetDash dashboard"
        >
          <img src={logo} alt="" className="logo" />
          <span>
            <span className="brand-name">
              <span className="fleet">Fleet</span>
              <span className="dash">Dash</span>
            </span>
            <small className="breadcrumb">{breadcrumb}</small>
          </span>
        </a>
      </div>

      <div className="navbar-right">
        <div className="search-wrapper">
          <button
            className="icon-button search-trigger"
            type="button"
            aria-label="Search vehicles"
            aria-expanded={showSearch}
            onClick={() => {
              setShowSearch((open) => !open);
              setShowNotifications(false);
              setShowProfile(false);
            }}
          >
            <FaSearch aria-hidden="true" />
          </button>
          {showSearch && (
            <div className="search-panel">
              <input
                ref={searchInputRef}
                type="search"
                placeholder="Search vehicles..."
                className="search-box"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) =>
                  event.key === "Escape" && setShowSearch(false)
                }
                autoFocus
              />
              {suggestions.length > 0 && (
                <div className="suggestions" role="listbox">
                  {suggestions.map((item) => (
                    <button
                      type="button"
                      role="option"
                      key={item}
                      onClick={() => {
                        setQuery(item);
                        setShowSearch(false);
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="notification" ref={notificationRef}>
          <button
            className="icon-button"
            type="button"
            aria-label={`Notifications${alerts.length ? ` (${alerts.length})` : ""}`}
            aria-expanded={showNotifications}
            onClick={() => {
              setShowNotifications((open) => !open);
              setShowProfile(false);
            }}
          >
            <FaBell aria-hidden="true" />
          </button>
          {alerts.length > 0 && (
            <span className="badge" aria-hidden="true">
              {alerts.length > 99 ? "99+" : alerts.length}
            </span>
          )}
          {showNotifications && (
            <section
              className="dropdown notification-dropdown"
              aria-label="Notifications"
            >
              <div className="dropdown-header">
                <h2>Notifications</h2>
                <button
                  type="button"
                  className="text-button"
                  onClick={onMarkAllRead}
                  disabled={!onMarkAllRead}
                >
                  Mark all read
                </button>
              </div>
              <div className="notification-list">
                {alerts.length === 0 ? (
                  <p className="empty-state">No new alerts</p>
                ) : (
                  alerts.map((alert: Alert) => {
                    const time = relativeTime(alert.timestamp);
                    return (
                      <article key={alert.id} className="notification-item">
                        <FaCircle className="alert-dot" aria-hidden="true" />
                        <div>
                          <strong>{alert.vehicleName}</strong>
                          <span>{alert.message}</span>
                          {time && <time>{time}</time>}
                        </div>
                      </article>
                    );
                  })
                )}
              </div>
              <div className="notification-actions">
                <button
                  type="button"
                  onClick={onClearNotifications}
                  disabled={!onClearNotifications}
                >
                  Clear
                </button>
                <button
                  type="button"
                  disabled={!onViewAllNotifications}
                  onClick={() => {
                    setShowNotifications(false);
                    onViewAllNotifications?.();
                  }}
                >
                  View all
                </button>
              </div>
            </section>
          )}
        </div>

        <div className="profile" ref={profileRef}>
          <button
            className="icon-button"
            type="button"
            aria-label="Open user menu"
            aria-expanded={showProfile}
            onClick={() => {
              setShowProfile((open) => !open);
              setShowNotifications(false);
            }}
          >
            <FaUserCircle aria-hidden="true" />
          </button>
          {showProfile && (
            <section
              className="dropdown profile-dropdown"
              aria-label="User menu"
            >
              <div className="profile-summary">
                <span className="avatar" aria-hidden="true">
                  {initials}
                </span>
                <div>
                  <strong>{user?.name ?? "User"}</strong>
                  <small>{user?.email}</small>
                </div>
              </div>
              <button
                type="button"
                className="profile-item"
                onClick={() => navigateTo("/profile")}
              >
                My Profile
              </button>
              <button
                type="button"
                className="profile-item"
                onClick={() => navigateTo("/settings")}
              >
                Settings
              </button>
              <button
                type="button"
                className="profile-item"
                onClick={() => navigateTo("/help")}
              >
                Help
              </button>
              <button
                type="button"
                className="profile-item danger"
                onClick={async () => {
                  try {
                    await logout();
                  } finally {
                    setShowProfile(false);
                    navigate("/login");
                  }
                }}
              >
                Logout
              </button>
            </section>
          )}
        </div>

        <button
          className="theme-button"
          type="button"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? (
            <FaMoon aria-hidden="true" />
          ) : (
            <FaSun aria-hidden="true" />
          )}
          <span>{theme === "light" ? "Dark" : "Light"}</span>
        </button>
        <time className="live-clock" dateTime={now.toISOString()}>
          <strong>
            {timeFormatter.format(now)}
          </strong>
          <span>{dayFormatter.format(now)}</span>
        </time>
        <div
          className={`connection-status ${connected ? "is-connected" : "is-offline"}`}
          title={connected ? "Socket connected" : "Socket disconnected"}
        >
          <FaCircle aria-hidden="true" />{" "}
          <span>{connected ? "Live" : "Offline"}</span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
