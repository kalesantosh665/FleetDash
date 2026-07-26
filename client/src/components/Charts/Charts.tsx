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

interface ChartsProps {
  stats: {
    totalVehicles: number;
    runningVehicles: number;
    stoppedVehicles: number;
    averageSpeed: number;
  };
}

function Charts({ stats }: ChartsProps) {
  // Line Chart Data
  const lineData = [
    { name: "Vehicles", value: stats.totalVehicles },
    { name: "Running", value: stats.runningVehicles },
    { name: "Stopped", value: stats.stoppedVehicles },
    { name: "Avg Speed", value: stats.averageSpeed },
  ];

  // Pie Chart Data
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

  const COLORS = ["#22c55e", "#ef4444"];

  return (
    <div className="chart-card">
      <h2>📊 Live Fleet Analytics</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "20px",
          alignItems: "center",
        }}
      >
        {/* Line Chart */}
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip
                contentStyle={{
                  borderRadius: "10px",
                  border: "none",
                }}
              />

              <Line
                type="monotone"
                dataKey="value"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 5 }}
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                label
              >
                {pieData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index]}
                  />
                ))}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Charts;