import "./Notifications.css";

interface Notification {
  id: number;
  message: string;
  type: "success" | "warning" | "danger";
}

const notifications: Notification[] = [
  {
    id: 1,
    message: "Truck 12 started a trip",
    type: "success",
  },
  {
    id: 2,
    message: "Truck 5 overspeed (92 km/h)",
    type: "warning",
  },
  {
    id: 3,
    message: "Truck 8 stopped",
    type: "danger",
  },
  {
    id: 4,
    message: "Truck 20 resumed journey",
    type: "success",
  },
];

function Notifications() {
  return (
    <div className="notifications-card">
      <h2>🔔 Live Notifications</h2>

      {notifications.map((item) => (
        <div
          key={item.id}
          className={`notification ${item.type}`}
        >
          {item.message}
        </div>
      ))}
    </div>
  );
}

export default Notifications;