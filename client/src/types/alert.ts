export interface Alert {
  id: string;
  vehicleId: number;
  vehicleName: string;

  type:
    | "OVERSPEED"
    | "LOW_FUEL"
    | "LOW_BATTERY";

  severity:
    | "HIGH"
    | "MEDIUM";

  message: string;

  timestamp: string;
}