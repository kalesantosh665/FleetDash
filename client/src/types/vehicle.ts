export interface Vehicle {
  id: number;
  name: string;
  driver: string;
  speed: number;
  status: string;

  x: number;
  y: number;
  dx: number;
  dy: number;

  lat: number;
  lng: number;
}