import { publisher } from "../config/redis";
import {
  createAlert,
  clearAlert,
} from "./alert.service";

import { Alert } from "../types/alert";
export interface Vehicle {
  id: number;
  name: string;
  driver: string;

  lat: number;
  lng: number;

  dLat: number;
  dLng: number;

  speed: number;
  status: "Running" | "Stopped";

  fuel: number;
  battery: number;
  route: [number, number][];
  x: number;
  y: number;
  dx: number;
  dy: number;
}

let vehicles: Vehicle[] = [];

export function createVehicles() {
  vehicles = Array.from({ length: 50 }, (_, index) => ({
    id: index + 1,
    name: `Truck-${index + 1}`,
    driver: `Driver ${index + 1}`,

    lat: 18.5204 + (Math.random() - 0.5) * 0.05,
    lng: 73.8567 + (Math.random() - 0.5) * 0.05,

    dLat: (Math.random() - 0.5) * 0.001,
    dLng: (Math.random() - 0.5) * 0.001,

    speed: Math.floor(Math.random() * 40) + 40,
    status: "Running",

    fuel: Math.floor(Math.random() * 60) + 40,
battery: Math.floor(Math.random() * 40) + 60,
    route: [],

    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
  }));

  return vehicles;
}

export async function moveVehicles() {
  for (const vehicle of vehicles) {
    vehicle.lat += vehicle.dLat;
    vehicle.lng += vehicle.dLng;
vehicle.route.push([
  vehicle.lat,
  vehicle.lng,
]);

if (vehicle.route.length > 30) {
  vehicle.route.shift();
}
    if (Math.random() < 0.30) {
      vehicle.dLat += (Math.random() - 0.5) * 0.0002;
      vehicle.dLng += (Math.random() - 0.5) * 0.0002;
    }

    vehicle.dLat = Math.max(
      -0.0008,
      Math.min(0.0008, vehicle.dLat)
    );

    vehicle.dLng = Math.max(
      -0.0008,
      Math.min(0.0008, vehicle.dLng)
    );

    if (vehicle.lat > 18.56 || vehicle.lat < 18.48) {
      vehicle.dLat *= -1;
    }

    if (vehicle.lng > 73.90 || vehicle.lng < 73.82) {
      vehicle.dLng *= -1;
    }

    vehicle.status =
      Math.random() < 0.05 ? "Stopped" : "Running";

   if (vehicle.status === "Stopped") {
  vehicle.speed = 0;
} else {
  vehicle.speed += Math.floor(Math.random() * 11) - 5;

  vehicle.speed = Math.max(
    40,
    Math.min(vehicle.speed, 100)
  );
}
    // Fuel decreases slowly
   // ======================
// Fuel & Battery
// ======================

if (vehicle.status === "Running") {
  // Very slow realistic consumption
  vehicle.fuel = Math.max(
    0,
    vehicle.fuel - Math.random() * 0.03
  );

  vehicle.battery = Math.max(
    0,
    vehicle.battery - Math.random() * 0.01
  );
}
    // ======================
    // Overspeed Alert
    // ======================

    if (vehicle.speed > 90) {
      const alert: Alert = {
        id: Date.now().toString(),

        vehicleId: vehicle.id,
        vehicleName: vehicle.name,

        type: "OVERSPEED",

        severity: "HIGH",

        message: `${vehicle.name} Overspeed (${vehicle.speed} km/h)`,

        timestamp: new Date().toISOString(),
      };

      await createAlert(alert);
    } else {
      await clearAlert(
        "OVERSPEED",
        vehicle.id
      );
    }
  }

  await publisher.set(
    "fleet:vehicles",
    JSON.stringify(vehicles)
  );

  await publisher.publish(
    "fleet-updates",
    JSON.stringify(vehicles)
  );

  return vehicles;
}