import { useEffect, useState } from "react";
import api from "../services/api";
import Charts from "../components/Charts/Charts";

import "./Analytics.css";

interface DashboardStats {
  totalVehicles: number;
  runningVehicles: number;
  stoppedVehicles: number;
  averageSpeed: number;
}

function Analytics() {
  const [stats, setStats] = useState<DashboardStats>({
    totalVehicles: 0,
    runningVehicles: 0,
    stoppedVehicles: 0,
    averageSpeed: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/dashboard/stats");
        setStats(res.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStats();

    const interval = setInterval(fetchStats, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="analytics-page">

      <h1>📊 Fleet Analytics</h1>

      <p className="analytics-subtitle">
        Real-time fleet performance overview
      </p>

      {/* Summary Cards */}

      <div className="analytics-cards">

        <div className="analytics-card blue">
          <h3>{stats.totalVehicles}</h3>
          <p>Total Vehicles</p>
        </div>

        <div className="analytics-card green">
          <h3>{stats.runningVehicles}</h3>
          <p>Running</p>
        </div>

        <div className="analytics-card red">
          <h3>{stats.stoppedVehicles}</h3>
          <p>Stopped</p>
        </div>

        <div className="analytics-card orange">
          <h3>{stats.averageSpeed} km/h</h3>
          <p>Average Speed</p>
        </div>

      </div>

      {/* Charts */}

      <div className="charts-section">

        <Charts stats={stats} />

      </div>

      {/* Analytics Cards */}

      <div className="performance-grid">

        <div className="performance-card">
          <h2>🚚 Fleet Performance</h2>

          <div className="progress-item">
            <span>Running Vehicles</span>

            <progress
              value={stats.runningVehicles}
              max={stats.totalVehicles || 1}
            />
          </div>

          <div className="progress-item">
            <span>Stopped Vehicles</span>

            <progress
              value={stats.stoppedVehicles}
              max={stats.totalVehicles || 1}
            />
          </div>

        </div>

        <div className="performance-card">

          <h2>📈 Daily Overview</h2>

          <p>
            🚚 Total Fleet :
            <strong> {stats.totalVehicles}</strong>
          </p>

          <p>
            🟢 Running :
            <strong> {stats.runningVehicles}</strong>
          </p>

          <p>
            🔴 Stopped :
            <strong> {stats.stoppedVehicles}</strong>
          </p>

          <p>
            ⚡ Avg Speed :
            <strong> {stats.averageSpeed} km/h</strong>
          </p>

        </div>

      </div>

    </div>
  );
}

export default Analytics;