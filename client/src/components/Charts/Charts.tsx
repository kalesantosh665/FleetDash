import "./Charts.css";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import {
  FaChartLine,
  FaTruck,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

interface ChartsProps {
  stats: {
    totalVehicles: number;
    runningVehicles: number;
    stoppedVehicles: number;
    averageSpeed: number;
  };
}

function Charts({ stats }: ChartsProps) {
  /*
   * Current dashboard metrics.
   *
   * We are not creating fake historical data.
   * These values come directly from the existing API stats.
   */

  const lineData = [
    {
      name: "Total",
      value: stats.totalVehicles,
    },
    {
      name: "Running",
      value: stats.runningVehicles,
    },
    {
      name: "Stopped",
      value: stats.stoppedVehicles,
    },
  ];

  const pieData = [
    {
      name: "Running",
      value: stats.runningVehicles,
    },
    {
      name: "Stopped",
      value: stats.stoppedVehicles,
    },
  ];

  const COLORS = ["#22C55E", "#EF4444"];

  const runningPercentage =
    stats.totalVehicles > 0
      ? Math.round(
          (stats.runningVehicles /
            stats.totalVehicles) *
            100
        )
      : 0;

  return (
    <section className="analytics-section">

      {/* =========================
          Analytics Header
      ========================= */}

      <div className="analytics-header">

        <div className="analytics-title">

          <div className="analytics-icon">
            <FaChartLine />
          </div>

          <div>
            <h2>Live Fleet Analytics</h2>

            <p>
              Real-time overview of your fleet performance
            </p>
          </div>

        </div>

        <div className="analytics-live">
          <span className="analytics-live-dot"></span>
          Live Data
        </div>

      </div>

      {/* =========================
          Analytics Grid
      ========================= */}

      <div className="analytics-grid">

        {/* =========================
            Fleet Overview
        ========================= */}

        <div className="chart-card overview-card">

          <div className="chart-card-header">

            <div>
              <h3>Fleet Overview</h3>

              <p>
                Current vehicle status
              </p>
            </div>

            <div className="chart-header-icon blue">
              <FaTruck />
            </div>

          </div>

          <div className="chart-container">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <LineChart
                data={lineData}
                margin={{
                  top: 10,
                  right: 15,
                  left: -15,
                  bottom: 5,
                }}
              >

                <CartesianGrid
                  strokeDasharray="4 4"
                  vertical={false}
                  stroke="#E2E8F0"
                />

                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#64748B",
                    fontSize: 12,
                  }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                  tick={{
                    fill: "#64748B",
                    fontSize: 12,
                  }}
                />

                <Tooltip
                  cursor={{
                    stroke: "#CBD5E1",
                    strokeDasharray: "4 4",
                  }}
                  contentStyle={{
                    border: "none",
                    borderRadius: "12px",
                    boxShadow:
                      "0 10px 30px rgba(15,23,42,.12)",
                    padding: "10px 14px",
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#2563EB"
                  strokeWidth={3}
                  dot={{
                    r: 5,
                    fill: "#2563EB",
                    strokeWidth: 3,
                    stroke: "#FFFFFF",
                  }}
                  activeDot={{
                    r: 7,
                  }}
                  animationDuration={900}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* =========================
            Vehicle Status
        ========================= */}

        <div className="chart-card status-card">

          <div className="chart-card-header">

            <div>
              <h3>Vehicle Status</h3>

              <p>
                Running vs stopped
              </p>
            </div>

            <div className="chart-header-icon green">
              <FaCheckCircle />
            </div>

          </div>

          <div className="pie-container">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <PieChart>

                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="48%"
                  innerRadius={58}
                  outerRadius={82}
                  paddingAngle={4}
                  stroke="none"
                  animationDuration={900}
                >

                  {pieData.map(
                    (_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index]}
                      />
                    )
                  )}

                </Pie>

                <Tooltip
                  contentStyle={{
                    border: "none",
                    borderRadius: "12px",
                    boxShadow:
                      "0 10px 30px rgba(15,23,42,.12)",
                  }}
                />

                <Legend
                  verticalAlign="bottom"
                  height={30}
                  iconType="circle"
                  formatter={(value) => (
                    <span className="legend-text">
                      {value}
                    </span>
                  )}
                />

              </PieChart>

            </ResponsiveContainer>

            <div className="pie-center">

              <strong>
                {runningPercentage}%
              </strong>

              <span>
                Running
              </span>

            </div>

          </div>

        </div>

      </div>

      {/* =========================
          Bottom KPI Row
      ========================= */}

      <div className="analytics-kpis">

        <div className="analytics-kpi">

          <div className="kpi-icon blue">
            <FaTruck />
          </div>

          <div>
            <span>Total Vehicles</span>
            <strong>
              {stats.totalVehicles}
            </strong>
          </div>

        </div>

        <div className="analytics-kpi">

          <div className="kpi-icon green">
            <FaCheckCircle />
          </div>

          <div>
            <span>Running Vehicles</span>
            <strong>
              {stats.runningVehicles}
            </strong>
          </div>

        </div>

        <div className="analytics-kpi">

          <div className="kpi-icon red">
            <FaExclamationTriangle />
          </div>

          <div>
            <span>Stopped Vehicles</span>
            <strong>
              {stats.stoppedVehicles}
            </strong>
          </div>

        </div>

        <div className="analytics-kpi">

          <div className="kpi-icon orange">
            <FaChartLine />
          </div>

          <div>
            <span>Average Speed</span>
            <strong>
              {stats.averageSpeed}
              <small> km/h</small>
            </strong>
          </div>

        </div>

      </div>

    </section>
  );
}

export default Charts;