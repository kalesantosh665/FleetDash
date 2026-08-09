import "./VehicleDetails.css";
import type { Vehicle } from "../../types/vehicle";

interface Props {
  vehicle: Vehicle | null;
}

function VehicleDetails({ vehicle }: Props) {
  // No vehicle selected
  if (!vehicle) {
    return (
      <div className="vehicle-details">
        <div className="vehicle-header">
          <div>
            <h2>🚚 Vehicle Details</h2>
          </div>
        </div>

        <div className="empty-state">
          <div className="empty-icon">🚚</div>

          <p>Select a vehicle from the map.</p>
        </div>
      </div>
    );
  }

  // =========================
  // Real Vehicle Data
  // =========================

  const fuel = Math.round(vehicle.fuel);
  const battery = Math.round(vehicle.battery);

  const speedPercentage = Math.min(
    Math.max(vehicle.speed, 0),
    100,
  );

  const fuelPercentage = Math.min(
    Math.max(fuel, 0),
    100,
  );

  const batteryPercentage = Math.min(
    Math.max(battery, 0),
    100,
  );

  return (
    <div className="vehicle-details">

      {/* =========================
          Header
      ========================= */}

      <div className="vehicle-header">
        <div>
          <h2>🚚 Vehicle Details</h2>

          <p>
            Vehicle #{vehicle.id}
          </p>
        </div>

        <span
          className={
            vehicle.status === "Running"
              ? "status running"
              : "status stopped"
          }
        >
          {vehicle.status}
        </span>
      </div>

      {/* =========================
          Vehicle Name
      ========================= */}

      <div className="vehicle-name">
        {vehicle.name}
      </div>

      {/* =========================
          Driver
      ========================= */}

      <div className="driver-card">
        <div className="avatar">
          👨‍✈️
        </div>

        <div>
          <strong>
            {vehicle.driver}
          </strong>

          <p>Fleet Driver</p>
        </div>
      </div>

      {/* =========================
          Speed
      ========================= */}

      <div className="speed-card">
        <h3>Speed</h3>

        <div className="speed-value">
          {vehicle.speed}
          <span> km/h</span>
        </div>

        <div className="progress">
          <div
            className="progress-fill speed-fill"
            style={{
              width: `${speedPercentage}%`,
            }}
          />
        </div>
      </div>

      {/* =========================
          Fuel
      ========================= */}

      <div className="metric">
        <div className="metric-head">
          <span>Fuel</span>

          <span>
            {fuel}%
          </span>
        </div>

        <div className="progress">
          <div
            className="progress-fill"
            style={{
              width: `${fuelPercentage}%`,
            }}
          />
        </div>
      </div>

      {/* =========================
          Battery
      ========================= */}

      <div className="metric">
        <div className="metric-head">
          <span>Battery</span>

          <span>
            {battery}%
          </span>
        </div>

        <div className="progress">
          <div
            className="progress-fill battery"
            style={{
              width: `${batteryPercentage}%`,
            }}
          />
        </div>
      </div>

      {/* =========================
          Vehicle Information
      ========================= */}

      <div className="vehicle-info">

        <div className="info-row">
          <span>Vehicle ID</span>

          <strong>
            #{vehicle.id}
          </strong>
        </div>

        <div className="info-row">
          <span>Latitude</span>

          <strong>
            {vehicle.lat.toFixed(4)}
          </strong>
        </div>

        <div className="info-row">
          <span>Longitude</span>

          <strong>
            {vehicle.lng.toFixed(4)}
          </strong>
        </div>

        <div className="info-row">
          <span>Updated</span>

          <strong>
            Just Now
          </strong>
        </div>

      </div>

      {/* =========================
          Route Button
      ========================= */}

      <button className="route-btn">
        View Route
      </button>

    </div>
  );
}

export default VehicleDetails;