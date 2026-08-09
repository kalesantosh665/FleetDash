import { useState } from "react";
import FleetMap from "../components/Map/FleetMap";
import VehicleDetails from "../components/VehicleDetails/VehicleDetails";
import { useSocket } from "../context/SocketContext";
import type { Vehicle } from "../types/vehicle";

import "./LiveMap.css";

function LiveMap() {
  const { liveVehicles } = useSocket();

  const [selectedVehicleId, setSelectedVehicleId] =
    useState<number | null>(null);

  const selectedVehicle =
    liveVehicles.find(
      (v) => v.id === selectedVehicleId
    ) ?? null;

  const totalVehicles = liveVehicles.length;

  const runningVehicles =
    liveVehicles.filter(
      (v) => v.status === "Running"
    ).length;

  const stoppedVehicles =
    liveVehicles.filter(
      (v) => v.status === "Stopped"
    ).length;

  return (
    <div className="live-map-page">

      {/* Header */}

      <div className="live-map-header">

        <div>

          <h1>🗺 Live Fleet Map</h1>

          <p>
            Track your fleet vehicles in real time.
          </p>

        </div>

        <div className="map-stats">

          <div className="stat-box">
            🚚 Total
            <span>{totalVehicles}</span>
          </div>

          <div className="stat-box">
            🟢 Running
            <span>{runningVehicles}</span>
          </div>

          <div className="stat-box">
            🔴 Stopped
            <span>{stoppedVehicles}</span>
          </div>

        </div>

      </div>

      {/* Map + Details */}

      <div className="live-map-content">

  <div className="map-panel">

    <FleetMap
      vehicles={liveVehicles}
      selectedVehicle={selectedVehicle}
      onVehicleSelect={(vehicle: Vehicle) =>
        setSelectedVehicleId(vehicle.id)
      }
    />

    <div className="floating-details">
      <VehicleDetails vehicle={selectedVehicle} />
    </div>

  </div>

</div>

    </div>
  );
}

export default LiveMap;