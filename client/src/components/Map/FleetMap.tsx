import { useEffect, useMemo, useRef } from "react";
import L, { type LatLngExpression } from "leaflet";
import {
  MapContainer,
  Marker,
  Pane,
  Polyline,
  Popup,
  TileLayer,
  ZoomControl,
  useMap,
} from "react-leaflet";
import type { Vehicle } from "../../types/vehicle";
import AnimatedMarker from "../AnimatedMarker/AnimatedMarker";
import "./FleetMap.css";

const DEFAULT_POSITION: LatLngExpression = [18.5204, 73.8567];
const DEFAULT_TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const DEFAULT_ATTRIBUTION = "&copy; OpenStreetMap contributors";

function truckIcon(status: "running" | "stopped" | "selected") {
  const size = status === "selected" ? 48 : 42;
  return L.divIcon({
    className: "",
    html: `<div class="truck-marker ${status}" role="img" aria-label="${status === "stopped" ? "Stopped" : "Running"} vehicle"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h11v10H3V5Zm12 4h3.6L21 12v3h-6V9Zm-9 7a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm11 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" /></svg></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

const RUNNING_ICON = truckIcon("running");
const STOPPED_ICON = truckIcon("stopped");
const SELECTED_ICON = truckIcon("selected");

function FocusSelectedVehicle({
  selectedVehicle,
}: {
  selectedVehicle: Vehicle | null;
}) {
  const map = useMap();
  const lastFocusedId = useRef<number | null | undefined>(undefined);

  useEffect(() => {
    const selectedId = selectedVehicle?.id ?? null;
    if (lastFocusedId.current === selectedId) return;
    lastFocusedId.current = selectedId;

    const position: LatLngExpression = selectedVehicle
      ? [selectedVehicle.lat, selectedVehicle.lng]
      : DEFAULT_POSITION;
    map.flyTo(position, selectedVehicle ? 15 : 11, {
      duration: 0.8,
      easeLinearity: 0.35,
    });
  }, [map, selectedVehicle?.id]);

  return null;
}

function FitSelectedRoute({
  selectedVehicle,
}: {
  selectedVehicle: Vehicle | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!selectedVehicle?.route || selectedVehicle.route.length < 2) return;
    map.fitBounds(selectedVehicle.route, { padding: [60, 60] });
  }, [map, selectedVehicle?.id]);

  return null;
}

interface FleetMapProps {
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  onVehicleSelect: (vehicle: Vehicle) => void;
  /** Configure a production-approved tile provider without changing this component. */
  tileUrl?: string;
  tileAttribution?: string;
}

function FleetMap({
  vehicles,
  selectedVehicle,
  onVehicleSelect,
  tileUrl = DEFAULT_TILE_URL,
  tileAttribution = DEFAULT_ATTRIBUTION,
}: FleetMapProps) {
  const markerRefs = useRef<Record<number, L.Marker | null>>({});
  const { runningCount, stoppedCount } = useMemo(() => {
    let runningCount = 0;
    let stoppedCount = 0;
    for (const vehicle of vehicles) {
      if (vehicle.status === "Running") runningCount += 1;
      else if (vehicle.status === "Stopped") stoppedCount += 1;
    }
    return { runningCount, stoppedCount };
  }, [vehicles]);


  return (
    <MapContainer
      center={DEFAULT_POSITION}
      zoom={11}
      zoomControl={false}
      style={{ width: "100%", height: "100%" }}
      aria-label="Live fleet map"
    >
      <FocusSelectedVehicle selectedVehicle={selectedVehicle} />
      <FitSelectedRoute selectedVehicle={selectedVehicle} />
      <ZoomControl position="bottomright" />
      <TileLayer attribution={tileAttribution} url={tileUrl} />

      {selectedVehicle?.route && selectedVehicle.route.length > 1 && (
        <Polyline
          positions={selectedVehicle.route}
          pathOptions={{
            color: "#2563eb",
            weight: 5,
            opacity: 0.85,
            dashArray: "10 8",
          }}
        />
      )}
      {selectedVehicle?.route && selectedVehicle.route.length > 0 && (
        <Marker position={selectedVehicle.route[0]}>
          <Popup>
            <strong>Trip started</strong>
          </Popup>
        </Marker>
      )}
      {selectedVehicle?.route && selectedVehicle.route.length > 1 && (
        <Marker
          position={selectedVehicle.route[selectedVehicle.route.length - 1]}
        >
          <Popup>
            <strong>Destination</strong>
          </Popup>
        </Marker>
      )}

      {vehicles.map((vehicle) => {
        const selected = selectedVehicle?.id === vehicle.id;
        const icon = selected
          ? SELECTED_ICON
          : vehicle.status === "Running"
            ? RUNNING_ICON
            : STOPPED_ICON;
        return (
          <AnimatedMarker
            key={vehicle.id}
            vehicle={vehicle}
            icon={icon}
            markerRef={(marker) => {
              markerRefs.current[vehicle.id] = marker;
            }}
            onClick={onVehicleSelect}
          />
        );
      })}

      <Pane name="fleet-map-overlay" style={{ zIndex: 650 }}>
        <aside className="map-overlay" aria-label="Fleet status">
          <div className="overlay-card">
            <div className="overlay-live">
              <span className="live-dot" />
              Live
            </div>
            <h3>{vehicles.length}</h3>
            <p>Total vehicles</p>
            <div className="overlay-stats">
              <span>
                Running <strong>{runningCount}</strong>
              </span>
              <span>
                Stopped <strong>{stoppedCount}</strong>
              </span>
            </div>
          </div>
        </aside>
      </Pane>
    </MapContainer>
  );
}

export default FleetMap;
