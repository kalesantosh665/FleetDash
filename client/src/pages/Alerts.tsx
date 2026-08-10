import { useMemo, useState } from "react";
import { FaBell, FaSearch } from "react-icons/fa";
import { useSocket } from "../context/SocketContext";
import "./Alerts.css";

function formatTime(timestamp: string) {
  const date = new Date(timestamp);

  return Number.isNaN(date.getTime())
    ? "Unknown"
    : date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
}

function Alerts() {
  const { alerts } = useSocket();

  const [search, setSearch] = useState("");

  const query = search.trim().toLowerCase();

  const filteredAlerts = useMemo(
    () =>
      alerts.filter(
        (alert) =>
          !query ||
          [
            alert.vehicleName,
            alert.type,
            alert.message,
            alert.severity,
          ].some((value) =>
            value.toLowerCase().includes(query)
          )
      ),
    [alerts, query]
  );

  const counts = useMemo(
    () => ({
      high: alerts.filter(
        (alert) => alert.severity === "HIGH"
      ).length,

      medium: alerts.filter(
        (alert) => alert.severity === "MEDIUM"
      ).length,

      total: alerts.length,
    }),
    [alerts]
  );

  return (
    <main className="alerts-page">

      <header className="alerts-header">

        <div>
          <span className="alerts-eyebrow">
            <FaBell /> Live monitoring
          </span>

          <h1>Fleet Alerts</h1>

          <p>
            Active alerts from the real-time
            telemetry stream.
          </p>
        </div>

        <div className="alerts-search">
          <FaSearch />

          <input
            type="search"
            value={search}
            placeholder="Search vehicle or alert..."
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

      </header>

      <section
        className="alerts-cards"
        aria-label="Alert summary"
      >

        <article className="alert-card critical">
          <h2>{counts.high}</h2>
          <p>High priority</p>
        </article>

        <article className="alert-card warning">
          <h2>{counts.medium}</h2>
          <p>Medium priority</p>
        </article>

        <article className="alert-card info">
          <h2>{counts.total}</h2>
          <p>Active alerts</p>
        </article>

      </section>

      <section
        className="alerts-table"
        aria-label="Active alerts"
      >

        {filteredAlerts.length === 0 ? (

          <p className="alerts-empty">
            {alerts.length
              ? "No alerts match your search."
              : "No active fleet alerts."}
          </p>

        ) : (

          <table>

            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Alert</th>
                <th>Severity</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>

              {filteredAlerts.map((alert) => (

                <tr key={alert.id}>

                  <td>
                    <strong>
                      {alert.vehicleName}
                    </strong>

                    <small>
                      ID: {alert.vehicleId}
                    </small>
                  </td>

                  <td>
                    <strong>
                      {alert.type.replace(/_/g, " ")}
                    </strong>

                    <small>
                      {alert.message}
                    </small>
                  </td>

                  <td>
                    <span
                      className={`badge ${
                        alert.severity === "HIGH"
                          ? "critical"
                          : "warning"
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </td>

                  <td>
                    {formatTime(alert.timestamp)}
                  </td>

                  <td>
                    <span className="status-active">
                      Active
                    </span>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </section>

    </main>
  );
}

export default Alerts;