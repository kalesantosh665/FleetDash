import { useMemo } from "react";
import { FaTruck, FaPlay, FaStop, FaTachometerAlt } from "react-icons/fa";
import { useSocket } from "../../context/SocketContext";
import "./FleetSummary.css";

function FleetSummary() {
  const { liveVehicles } = useSocket();

  const stats = useMemo(() => {
    const total = liveVehicles.length;

    const running = liveVehicles.filter(
      (v) => v.status === "Running"
    ).length;

    const stopped = total - running;

    const avgSpeed =
      total === 0
        ? 0
        : Math.round(
            liveVehicles.reduce(
              (sum, vehicle) => sum + vehicle.speed,
              0
            ) / total
          );

    const runningPercentage =
      total === 0
        ? 0
        : Math.round((running / total) * 100);

    const stoppedPercentage =
      total === 0
        ? 0
        : Math.round((stopped / total) * 100);

    return {
      total,
      running,
      stopped,
      avgSpeed,
      runningPercentage,
      stoppedPercentage,
    };
  }, [liveVehicles]);

  return (
    <section className="fleet-summary-card">

      {/* Header */}
      <div className="fleet-summary-header">

        <div className="fleet-summary-title">

          <div className="fleet-summary-icon">
            <FaTruck />
          </div>

          <div>
            <h2>Fleet Summary</h2>

            <p>
              Current fleet overview
            </p>
          </div>

        </div>

        <div className="fleet-summary-live">
          <span className="fleet-live-dot"></span>
          LIVE
        </div>

      </div>

      {/* Main Total */}
      <div className="fleet-total">

        <div>
          <span className="fleet-total-label">
            Total Vehicles
          </span>

          <h3>{stats.total}</h3>
        </div>

        <div className="fleet-total-icon">
          <FaTruck />
        </div>

      </div>

      {/* Running */}
      <div className="fleet-metric">

        <div className="metric-header">

          <div className="metric-label">

            <span className="metric-icon running-icon">
              <FaPlay />
            </span>

            <span>Running</span>

          </div>

          <strong>
            {stats.running}
          </strong>

        </div>

        <div className="summary-progress">

          <div
            className="summary-progress-fill running-fill"
            style={{
              width: `${stats.runningPercentage}%`,
            }}
          />

        </div>

        <div className="metric-footer">
          <span>
            Active vehicles
          </span>

          <span>
            {stats.runningPercentage}%
          </span>
        </div>

      </div>

      {/* Stopped */}
      <div className="fleet-metric">

        <div className="metric-header">

          <div className="metric-label">

            <span className="metric-icon stopped-icon">
              <FaStop />
            </span>

            <span>Stopped</span>

          </div>

          <strong>
            {stats.stopped}
          </strong>

        </div>

        <div className="summary-progress">

          <div
            className="summary-progress-fill stopped-fill"
            style={{
              width: `${stats.stoppedPercentage}%`,
            }}
          />

        </div>

        <div className="metric-footer">
          <span>
            Inactive vehicles
          </span>

          <span>
            {stats.stoppedPercentage}%
          </span>
        </div>

      </div>

      {/* Average Speed */}
      <div className="average-speed">

        <div className="speed-icon">
          <FaTachometerAlt />
        </div>

        <div className="speed-content">

          <span>
            Average Speed
          </span>

          <strong>
            {stats.avgSpeed}
            <small> km/h</small>
          </strong>

        </div>

      </div>

    </section>
  );
}

export default FleetSummary;