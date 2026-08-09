import { publisher } from "../config/redis";
import { Alert } from "../types/alert";

const activeAlerts = new Set<string>();

let alerts: Alert[] = [];

// ==============================
// Create Alert
// ==============================

export async function createAlert(alert: Alert) {
  const key = `${alert.type}-${alert.vehicleId}`;

  // Duplicate alert avoid
  if (activeAlerts.has(key)) {
    return;
  }

  activeAlerts.add(key);

  alerts.push(alert);

  await publisher.publish(
    "fleet-alerts",
    JSON.stringify(alerts),
  );

  console.log(
    "🚨 ALERT CREATED:",
    alert.message,
  );
}

// ==============================
// Clear Alert
// ==============================

export async function clearAlert(
  type: string,
  vehicleId: number,
) {
  const key = `${type}-${vehicleId}`;

  // Check whether alert actually exists
  const alertExists = alerts.some(
    (alert) =>
      alert.type === type &&
      alert.vehicleId === vehicleId,
  );

  // Nothing to clear
  if (!alertExists) {
    activeAlerts.delete(key);
    return;
  }

  activeAlerts.delete(key);

  alerts = alerts.filter(
    (alert) =>
      !(
        alert.type === type &&
        alert.vehicleId === vehicleId
      ),
  );

  await publisher.publish(
    "fleet-alerts",
    JSON.stringify(alerts),
  );

  console.log(
    `✅ Alert cleared: ${type} - Vehicle ${vehicleId}`,
  );
}

// ==============================
// Get Alerts
// ==============================

export function getAlerts() {
  return alerts;
}