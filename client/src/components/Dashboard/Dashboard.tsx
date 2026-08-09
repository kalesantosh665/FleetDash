import {
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
  useState,
} from "react";
import { motion } from "framer-motion";
import {
  FaExclamationTriangle,
  FaRoute,
  FaTruck,
  FaUserCheck,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import type { Vehicle } from "../../types/vehicle";
import Charts from "../Charts/Charts";
import FleetSummary from "../FleetSummary/FleetSummary";
import LiveActivity from "../LiveActivity/LiveActivity";
import FleetMap from "../Map/FleetMap";
import RecentAlerts from "../RecentAlerts/RecentAlerts";
import RecentTrips from "../RecentTrips/RecentTrips";
import VehicleDetails from "../VehicleDetails/VehicleDetails";
import Weather from "../Weather/Weather";
import "./Dashboard.css";

interface DashboardProps {
  search: string;
  liveVehicles: Vehicle[];
}
interface DashboardStats {
  totalVehicles: number;
  runningVehicles: number;
  stoppedVehicles: number;
  averageSpeed: number;
}
interface MetricCard {
  id: string;
  label: string;
  value: string | number;
  detail: string;
  tone: "blue" | "green" | "amber" | "red";
  icon: ReactNode;
}

function getGreeting() {
  const hour = new Date().getHours();
  return hour < 12
    ? "Good morning"
    : hour < 18
      ? "Good afternoon"
      : "Good evening";
}

function Dashboard({ search, liveVehicles }: DashboardProps) {
  const { alerts } = useSocket();
  const { user } = useAuth();
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(
    null,
  );

  const stats = useMemo<DashboardStats>(() => {
    let runningVehicles = 0;
    let stoppedVehicles = 0;
    let speedTotal = 0;
    for (const vehicle of liveVehicles) {
      if (vehicle.status === "Running") runningVehicles += 1;
      else if (vehicle.status === "Stopped") stoppedVehicles += 1;
      speedTotal += vehicle.speed;
    }
    return {
      totalVehicles: liveVehicles.length,
      runningVehicles,
      stoppedVehicles,
      averageSpeed: liveVehicles.length
        ? Math.round(speedTotal / liveVehicles.length)
        : 0,
    };
  }, [liveVehicles]);

  useEffect(() => {
    const value = search.trim().toLowerCase().replace(/[\s-]/g, "");
    if (!value) {
      setSelectedVehicleId(null);
      return;
    }
    const match = liveVehicles.find(
      (vehicle) =>
        String(vehicle.id) === value ||
        vehicle.name.toLowerCase().replace(/[\s-]/g, "") === value ||
        vehicle.driver.toLowerCase().replace(/[\s-]/g, "") === value,
    );
    setSelectedVehicleId(match?.id ?? null);
  }, [search]);

  const selectedVehicle = useMemo(
    () =>
      liveVehicles.find((vehicle) => vehicle.id === selectedVehicleId) ?? null,
    [liveVehicles, selectedVehicleId],
  );
  const selectVehicle = useCallback(
    (vehicle: Vehicle) => setSelectedVehicleId(vehicle.id),
    [],
  );

  const cards = useMemo<MetricCard[]>(
    () => [
      {
        id: "total",
        label: "Total Vehicles",
        value: stats.totalVehicles,
        detail: "Live fleet vehicles",
        tone: "blue",
        icon: <FaTruck />,
      },
      {
        id: "running",
        label: "Running Vehicles",
        value: stats.runningVehicles,
        detail: "Active right now",
        tone: "green",
        icon: <FaUserCheck />,
      },
      {
        id: "speed",
        label: "Average Speed",
        value: `${stats.averageSpeed} km/h`,
        detail: "Across the live fleet",
        tone: "amber",
        icon: <FaRoute />,
      },
      {
        id: "alerts",
        label: "Active Alerts",
        value: alerts.length,
        detail: alerts.length ? "Needs attention" : "All clear",
        tone: "red",
        icon: <FaExclamationTriangle />,
      },
    ],
    [alerts.length, stats],
  );

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Fleet operations</p>
          <h1>
            {getGreeting()}, {user?.name?.split(" ")[0] ?? "Operator"}
          </h1>
          <p>
            Monitor live fleet health, route activity, and alerts in one place.
          </p>
        </div>
        <div className="dashboard-live-status">
          <span />
          Live data
        </div>
      </header>

      <section className="metric-grid" aria-label="Fleet statistics">
        {cards.map((card, index) => (
          <motion.article
            key={card.id}
            className={`metric-card metric-card--${card.tone}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.07 }}
            whileHover={{ y: -4 }}
          >
            <div className="metric-card__top">
              <h2>{card.label}</h2>
              <span className="metric-card__icon" aria-hidden="true">
                {card.icon}
              </span>
            </div>
            <strong className="metric-card__value">{card.value}</strong>
            <p
              className={
                card.tone === "red" && alerts.length
                  ? "metric-card__detail is-warning"
                  : "metric-card__detail"
              }
            >
              {card.detail}
            </p>
          </motion.article>
        ))}
      </section>

      <section className="dashboard-primary">
        <motion.section
          className="dashboard-panel map-panel"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.25 }}
          aria-labelledby="fleet-map-title"
        >
          <header className="panel-header">
            <div>
              <h2 id="fleet-map-title">Live Fleet Map</h2>
              <p>
                {stats.runningVehicles} running of {stats.totalVehicles}{" "}
                vehicles
              </p>
            </div>
            <span className="live-badge">
              <span />
              Live
            </span>
          </header>
          <div className="map-placeholder">
            <FleetMap
              vehicles={liveVehicles}
              selectedVehicle={selectedVehicle}
              onVehicleSelect={selectVehicle}
            />
          </div>
        </motion.section>
        <aside className="vehicle-details-wrapper">
          <VehicleDetails vehicle={selectedVehicle} />
        </aside>
      </section>

      <section className="dashboard-grid dashboard-grid--wide">
        <Charts stats={stats} />
        <RecentAlerts />
      </section>
      <section className="dashboard-grid dashboard-grid--wide">
        <RecentTrips search={search} />
        <LiveActivity />
      </section>
      <section className="dashboard-grid">
        <FleetSummary />
        <Weather />
      </section>
      <footer className="dashboard-footer">FleetDash &copy; 2026</footer>
    </main>
  );
}

export default Dashboard;
