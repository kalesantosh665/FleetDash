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
      (vehicle) => vehicle.id === selectedVehicleId
    ) ?? null;

  const totalVehicles = liveVehicles.length;

  const runningVehicles = liveVehicles.filter(
    (vehicle) => vehicle.status === "Running"
  ).length;

  const stoppedVehicles = liveVehicles.filter(
    (vehicle) => vehicle.status === "Stopped"
  ).length;

  return (
    <div className="live-map-page">

      {/* =================================
          Header
      ================================= */}

      <div className="live-map-header">

        <div>
          <h1>🗺 Live Fleet Map</h1>

          <p>
            Track your fleet vehicles in real time.
          </p>
        </div>

        <div className="map-stats">

          <div className="stat-box">
            <span className="stat-label">
              🚚 Total
            </span>

            <span className="stat-value">
              {totalVehicles}
            </span>
          </div>

          <div className="stat-box">
            <span className="stat-label">
              🟢 Running
            </span>

            <span className="stat-value running">
              {runningVehicles}
            </span>
          </div>

          <div className="stat-box">
            <span className="stat-label">
              🔴 Stopped
            </span>

            <span className="stat-value stopped">
              {stoppedVehicles}
            </span>
          </div>

        </div>

      </div>


      {/* =================================
          Map + Vehicle Details
      ================================= */}

      <div className="live-map-content">

        {/* MAP */}

        <div className="map-panel">

          <FleetMap
            vehicles={liveVehicles}
            selectedVehicle={selectedVehicle}
            onVehicleSelect={(vehicle: Vehicle) => {
              setSelectedVehicleId(vehicle.id);
            }}
          />

        </div>


        {/* VEHICLE DETAILS */}

        <div className="vehicle-details-wrapper">

          <VehicleDetails
            vehicle={selectedVehicle}
          />

        </div>

      </div>

    </div>
  );
}

export default LiveMap;