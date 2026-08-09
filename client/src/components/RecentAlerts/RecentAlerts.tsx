import { useNavigate } from "react-router-dom";
import { useSocket } from "../../context/SocketContext";
import {
  FaBell,
  FaExclamationTriangle,
  FaChevronRight,
} from "react-icons/fa";
import "./RecentAlerts.css";

function RecentAlerts() {
  const { alerts } = useSocket();
  const navigate = useNavigate();

  return (
    <section className="recent-alerts-card">

      {/* Header */}
      <div className="recent-alerts-header">

        <div className="alerts-title">

          <div className="alerts-icon">
            <FaBell />
          </div>

          <div>
            <h2>Recent Alerts</h2>

            <p>
              Latest fleet warnings
            </p>
          </div>

        </div>

        <button
          className="view-all-btn"
          onClick={() => navigate("/alerts")}
        >
          View All
          <FaChevronRight />
        </button>

      </div>

      {/* Alert Count */}
      {alerts.length > 0 && (
        <div className="alert-summary">

          <span className="alert-summary-dot"></span>

          <strong>
            {alerts.length}
          </strong>

          <span>
            active alerts
          </span>

        </div>
      )}

      {/* Alerts */}
      {alerts.length === 0 ? (

        <div className="empty-alerts">

          <div className="empty-alert-icon">
            <FaBell />
          </div>

          <strong>
            No recent alerts
          </strong>

          <p>
            Your fleet is operating normally.
          </p>

        </div>

      ) : (

        <div className="alerts-list">

          {alerts.slice(0, 5).map((alert) => {

            const isHigh =
              alert.severity === "HIGH";

            return (
              <div
                key={alert.id}
                className={`alert-item ${
                  isHigh
                    ? "alert-high"
                    : "alert-medium"
                }`}
              >

                {/* Alert Icon */}
                <div
                  className={`alert-status-icon ${
                    isHigh
                      ? "high"
                      : "medium"
                  }`}
                >
                  <FaExclamationTriangle />
                </div>

                {/* Alert Content */}
                <div className="alert-info">

                  <div className="alert-top-row">

                    <h4>
                      {alert.vehicleName}
                    </h4>

                    <span
                      className={`severity ${
                        isHigh
                          ? "high"
                          : "medium"
                      }`}
                    >
                      {alert.severity}
                    </span>

                  </div>

                  <p>
                    {alert.message}
                  </p>

                  <small>
                    {new Date(
                      alert.timestamp
                    ).toLocaleTimeString()}
                  </small>

                </div>

              </div>
            );
          })}

        </div>
      )}

    </section>
  );
}

export default RecentAlerts;