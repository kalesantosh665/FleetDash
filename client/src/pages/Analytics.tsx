import { useMemo } from "react";
import { useSocket } from "../context/SocketContext";
import Charts from "../components/Charts/Charts";

import "./Analytics.css";

function Analytics() {
  const { liveVehicles } = useSocket();

  const stats = useMemo(() => {
    const totalVehicles = liveVehicles.length;

    const runningVehicles = liveVehicles.filter(
      (vehicle) => vehicle.status === "Running"
    ).length;

    const stoppedVehicles = liveVehicles.filter(
      (vehicle) => vehicle.status === "Stopped"
    ).length;

    const averageSpeed =
      totalVehicles === 0
        ? 0
        : Math.round(
            liveVehicles.reduce(
              (sum, vehicle) => sum + vehicle.speed,
              0
            ) / totalVehicles
          );

    return {
      totalVehicles,
      runningVehicles,
      stoppedVehicles,
      averageSpeed,
    };
  }, [liveVehicles]);

  const runningPercentage =
    stats.totalVehicles > 0
      ? Math.round(
          (stats.runningVehicles /
            stats.totalVehicles) *
            100
        )
      : 0;

  const stoppedPercentage =
    stats.totalVehicles > 0
      ? Math.round(
          (stats.stoppedVehicles /
            stats.totalVehicles) *
            100
        )
      : 0;

  return (
    <div className="analytics-page">

      <h1>📊 Fleet Analytics</h1>

      <p className="analytics-subtitle">
        Real-time fleet performance overview
      </p>

      {/* Summary Cards */}

      <div className="analytics-cards">

        <div className="analytics-card blue">
          <h3>
            {stats.totalVehicles}
          </h3>

          <p>Total Vehicles</p>
        </div>

        <div className="analytics-card green">
          <h3>
            {stats.runningVehicles}
          </h3>

          <p>Running</p>
        </div>

        <div className="analytics-card red">
          <h3>
            {stats.stoppedVehicles}
          </h3>

          <p>Stopped</p>
        </div>

        <div className="analytics-card orange">
          <h3>
            {stats.averageSpeed} km/h
          </h3>

          <p>Average Speed</p>
        </div>

      </div>

      {/* Charts */}

      <div className="charts-section">

        <Charts stats={stats} />

      </div>

      {/* Performance */}

      <div className="performance-grid">

        <div className="performance-card">

          <h2>🚚 Fleet Performance</h2>

          <div className="progress-item">

            <span>
              Running Vehicles
            </span>

            <progress
              value={stats.runningVehicles}
              max={stats.totalVehicles || 1}
            />

            <strong>
              {runningPercentage}%
            </strong>

          </div>

          <div className="progress-item">

            <span>
              Stopped Vehicles
            </span>

            <progress
              value={stats.stoppedVehicles}
              max={stats.totalVehicles || 1}
            />

            <strong>
              {stoppedPercentage}%
            </strong>

          </div>

        </div>

        <div className="performance-card">

          <h2>📈 Live Overview</h2>

          <p>
            🚚 Total Fleet :
            <strong>
              {" "}
              {stats.totalVehicles}
            </strong>
          </p>

          <p>
            🟢 Running :
            <strong>
              {" "}
              {stats.runningVehicles}
            </strong>
          </p>

          <p>
            🔴 Stopped :
            <strong>
              {" "}
              {stats.stoppedVehicles}
            </strong>
          </p>

          <p>
            ⚡ Avg Speed :
            <strong>
              {" "}
              {stats.averageSpeed} km/h
            </strong>
          </p>

        </div>

      </div>

    </div>
  );
}

export default Analytics;
