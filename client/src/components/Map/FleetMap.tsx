import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import { useEffect, useRef } from "react";
import type { Vehicle } from "../../types/vehicle";
import "./FleetMap.css";

// -------------------- Truck Icons --------------------

const runningTruckIcon = L.divIcon({
  className: "",
  html: `
    <div class="truck-marker running">
      🚚
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const stoppedTruckIcon = L.divIcon({
  className: "",
  html: `
    <div class="truck-marker stopped">
      🚛
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

// -------------------- Auto Focus --------------------

function SetView({
  position,
  zoom,
}: {
  position: LatLngExpression;
  zoom: number;
}) {
  const map = useMap();

  useEffect(() => {
    map.setView(position, zoom);
  }, [map, position, zoom]);

  return null;
}

// -------------------- Props --------------------

interface FleetMapProps {
  vehicles: Vehicle[];
  search: string;
  onVehicleSelect: (vehicle: Vehicle) => void;
}

// -------------------- Component --------------------

function FleetMap({
  vehicles,
  search,
  onVehicleSelect,
}: FleetMapProps) {
  const defaultPosition: LatLngExpression = [18.5204, 73.8567];

  const markerRefs = useRef<Record<number, L.Marker | null>>({});

  // Search Vehicle
  const selectedVehicle = vehicles.find(
    (v) =>
      search.trim() !== "" &&
      (v.id.toString() === search.trim() ||
        v.name.toLowerCase().includes(search.toLowerCase()))
  );

  // Auto Open Popup
  useEffect(() => {
    if (!selectedVehicle) return;

    const marker = markerRefs.current[selectedVehicle.id];

    if (marker) {
      marker.openPopup();
    }
  }, [selectedVehicle]);

  return (
    <MapContainer
      center={defaultPosition}
      zoom={12}
      style={{ width: "100%", height: "100%" }}
    >
      {/* Auto Focus */}
      <SetView
        position={
          selectedVehicle
            ? [selectedVehicle.lat, selectedVehicle.lng]
            : defaultPosition
        }
        zoom={selectedVehicle ? 16 : 12}
      />

      {/* Map Tiles */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />

      {/* Vehicles */}
      {vehicles.map((vehicle) => {
        const isSelected = selectedVehicle?.id === vehicle.id;

        const selectedIcon = L.divIcon({
          className: "",
          html: `
            <div class="truck-marker selected">
              ${vehicle.status === "Running" ? "🚚" : "🚛"}
            </div>
          `,
          iconSize: [46, 46],
          iconAnchor: [23, 23],
        });

        return (
          <Marker
            key={vehicle.id}
            position={[vehicle.lat, vehicle.lng]}
            icon={
              isSelected
                ? selectedIcon
                : vehicle.status === "Running"
                ? runningTruckIcon
                : stoppedTruckIcon
            }
            ref={(ref) => {
              markerRefs.current[vehicle.id] = ref;
            }}
            eventHandlers={{
              click: () => onVehicleSelect(vehicle),
            }}
          >
            <Popup>
              <strong>{vehicle.name}</strong>
              <br />
              Driver: {vehicle.driver}
              <br />
              Speed: {vehicle.speed} km/h
              <br />
              Status: {vehicle.status}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

export default FleetMap;