import { FaBell, FaUserCircle } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import "./Navbar.css";

interface NavbarProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
}

function Navbar({ search, setSearch, theme, setTheme }: NavbarProps) {
  

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const [notifications, setNotifications] = useState([
    "🚚 Truck 12 is Offline",
    "⚠ Truck 25 Speed Alert",
    "👨 Driver 8 Started Trip",
  ]);

  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

 

  // Live Notifications
  useEffect(() => {
    const messages = [
      "🚚 Truck 5 Started Trip",
      "⚠ Truck 18 Overspeed (92 km/h)",
      "🛑 Truck 9 Stopped",
      "✅ Driver 14 Completed Trip",
      "⛽ Truck 21 Low Fuel",
      "🔋 Truck 11 Battery Low",
      "📍 Truck 3 Entered Pune",
      "🚛 Truck 7 Route Updated",
      "🚦 Traffic Delay on Route",
      "📦 Delivery Completed",
    ];

    const interval = setInterval(() => {
      const randomMessage =
        messages[Math.floor(Math.random() * messages.length)];

      setNotifications((prev) => [
        randomMessage,
        ...prev.slice(0, 9),
      ]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Close Dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowProfile(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  

  return (
    <nav className="navbar">
      <h2>FleetDash</h2>

      <div className="navbar-right">

        {/* Notification */}
        <div
          className="notification"
          ref={notificationRef}
        >
          <FaBell
            className="bell-icon"
            onClick={() =>
              setShowNotifications(!showNotifications)
            }
          />

          <span className="badge">
            {notifications.length}
          </span>

          {showNotifications && (
            <div className="notification-dropdown">
              <h4>Notifications</h4>

              {notifications.map((item, index) => (
                <div
                  key={index}
                  className="notification-item"
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile */}
        <div
          className="profile"
          ref={profileRef}
        >
          <FaUserCircle
            className="profile-icon"
            onClick={() =>
              setShowProfile(!showProfile)
            }
          />

          {showProfile && (
            <div className="profile-dropdown">
              <h4>Santosh Kale</h4>

              <div className="profile-item">
                👤 My Profile
              </div>

              <div className="profile-item">
                ⚙ Settings
              </div>

              <div className="profile-item">
                🚪 Logout
              </div>
            </div>
          )}
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search Vehicle..."
          className="search-box"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        {/* Theme */}
       <button
  className="dark-btn"
  onClick={() =>
    setTheme(theme === "light" ? "dark" : "light")
  }
>
  {theme === "light" ? "🌙 Dark" : "☀️ Light"}
</button>

      </div>
    </nav>
  );
}

export default Navbar;