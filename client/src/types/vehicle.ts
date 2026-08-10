export interface Vehicle {
  _id?: string;

  id: number;
  name: string;
  driver: string;

  lat: number;
  lng: number;

  speed: number;
  status: "Running" | "Stopped";

  fuel: number;
  battery: number;

  route: [number, number][];
}