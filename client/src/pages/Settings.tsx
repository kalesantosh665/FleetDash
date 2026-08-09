import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import "./Settings.css";

function Settings() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const [notifications, setNotifications] =
    useState(true);

  const [language, setLanguage] =
    useState("English");

  const handleTheme = () => {
    const newTheme = !darkMode;

    setDarkMode(newTheme);

    if (newTheme) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <div className="settings-page">

      <div className="settings-card">

        <h1>⚙ Settings</h1>

        {/* Theme */}

        <div className="setting-item">

          <div>
            <h3>🌙 Dark Mode</h3>
            <p>Enable dark theme.</p>
          </div>

          <label className="switch">

            <input
              type="checkbox"
              checked={darkMode}
              onChange={handleTheme}
            />

            <span className="slider"></span>

          </label>

        </div>

        {/* Notifications */}

        <div className="setting-item">

          <div>
            <h3>🔔 Notifications</h3>
            <p>Receive live fleet alerts.</p>
          </div>

          <label className="switch">

            <input
              type="checkbox"
              checked={notifications}
              onChange={() =>
                setNotifications(
                  !notifications
                )
              }
            />

            <span className="slider"></span>

          </label>

        </div>

        {/* Language */}

        <div className="setting-item">

          <div>

            <h3>🌍 Language</h3>

            <p>Select application language.</p>

          </div>

          <select
            value={language}
            onChange={(e) =>
              setLanguage(e.target.value)
            }
          >

            <option>English</option>

            <option>Marathi</option>

          </select>

        </div>

        {/* Password */}

        <div className="setting-item">

          <div>

            <h3>🔒 Password</h3>

            <p>Update your account password.</p>

          </div>

          <button className="action-btn">
            Change Password
          </button>

        </div>

        {/* Logout */}

        <div className="setting-item">

          <div>

            <h3>🚪 Logout</h3>

            <p>Sign out from FleetDash.</p>

          </div>

          <button
            className="logout-btn"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Logout
          </button>

        </div>

      </div>

    </div>
  );
}

export default Settings;