import { useEffect, useState } from "react";
import "./RecentTrips.css";

interface RecentTripsProps {
  search: string;
}

interface Trip {
  vehicle: string;
  driver: string;
  status: string;
  speed: string;
  time: string;
}

function RecentTrips({ search }: RecentTripsProps) {
  // Initial Trips
  const [trips, setTrips] = useState<Trip[]>(() => {
    const data: Trip[] = [];

    for (let i = 1; i <= 50; i++) {
      data.push({
        vehicle: `Truck ${i}`,
        driver: `Driver ${i}`,
        status: Math.random() > 0.2 ? "Running" : "Stopped",
        speed: `${40 + Math.floor(Math.random() * 40)} km/h`,
        time: `${Math.floor(Math.random() * 10) + 1} min ago`,
      });
    }

    return data;
  });

  // Live Update Every 3 Seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTrips((prev) =>
        prev.map((trip) => ({
          ...trip,
          status: Math.random() > 0.2 ? "Running" : "Stopped",
          speed: `${40 + Math.floor(Math.random() * 40)} km/h`,
          time: "Just now",
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Search Filter
  const filteredTrips = trips.filter((trip) => {
    const searchText = search.trim().toLowerCase();

    return (
      searchText === "" ||
      trip.vehicle.toLowerCase().includes(searchText) ||
      trip.driver.toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="table-card">
      <h2>🚚 Recent Trips</h2>

      <table>
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
          {filteredTrips.map((trip, index) => (
            <tr key={index}>
              <td>{trip.vehicle}</td>

              <td>{trip.driver}</td>

              <td
                className={
                  trip.status === "Running"
                    ? "status-running"
                    : "status-stopped"
                }
              >
                {trip.status}
              </td>

              <td>{trip.speed}</td>

              <td>{trip.time}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredTrips.length === 0 && (
        <p
          style={{
            textAlign: "center",
            padding: "20px",
            color: "#666",
            fontWeight: "bold",
          }}
        >
          🚚 No vehicle found.
        </p>
      )}
    </div>
  );
}

export default RecentTrips;