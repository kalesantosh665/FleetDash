import "./Notifications.css";
import { useSocket } from "../../context/SocketContext";

function Notifications() {

  const { alerts } = useSocket();

  const getAlertClass = (
    severity: string
  ) => {

    switch (severity) {

      case "HIGH":
        return "danger";

      case "MEDIUM":
        return "warning";

      default:
        return "success";

    }

  };

  return (

    <div className="notifications-card">

      <h2>
        🔔 Live Notifications ({alerts.length})
      </h2>

      {alerts.length === 0 ? (

        <div className="notification success">
          No Live Alerts
        </div>

      ) : (

        alerts.map((alert) => (

          <div
            key={alert.id}
            className={`notification ${getAlertClass(alert.severity)}`}
          >
            <strong>{alert.message}</strong>

            <br />

            <small>
              {new Date(alert.timestamp).toLocaleTimeString()}
            </small>

          </div>

        ))

      )}

    </div>

  );

}

export default Notifications;