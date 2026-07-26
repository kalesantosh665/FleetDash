import "./VehicleDetails.css";
import "./VehicleDetails.css";
import type { Vehicle } from "../../types/vehicle";


interface Props {
  vehicle: Vehicle | null;
}

function VehicleDetails({ vehicle }: Props) {
  if (!vehicle) {
    return (
      <div className="details-card">
        <h2>🚚 Vehicle Details</h2>
        <p>Select a vehicle from the map.</p>
      </div>
    );
  }

  return (
    <div className="details-card">
      <h2>{vehicle.name}</h2>

      <div className="detail-row">
        <strong>Driver</strong>
        <span>{vehicle.driver}</span>
      </div>

      <div className="detail-row">
        <strong>Speed</strong>
        <span>{vehicle.speed} km/h</span>
      </div>

      <div className="detail-row">
        <strong>Status</strong>
        <span>{vehicle.status}</span>
      </div>

      <div className="detail-row">
        <strong>Latitude</strong>
        <span>{vehicle.lat.toFixed(4)}</span>
      </div>

      <div className="detail-row">
        <strong>Longitude</strong>
        <span>{vehicle.lng.toFixed(4)}</span>
      </div>

      <div className="detail-row">
        <strong>Fuel</strong>
        <span>{Math.floor(Math.random() * 40 + 60)}%</span>
      </div>

      <div className="detail-row">
        <strong>Battery</strong>
        <span>{Math.floor(Math.random() * 20 + 80)}%</span>
      </div>

      <div className="detail-row">
        <strong>Updated</strong>
        <span>Just Now</span>
      </div>
    </div>
  );
}

export default VehicleDetails;