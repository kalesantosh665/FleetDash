import { useMemo } from "react";
import { useSocket } from "../../context/SocketContext";
import "./RecentTrips.css";

interface RecentTripsProps {
  search: string;
}

function RecentTrips({ search }: RecentTripsProps) {
  const { liveVehicles } = useSocket();

  const searchText = search.trim().toLowerCase();

  const filteredVehicles = useMemo(() => {
    return liveVehicles.filter((vehicle) => {
      if (!searchText) {
        return true;
      }

      const vehicleName = vehicle.name
        .toLowerCase()
        .replace(/[-\s]/g, "");

      const driverName = vehicle.driver
        .toLowerCase()
        .replace(/[-\s]/g, "");

      const query = searchText.replace(/[-\s]/g, "");

      return (
        vehicleName.includes(query) ||
        driverName.includes(query) ||
         vehicle.id.toString() === query
      );
    });
  }, [liveVehicles, searchText]);

  const runningCount = filteredVehicles.filter(
    (vehicle) => vehicle.status === "Running",
  ).length;

  const stoppedCount = filteredVehicles.filter(
    (vehicle) => vehicle.status === "Stopped",
  ).length;

  return (
    <section>
      {/* Header */}

      <div className="recent-trips-header">
        <div className="recent-trips-title">
          <div className="trips-icon">🚚</div>

          <div>
            <h2>Recent Trips</h2>

            <p>
              Latest fleet vehicle activity
            </p>
          </div>
        </div>

        <div className="trips-live">
          <span className="trips-live-dot"></span>
          Live
        </div>
      </div>

      {/* Summary */}

      <div className="trips-summary">
        <div className="summary-item">
          <strong>
            {filteredVehicles.length}
          </strong>

          <span>Vehicles</span>
        </div>

        <div className="summary-item">
          <strong className="running-count">
            {runningCount}
          </strong>

          <span>Running</span>
        </div>

        <div className="summary-item">
          <strong className="stopped-count">
            {stoppedCount}
          </strong>

          <span>Stopped</span>
        </div>
      </div>

      {/* Table */}

      <div className="trips-table-wrapper">
        <table className="recent-trips-table">
          <thead>
            <tr>
              <th>Vehicle</th>
              <th>Driver</th>
              <th>Status</th>
              <th>Speed</th>
              <th>Last Update</th>
            </tr>
          </thead>

          <tbody>
            {filteredVehicles
              .slice(0, 10)
              .map((vehicle) => (
                <tr key={vehicle.id}>
                  {/* Vehicle */}

                  <td>
                    <div className="vehicle-cell">
                      <span className="vehicle-mini-icon">
                        🚚
                      </span>

                      <strong>
                        {vehicle.name}
                      </strong>
                    </div>
                  </td>

                  {/* Driver */}

                  <td>
                    <div className="driver-cell">
                      <span className="driver-avatar">
                        👤
                      </span>

                      {vehicle.driver}
                    </div>
                  </td>

                  {/* Status */}

                  <td>
                    <span
                      className={
                        vehicle.status === "Running"
                          ? "trip-status running"
                          : "trip-status stopped"
                      }
                    >
                      <span className="status-dot"></span>

                      {vehicle.status}
                    </span>
                  </td>

                  {/* Speed */}

                  <td>
                    <strong className="speed-value">
                      {vehicle.speed} km/h
                    </strong>
                  </td>

                  {/* Last Update */}

                  <td>
                    <span className="trip-time">
                      Just now
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* No Vehicles */}

        {filteredVehicles.length === 0 && (
          <div className="no-trips">
            <div>🚚</div>

            <strong>
              No vehicle found
            </strong>

            <p>
              Try searching another vehicle
              or driver.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}

      {filteredVehicles.length > 10 && (
        <div className="trips-footer">
          Showing 10 of{" "}
          {filteredVehicles.length} vehicles
        </div>
      )}
    </section>
  );
}

export default RecentTrips;