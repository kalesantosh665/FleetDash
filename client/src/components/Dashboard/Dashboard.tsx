import { useEffect, useState } from "react";
import "./Dashboard.css";

import FleetMap from "../Map/FleetMap";
import Charts from "../Charts/Charts";
import RecentTrips from "../RecentTrips/RecentTrips";
import Notifications from "../Notifications/Notifications";
import VehicleDetails from "../VehicleDetails/VehicleDetails";
import type { Vehicle } from "../../types/vehicle";
import type { Stats } from "../../types/stats";
import { motion } from "framer-motion";

interface DashboardProps {
  search: string;
}



function Dashboard({ search }: DashboardProps) {
  
  const [selectedVehicle, setSelectedVehicle] =
    useState<Vehicle | null>(null);

  const [stats, setStats] = useState<Stats>({
    vehicles: 1524,
    drivers: 421,
    trips: 825,
    alerts: 18,
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const data: Vehicle[] = [];

    for (let i = 1; i <= 50; i++) {
      data.push({
        id: i,
        name: `Truck ${i}`,
        driver: `Driver ${i}`,
        speed: 40 + Math.floor(Math.random() * 40),
        status: Math.random() > 0.2 ? "Running" : "Stopped",

        x: Math.random() * 900,
        y: Math.random() * 450,
        dx: (Math.random() - 0.5) * 2,
        dy: (Math.random() - 0.5) * 2,

        lat: 18.5204 + (Math.random() - 0.5) * 0.08,
        lng: 73.8567 + (Math.random() - 0.5) * 0.08,
      });
    }

    return data;
  });

  // Live Movement
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles((prev) =>
        prev.map((vehicle) => ({
          ...vehicle,
          lat: vehicle.lat + (Math.random() - 0.5) * 0.001,
          lng: vehicle.lng + (Math.random() - 0.5) * 0.001,
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Speed + Status
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles((prev) =>
        prev.map((v) => ({
          ...v,
          speed: 40 + Math.floor(Math.random() * 40),
          status: Math.random() > 0.2 ? "Running" : "Stopped",
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Live Stats
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        vehicles: prev.vehicles + Math.floor(Math.random() * 3) - 1,
        drivers: prev.drivers + Math.floor(Math.random() * 3) - 1,
        trips: prev.trips + Math.floor(Math.random() * 5),
        alerts: Math.max(
          0,
          prev.alerts + Math.floor(Math.random() * 3) - 1
        ),
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Update Selected Vehicle
  useEffect(() => {
    if (!selectedVehicle) return;

    const updated = vehicles.find(
      (v) => v.id === selectedVehicle.id
    );

    if (updated) {
      setSelectedVehicle(updated);
    }
  }, [vehicles]);

  // Search Vehicle
  useEffect(() => {
    if (search.trim() === "") {
      setSelectedVehicle(null);
      return;
    }

    const found = vehicles.find(
      (v) =>
        v.id.toString() === search.trim() ||
        v.name.toLowerCase().includes(search.toLowerCase())
    );

    setSelectedVehicle(found ?? null);
  }, [search, vehicles]);
    return (
    <div className="dashboard">
      <h1>🚚 Fleet Dashboard</h1>

      <p className="subtitle">
        Monitor all your fleet vehicles in real time.
      </p>

    {/* Dashboard Cards */}
<div className="cards">

  <motion.div
    className="card vehicles-card"
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0 }}
     whileHover={{
    scale: 1.03,
    y: -8,
  }}

  whileTap={{
    scale: 0.98,
  }}
  >
    <h3>🚚 Total Vehicles</h3>
    <h2>{stats.vehicles}</h2>
    <p className="card-info">+12 this hour</p>
  </motion.div>

  <motion.div
    className="card drivers-card"
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.15 }}
     whileHover={{
    scale: 1.03,
    y: -8,
  }}

  whileTap={{
    scale: 0.98,
  }}
  >
    <h3>👨‍✈️ Active Drivers</h3>
    <h2>{stats.drivers}</h2>
    <p className="card-info">Available Now</p>
  </motion.div>

  <motion.div
    className="card trips-card"
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.3 }}
     whileHover={{
    scale: 1.03,
    y: -8,
  }}

  whileTap={{
    scale: 0.98,
  }}
  >
    <h3>🛣 Today's Trips</h3>
    <h2>{stats.trips}</h2>
    <p className="card-info">Completed Today</p>
  </motion.div>

  <motion.div
    className="card alerts-card"
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.45 }}
     whileHover={{
    scale: 1.03,
    y: -8,
  }}

  whileTap={{
    scale: 0.98,
  }}
  >
    <h3>⚠ Alerts</h3>
    <h2>{stats.alerts}</h2>
    <p className="card-info alert-text">
      Needs Attention
    </p>
  </motion.div>

</div>
{/* Map + Vehicle Details */}
<div className="dashboard-content">

  <motion.div
    className="map-section"
    initial={{ opacity: 0, x: -60 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.7, delay: 0.6 }}
  >
    <h2>🗺 Live Fleet Map</h2>

    <div className="map-placeholder">
      <FleetMap
        vehicles={vehicles}
        search={search}
        onVehicleSelect={setSelectedVehicle}
      />
    </div>
  </motion.div>

  <motion.div
    initial={{ opacity: 0, x: 60 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.7, delay: 0.8 }}
     
  >
    <VehicleDetails vehicle={selectedVehicle} />
  </motion.div>

</div>

      {/* Charts + Notifications */}
      <div className="bottom-section">

        <Charts
          stats={{
            totalVehicles: stats.vehicles,
            runningVehicles: vehicles.filter(
              (v) => v.status === "Running"
            ).length,
            stoppedVehicles: vehicles.filter(
              (v) => v.status === "Stopped"
            ).length,
            averageSpeed: Math.round(
              vehicles.reduce(
                (sum, v) => sum + v.speed,
                0
              ) / vehicles.length
            ),
          }}
        />

        <Notifications />

      </div>

      {/* Recent Trips */}
      <RecentTrips search={search} />

      <footer className="footer">
        FleetDash © 2026 | Designed by Santosh Kale
      </footer>
    </div>
  );
}

export default Dashboard;