import { useState } from "react";
import "./Alerts.css";

interface Alert {
  id: number;
  vehicle: string;
  driver: string;
  type: string;
  severity: "Critical" | "Warning" | "Info";
  time: string;
  status: "Active" | "Resolved";
}

function Alerts() {
  const [search, setSearch] = useState("");

  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 1,
      vehicle: "Truck-12",
      driver: "Rahul",
      type: "Overspeed",
      severity: "Critical",
      time: "10:15 AM",
      status: "Active",
    },
    {
      id: 2,
      vehicle: "Truck-18",
      driver: "Amit",
      type: "Low Fuel",
      severity: "Warning",
      time: "09:45 AM",
      status: "Active",
    },
    {
      id: 3,
      vehicle: "Truck-07",
      driver: "Rakesh",
      type: "Offline",
      severity: "Critical",
      time: "09:05 AM",
      status: "Resolved",
    },
    {
      id: 4,
      vehicle: "Truck-25",
      driver: "Suresh",
      type: "Geofence",
      severity: "Info",
      time: "08:30 AM",
      status: "Active",
    },
  ]);

  const filteredAlerts = alerts.filter(
    (alert) =>
      alert.vehicle
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      alert.driver
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      alert.type
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="alerts-page">

      <div className="alerts-header">
        <h1>🚨 Fleet Alerts</h1>

        <input
          type="text"
          placeholder="Search alerts..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />
      </div>

      {/* Summary Cards */}

      <div className="alerts-cards">

        <div className="alert-card critical">
          <h3>Critical</h3>
          <h2>
            {
              alerts.filter(
                (a) =>
                  a.severity === "Critical"
              ).length
            }
          </h2>
        </div>

        <div className="alert-card warning">
          <h3>Warning</h3>
          <h2>
            {
              alerts.filter(
                (a) =>
                  a.severity === "Warning"
              ).length
            }
          </h2>
        </div>

        <div className="alert-card info">
          <h3>Info</h3>
          <h2>
            {
              alerts.filter(
                (a) =>
                  a.severity === "Info"
              ).length
            }
          </h2>
        </div>

        <div className="alert-card active">
          <h3>Active</h3>
          <h2>
            {
              alerts.filter(
                (a) =>
                  a.status === "Active"
              ).length
            }
          </h2>
        </div>

      </div>

      {/* Table */}

      <div className="alerts-table">

        <table>

          <thead>

            <tr>
              <th>Vehicle</th>
              <th>Driver</th>
              <th>Alert</th>
              <th>Severity</th>
              <th>Time</th>
              <th>Status</th>
            </tr>

          </thead>

          <tbody>

            {filteredAlerts.map((alert) => (

              <tr key={alert.id}>

                <td>{alert.vehicle}</td>

                <td>{alert.driver}</td>

                <td>{alert.type}</td>

                <td>
                  <span
                    className={`badge ${alert.severity.toLowerCase()}`}
                  >
                    {alert.severity}
                  </span>
                </td>

                <td>{alert.time}</td>

                <td>{alert.status}</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Alerts;