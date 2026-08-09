import { useMemo } from "react";
import { useSocket } from "../../context/SocketContext";
import {
  FaBolt,
  FaTruck,
  FaPlay,
  FaStop,
  FaChevronRight,
} from "react-icons/fa";
import "./LiveActivity.css";

function LiveActivity() {
  const { liveVehicles } = useSocket();

  const activities = useMemo(() => {
    return liveVehicles
      .slice(0, 20)
      .map((vehicle) => ({
        id: vehicle.id,
        vehicle: vehicle.name,
        message:
          vehicle.status === "Running"
            ? "Started Moving"
            : "Stopped",
        time: "Just Now",
        status: vehicle.status,
      }));
  }, [liveVehicles]);

  const runningCount = activities.filter(
    (activity) => activity.status === "Running"
  ).length;

  return (
    <section className="activity-card">

      {/* =========================
          Header
      ========================= */}

      <div className="activity-header">

        <div className="activity-title">

          <div className="activity-icon">
            <FaBolt />
          </div>

          <div>
            <h2>Live Activity</h2>

            <p>
              Real-time vehicle movements
            </p>
          </div>

        </div>

        <button className="history-btn">
          View History
          <FaChevronRight />
        </button>

      </div>

      {/* =========================
          Live Summary
      ========================= */}

      {activities.length > 0 && (
        <div className="activity-summary">

          <div className="activity-summary-live">
            <span className="activity-live-dot"></span>
            LIVE
          </div>

          <span className="activity-summary-text">
            {runningCount} vehicles currently moving
          </span>

        </div>
      )}

      {/* =========================
          Activity List
      ========================= */}

      {activities.length === 0 ? (

        <div className="empty-activity">

          <div className="empty-activity-icon">
            <FaBolt />
          </div>

          <strong>
            No Live Activity
          </strong>

          <p>
            Vehicle activity will appear here.
          </p>

        </div>

      ) : (

        <div className="activity-list">

          {activities.map((activity) => {

            const isRunning =
              activity.status === "Running";

            return (
              <div
                key={activity.id}
                className="activity-item"
              >

                {/* Vehicle Icon */}
                <div
                  className={`activity-vehicle-icon ${
                    isRunning
                      ? "running"
                      : "stopped"
                  }`}
                >
                  <FaTruck />
                </div>

                {/* Activity Content */}
                <div className="activity-info">

                  <div className="activity-top-row">

                    <strong>
                      {activity.vehicle}
                    </strong>

                    <span
                      className={`activity-status ${
                        isRunning
                          ? "running"
                          : "stopped"
                      }`}
                    >
                      {isRunning
                        ? "RUNNING"
                        : "STOPPED"}
                    </span>

                  </div>

                  <p>

                    <span
                      className={`activity-message-icon ${
                        isRunning
                          ? "running"
                          : "stopped"
                      }`}
                    >
                      {isRunning ? (
                        <FaPlay />
                      ) : (
                        <FaStop />
                      )}
                    </span>

                    {activity.message}

                  </p>

                  <small>
                    {activity.time}
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

export default LiveActivity;