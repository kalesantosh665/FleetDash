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
import { Link, useNavigate } from "react-router-dom";

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

  /** Receives a query after the user pauses typing for 300ms. */
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

const dayFormatter = new Intl.DateTimeFormat([], {
  weekday: "short",
});

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

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  const minutes = Math.max(
    0,
    Math.floor((Date.now() - date.getTime()) / 60_000),
  );

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hr ago`;
  }

  return `${Math.floor(hours / 24)} d ago`;
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
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const initials = useMemo(
    () => getInitials(user?.name),
    [user?.name],
  );

  const suggestions = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return [];
    }

    return searchSuggestions
      .filter((item) =>
        item.toLowerCase().includes(normalized),
      )
      .slice(0, 5);
  }, [query, searchSuggestions]);

  const unreadCount = alerts.length;

  /*
   * Keep local search state synchronized with the parent.
   */
  useEffect(() => {
    setQuery(search);
  }, [search]);

  /*
   * Debounced search.
   */
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(query);
      onDebouncedSearch?.(query);
    }, 300);

    return () => {
      window.clearTimeout(timer);
    };
  }, [query, setSearch, onDebouncedSearch]);

  /*
   * Live clock.
   */
  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1_000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  /*
   * Close dropdowns when clicking outside or pressing Escape.
   */
  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;

      if (!notificationRef.current?.contains(target)) {
        setShowNotifications(false);
      }

      if (!profileRef.current?.contains(target)) {
        setShowProfile(false);
      }

      if (!searchRef.current?.contains(target)) {
        setShowSearch(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      /*
       * Ctrl + K / Cmd + K opens vehicle search.
       */
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();

        setShowSearch(true);
        setShowNotifications(false);
        setShowProfile(false);

        requestAnimationFrame(() => {
          searchInputRef.current?.focus();
        });
      }

      if (event.key === "Escape") {
        setShowSearch(false);
        setShowNotifications(false);
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const closeAllOverlays = useCallback(() => {
    setShowNotifications(false);
    setShowProfile(false);
    setShowSearch(false);
  }, []);

  const openSearch = useCallback(() => {
    setShowSearch((open) => !open);
    setShowNotifications(false);
    setShowProfile(false);

    requestAnimationFrame(() => {
      searchInputRef.current?.focus();
    });
  }, []);

  const selectSearchSuggestion = useCallback(
    (value: string) => {
      setQuery(value);
      setSearch(value);
      onDebouncedSearch?.(value);
      setShowSearch(false);
    },
    [setSearch, onDebouncedSearch],
  );

  const navigateTo = useCallback(
    (path: string) => {
      closeAllOverlays();
      navigate(path);
    },
    [closeAllOverlays, navigate],
  );

  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } finally {
      closeAllOverlays();
      navigate("/login");
    }
  }, [logout, closeAllOverlays, navigate]);

  return (
    <nav
      className={`navbar ${connected ? "is-live" : "is-offline"}`}
      aria-label="Application navigation"
    >
      {/* ================= LEFT ================= */}
      <div className="navbar-left">
        <button
          className="icon-button menu-btn"
          type="button"
          aria-label="Open navigation menu"
          onClick={onMenuClick}
        >
          <FaBars aria-hidden="true" />
        </button>

        <Link
          className="logo-container"
          to="/dashboard"
          aria-label="FleetDash dashboard"
          onClick={closeAllOverlays}
        >
          <img
            src={logo}
            alt="FleetDash"
            className="logo"
          />

          <span className="brand-wrapper">
            <span className="brand-name">
              <span className="fleet">Fleet</span>
              <span className="dash">Dash</span>
            </span>

            <small className="breadcrumb">
              {breadcrumb}
            </small>
          </span>
        </Link>
      </div>

      {/* ================= RIGHT ================= */}
      <div className="navbar-right">
        {/* Search */}
        <div
          className="search-wrapper"
          ref={searchRef}
        >
          <button
            className="icon-button search-trigger"
            type="button"
            aria-label="Search vehicles"
            aria-expanded={showSearch}
            onClick={openSearch}
          >
            <FaSearch aria-hidden="true" />
          </button>

          {showSearch && (
            <div
              className="search-panel"
              role="dialog"
              aria-label="Vehicle search"
            >
              <div className="search-input-wrapper">
                <FaSearch
                  className="search-input-icon"
                  aria-hidden="true"
                />

                <input
                  ref={searchInputRef}
                  type="search"
                  placeholder="Search vehicles..."
                  className="search-box"
                  value={query}
                  onChange={(event) =>
                    setQuery(event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Escape") {
                      setShowSearch(false);
                    }

                    if (
                      event.key === "Enter" &&
                      query.trim()
                    ) {
                      setSearch(query.trim());
                      onDebouncedSearch?.(query.trim());
                      setShowSearch(false);
                    }
                  }}
                  autoFocus
                  aria-label="Search vehicles"
                />

                <kbd>Ctrl K</kbd>
              </div>

              {suggestions.length > 0 && (
                <div
                  className="suggestions"
                  role="listbox"
                  aria-label="Vehicle suggestions"
                >
                  <div className="suggestions-label">
                    Vehicles
                  </div>

                  {suggestions.map((item) => (
                    <button
                      type="button"
                      role="option"
                      key={item}
                      onClick={() =>
                        selectSearchSuggestion(item)
                      }
                    >
                      <FaSearch aria-hidden="true" />
                      <span>{item}</span>
                    </button>
                  ))}
                </div>
              )}

              {!query.trim() && (
                <div className="search-hint">
                  Search by vehicle name or registration number.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div
          className="notification"
          ref={notificationRef}
        >
          <button
            className="icon-button"
            type="button"
            aria-label={`Notifications${
              unreadCount ? ` (${unreadCount})` : ""
            }`}
            aria-expanded={showNotifications}
            onClick={() => {
              setShowNotifications((open) => !open);
              setShowProfile(false);
              setShowSearch(false);
            }}
          >
            <FaBell aria-hidden="true" />

            {unreadCount > 0 && (
              <span
                className="badge"
                aria-hidden="true"
              >
                {unreadCount > 99
                  ? "99+"
                  : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <section
              className="dropdown notification-dropdown"
              aria-label="Notifications"
            >
              <div className="dropdown-header">
                <div>
                  <h2>Notifications</h2>
                  <span className="notification-count">
                    {unreadCount} active alert
                    {unreadCount === 1 ? "" : "s"}
                  </span>
                </div>

                <button
                  type="button"
                  className="text-button"
                  onClick={onMarkAllRead}
                  disabled={!onMarkAllRead || unreadCount === 0}
                >
                  Mark all read
                </button>
              </div>

              <div className="notification-list">
                {alerts.length === 0 ? (
                  <div className="empty-notifications">
                    <FaBell aria-hidden="true" />

                    <strong>You're all caught up</strong>

                    <span>
                      No new fleet alerts right now.
                    </span>
                  </div>
                ) : (
                  alerts.map((alert: Alert) => {
                    const time = relativeTime(
                      alert.timestamp,
                    );

                    return (
                      <article
                        key={alert.id}
                        className="notification-item"
                      >
                        <span
                          className="notification-indicator"
                          aria-hidden="true"
                        />

                        <div className="notification-content">
                          <strong>
                            {alert.vehicleName}
                          </strong>

                          <span>
                            {alert.message}
                          </span>

                          {time && (
                            <time>
                              {time}
                            </time>
                          )}
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
                  disabled={
                    !onClearNotifications ||
                    unreadCount === 0
                  }
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

        {/* Profile */}
        <div
          className="profile"
          ref={profileRef}
        >
          <button
            className="icon-button profile-trigger"
            type="button"
            aria-label="Open user menu"
            aria-expanded={showProfile}
            onClick={() => {
              setShowProfile((open) => !open);
              setShowNotifications(false);
              setShowSearch(false);
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
                <span
                  className="avatar"
                  aria-hidden="true"
                >
                  {initials}
                </span>

                <div>
                  <strong>
                    {user?.name ?? "User"}
                  </strong>

                  <small>
                    {user?.email ?? "No email available"}
                  </small>
                </div>
              </div>

              <div className="profile-menu">
                <button
                  type="button"
                  className="profile-item"
                  onClick={() =>
                    navigateTo("/profile")
                  }
                >
                  My Profile
                </button>

                <button
                  type="button"
                  className="profile-item"
                  onClick={() =>
                    navigateTo("/settings")
                  }
                >
                  Settings
                </button>

                <button
                  type="button"
                  className="profile-item"
                  onClick={() =>
                    navigateTo("/help")
                  }
                >
                  Help
                </button>

                <button
                  type="button"
                  className="profile-item danger"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </section>
          )}
        </div>

        {/* Theme */}
        <button
          className="theme-button"
          type="button"
          onClick={() =>
            setTheme(
              theme === "light"
                ? "dark"
                : "light",
            )
          }
          aria-label={`Switch to ${
            theme === "light"
              ? "dark"
              : "light"
          } mode`}
        >
          {theme === "light" ? (
            <FaMoon aria-hidden="true" />
          ) : (
            <FaSun aria-hidden="true" />
          )}

          <span>
            {theme === "light"
              ? "Dark"
              : "Light"}
          </span>
        </button>

        {/* Live clock */}
        <time
          className="live-clock"
          dateTime={now.toISOString()}
        >
          <strong>
            {timeFormatter.format(now)}
          </strong>

          <span>
            {dayFormatter.format(now)}
          </span>
        </time>

        {/* Connection */}
        <div
          className={`connection-status ${
            connected
              ? "is-connected"
              : "is-offline"
          }`}
          title={
            connected
              ? "Socket connected"
              : "Socket disconnected"
          }
          aria-label={
            connected
              ? "Live connection"
              : "Offline connection"
          }
        >
          <FaCircle aria-hidden="true" />

          <span>
            {connected ? "Live" : "Offline"}
          </span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;